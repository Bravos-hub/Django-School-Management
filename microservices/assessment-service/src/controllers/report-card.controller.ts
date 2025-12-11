import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { NotFoundError, ValidationError } from '@school-management/shared';
import { z } from 'zod';

export const reportCardController = {
  getByStudent: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { studentId } = req.params;
      const academicYear = req.query.academicYear as string;

      const where: any = { studentId };
      if (academicYear) {
        where.academicYear = academicYear;
      }

      const reportCards = await prisma.reportCard.findMany({
        where,
        include: {
          subjects: true,
        },
        orderBy: {
          generatedAt: 'desc',
        },
      });

      res.json({
        success: true,
        data: reportCards,
      });
    } catch (error) {
      next(error);
    }
  },

  generate: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { studentId, termId, academicYear } = z
        .object({
          studentId: z.string().uuid(),
          termId: z.string().uuid().optional(),
          academicYear: z.string(),
        })
        .parse(req.body);

      // Get all exam results for the student in the academic year
      const results = await prisma.examResult.findMany({
        where: {
          studentId,
          exam: {
            academicYear,
            ...(termId && { termId }),
          },
        },
        include: {
          exam: true,
        },
      });

      if (results.length === 0) {
        throw new NotFoundError('No results found for this period');
      }

      // Calculate totals
      const totalMarks = results.reduce(
        (sum, r) => sum + Number(r.exam.totalMarks),
        0
      );
      const marksObtained = results.reduce(
        (sum, r) => sum + (r.isAbsent ? 0 : Number(r.marksObtained)),
        0
      );
      const percentage = (marksObtained / totalMarks) * 100;

      // Group by subject
      const subjectMap = new Map();
      results.forEach((result) => {
        const subjectId = result.subjectId || 'general';
        if (!subjectMap.has(subjectId)) {
          subjectMap.set(subjectId, {
            subjectName: result.exam.name,
            subjectCode: result.subjectId,
            marksObtained: 0,
            totalMarks: 0,
          });
        }
        const subject = subjectMap.get(subjectId);
        subject.marksObtained += result.isAbsent ? 0 : Number(result.marksObtained);
        subject.totalMarks += Number(result.exam.totalMarks);
      });

      // Create report card
      const reportCard = await prisma.reportCard.create({
        data: {
          studentId,
          termId,
          academicYear,
          totalMarks,
          marksObtained,
          percentage,
          subjects: {
            create: Array.from(subjectMap.values()).map((subject) => ({
              subjectName: subject.subjectName,
              subjectCode: subject.subjectCode,
              marksObtained: subject.marksObtained,
              totalMarks: subject.totalMarks,
            })),
          },
        },
        include: {
          subjects: true,
        },
      });

      res.status(201).json({
        success: true,
        data: reportCard,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new ValidationError(error.errors[0].message));
      }
      next(error);
    }
  },
};
