import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { NotFoundError, ValidationError } from '@school-management/shared';
import { z } from 'zod';

const createClassSchema = z.object({
  name: z.string().min(1),
  level: z.enum(['PRIMARY', 'SECONDARY']),
  section: z.string().optional(),
  capacity: z.number().int().positive().default(40),
  classTeacherId: z.string().uuid().optional(),
  academicYear: z.string(),
});

export const classController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const classes = await prisma.class.findMany({
        include: {
          subjects: {
            include: {
              subject: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });

      res.json({
        success: true,
        data: classes,
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const classData = await prisma.class.findUnique({
        where: { id },
        include: {
          subjects: {
            include: {
              subject: true,
            },
          },
          timetable: true,
        },
      });

      if (!classData) {
        throw new NotFoundError('Class');
      }

      res.json({
        success: true,
        data: classData,
      });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = createClassSchema.parse(req.body);

      const classData = await prisma.class.create({
        data: validatedData,
        include: {
          subjects: true,
        },
      });

      res.status(201).json({
        success: true,
        data: classData,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new ValidationError(error.errors[0].message));
      }
      next(error);
    }
  },
};
