import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { NotFoundError, ValidationError } from '@school-management/shared';
import { z } from 'zod';

const createFeeStructureSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  academicYear: z.string(),
  term: z.string().optional(),
  classId: z.string().uuid().optional(),
  feeType: z.enum([
    'TUITION',
    'DEVELOPMENT',
    'LIBRARY',
    'LABORATORY',
    'SPORTS',
    'UNIFORM',
    'EXAM',
    'TRANSPORT',
    'BOARDING',
    'OTHER',
  ]),
  amount: z.number().positive(),
  dueDate: z.string().optional(),
});

export const feeStructureController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const academicYear = req.query.academicYear as string;
      const feeType = req.query.feeType as string;

      const where: any = { isActive: true };
      if (academicYear) where.academicYear = academicYear;
      if (feeType) where.feeType = feeType;

      const feeStructures = await prisma.feeStructure.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.json({
        success: true,
        data: feeStructures,
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const feeStructure = await prisma.feeStructure.findUnique({
        where: { id },
        include: {
          payments: {
            take: 10,
          },
        },
      });

      if (!feeStructure) {
        throw new NotFoundError('Fee Structure');
      }

      res.json({
        success: true,
        data: feeStructure,
      });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = createFeeStructureSchema.parse(req.body);

      const feeStructure = await prisma.feeStructure.create({
        data: {
          ...validatedData,
          dueDate: validatedData.dueDate
            ? new Date(validatedData.dueDate)
            : undefined,
          amount: validatedData.amount,
        },
      });

      res.status(201).json({
        success: true,
        data: feeStructure,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new ValidationError(error.errors[0].message));
      }
      next(error);
    }
  },
};
