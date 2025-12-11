import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { NotFoundError, ValidationError } from '@school-management/shared';
import { z } from 'zod';

const createSubjectSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  description: z.string().optional(),
  level: z.enum(['PRIMARY', 'SECONDARY']),
  category: z.enum(['CORE', 'ELECTIVE', 'PRACTICAL']),
  theoryMarks: z.number().int().positive().default(100),
  practicalMarks: z.number().int().nonnegative().default(0),
});

export const subjectController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const level = req.query.level as string;
      const where: any = {};
      if (level) {
        where.level = level;
      }

      const subjects = await prisma.subject.findMany({
        where,
        orderBy: {
          name: 'asc',
        },
      });

      res.json({
        success: true,
        data: subjects,
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const subject = await prisma.subject.findUnique({
        where: { id },
        include: {
          classSubjects: {
            include: {
              class: true,
            },
          },
        },
      });

      if (!subject) {
        throw new NotFoundError('Subject');
      }

      res.json({
        success: true,
        data: subject,
      });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = createSubjectSchema.parse(req.body);

      const subject = await prisma.subject.create({
        data: validatedData,
      });

      res.status(201).json({
        success: true,
        data: subject,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new ValidationError(error.errors[0].message));
      }
      next(error);
    }
  },
};
