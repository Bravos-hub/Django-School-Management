import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { NotFoundError, ValidationError } from '@school-management/shared';
import { z } from 'zod';

const createExamSchema = z.object({
  name: z.string().min(1),
  examType: z.enum([
    'CONTINUOUS_ASSESSMENT',
    'MID_TERM',
    'END_OF_TERM',
    'MOCK_EXAM',
    'UCE',
    'UACE',
    'PLE',
  ]),
  classId: z.string().uuid(),
  subjectId: z.string().uuid().optional(),
  termId: z.string().uuid().optional(),
  academicYear: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  totalMarks: z.number().positive(),
  passingMarks: z.number().nonnegative(),
  instructions: z.string().optional(),
});

const updateExamSchema = createExamSchema.partial();

export const examController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const classId = req.query.classId as string;
      const examType = req.query.examType as string;
      const status = req.query.status as string;

      const where: any = {};
      if (classId) where.classId = classId;
      if (examType) where.examType = examType;
      if (status) where.status = status;

      const exams = await prisma.exam.findMany({
        where,
        include: {
          results: {
            take: 5, // Sample results
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.json({
        success: true,
        data: exams,
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const exam = await prisma.exam.findUnique({
        where: { id },
        include: {
          results: {
            orderBy: {
              marksObtained: 'desc',
            },
          },
        },
      });

      if (!exam) {
        throw new NotFoundError('Exam');
      }

      res.json({
        success: true,
        data: exam,
      });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = createExamSchema.parse(req.body);

      const exam = await prisma.exam.create({
        data: {
          ...validatedData,
          startDate: validatedData.startDate
            ? new Date(validatedData.startDate)
            : undefined,
          endDate: validatedData.endDate
            ? new Date(validatedData.endDate)
            : undefined,
          totalMarks: validatedData.totalMarks,
          passingMarks: validatedData.passingMarks,
        },
      });

      res.status(201).json({
        success: true,
        data: exam,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new ValidationError(error.errors[0].message));
      }
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const validatedData = updateExamSchema.parse(req.body);

      const exam = await prisma.exam.findUnique({
        where: { id },
      });

      if (!exam) {
        throw new NotFoundError('Exam');
      }

      const updatedExam = await prisma.exam.update({
        where: { id },
        data: {
          ...validatedData,
          startDate: validatedData.startDate
            ? new Date(validatedData.startDate)
            : undefined,
          endDate: validatedData.endDate
            ? new Date(validatedData.endDate)
            : undefined,
        },
      });

      res.json({
        success: true,
        data: updatedExam,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new ValidationError(error.errors[0].message));
      }
      next(error);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const exam = await prisma.exam.findUnique({
        where: { id },
      });

      if (!exam) {
        throw new NotFoundError('Exam');
      }

      await prisma.exam.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Exam deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};
