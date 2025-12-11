import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { NotFoundError, ValidationError } from '@school-management/shared';
import { z } from 'zod';

const createResultSchema = z.object({
  examId: z.string().uuid(),
  studentId: z.string().uuid(),
  subjectId: z.string().uuid().optional(),
  marksObtained: z.number().nonnegative(),
  grade: z.string().optional(),
  remarks: z.string().optional(),
  isAbsent: z.boolean().default(false),
});

const bulkCreateResultSchema = z.object({
  examId: z.string().uuid(),
  results: z.array(
    z.object({
      studentId: z.string().uuid(),
      subjectId: z.string().uuid().optional(),
      marksObtained: z.number().nonnegative(),
      grade: z.string().optional(),
      remarks: z.string().optional(),
      isAbsent: z.boolean().default(false),
    })
  ),
});

export const resultController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const examId = req.query.examId as string;
      const studentId = req.query.studentId as string;

      const where: any = {};
      if (examId) where.examId = examId;
      if (studentId) where.studentId = studentId;

      const results = await prisma.examResult.findMany({
        where,
        include: {
          exam: true,
        },
        orderBy: {
          marksObtained: 'desc',
        },
      });

      res.json({
        success: true,
        data: results,
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const result = await prisma.examResult.findUnique({
        where: { id },
        include: {
          exam: true,
        },
      });

      if (!result) {
        throw new NotFoundError('Result');
      }

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = createResultSchema.parse(req.body);

      // Check if exam exists
      const exam = await prisma.exam.findUnique({
        where: { id: validatedData.examId },
      });

      if (!exam) {
        throw new NotFoundError('Exam');
      }

      // Calculate if passed
      const isPassed =
        !validatedData.isAbsent &&
        validatedData.marksObtained >= Number(exam.passingMarks);

      const result = await prisma.examResult.create({
        data: {
          ...validatedData,
          isPassed,
          marksObtained: validatedData.marksObtained,
        },
        include: {
          exam: true,
        },
      });

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new ValidationError(error.errors[0].message));
      }
      next(error);
    }
  },

  bulkCreate: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = bulkCreateResultSchema.parse(req.body);

      // Check if exam exists
      const exam = await prisma.exam.findUnique({
        where: { id: validatedData.examId },
      });

      if (!exam) {
        throw new NotFoundError('Exam');
      }

      // Create results in transaction
      const results = await prisma.$transaction(
        validatedData.results.map((resultData) =>
          prisma.examResult.create({
            data: {
              examId: validatedData.examId,
              ...resultData,
              isPassed:
                !resultData.isAbsent &&
                resultData.marksObtained >= Number(exam.passingMarks),
              marksObtained: resultData.marksObtained,
            },
          })
        )
      );

      res.status(201).json({
        success: true,
        data: results,
        count: results.length,
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
      const updateData = z
        .object({
          marksObtained: z.number().nonnegative().optional(),
          grade: z.string().optional(),
          remarks: z.string().optional(),
          isAbsent: z.boolean().optional(),
        })
        .parse(req.body);

      const result = await prisma.examResult.findUnique({
        where: { id },
        include: {
          exam: true,
        },
      });

      if (!result) {
        throw new NotFoundError('Result');
      }

      // Recalculate isPassed if marks changed
      let isPassed = result.isPassed;
      if (updateData.marksObtained !== undefined) {
        isPassed =
          !(updateData.isAbsent ?? result.isAbsent) &&
          updateData.marksObtained >= Number(result.exam.passingMarks);
      }

      const updatedResult = await prisma.examResult.update({
        where: { id },
        data: {
          ...updateData,
          isPassed,
        },
        include: {
          exam: true,
        },
      });

      res.json({
        success: true,
        data: updatedResult,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new ValidationError(error.errors[0].message));
      }
      next(error);
    }
  },
};
