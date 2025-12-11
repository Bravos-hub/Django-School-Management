import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { logger } from '../utils/logger';
import { NotFoundError, ValidationError } from '@school-management/shared';
import { z } from 'zod';

const createStudentSchema = z.object({
  userId: z.string().uuid(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  phoneNumber: z.string().optional(),
  currentAddress: z.string().optional(),
  permanentAddress: z.string().optional(),
  parentId: z.string().uuid().optional(),
  guardianName: z.string().optional(),
  guardianPhone: z.string().optional(),
  guardianRelation: z.string().optional(),
  district: z.string().optional(),
  nationality: z.string().optional(),
});

const updateStudentSchema = createStudentSchema.partial();

export const studentController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      const status = req.query.status as string;

      const where: any = {};
      if (status) {
        where.status = status;
      }

      const [students, total] = await Promise.all([
        prisma.student.findMany({
          where,
          skip,
          take: limit,
          include: {
            parent: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
        prisma.student.count({ where }),
      ]);

      res.json({
        success: true,
        data: students,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const student = await prisma.student.findUnique({
        where: { id },
        include: {
          parent: true,
          documents: true,
          admissions: true,
        },
      });

      if (!student) {
        throw new NotFoundError('Student');
      }

      res.json({
        success: true,
        data: student,
      });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = createStudentSchema.parse(req.body);

      // Generate admission number
      const year = new Date().getFullYear();
      const count = await prisma.student.count({
        where: {
          admissionNumber: {
            startsWith: `ADM${year}`,
          },
        },
      });
      const admissionNumber = `ADM${year}${String(count + 1).padStart(4, '0')}`;

      const student = await prisma.student.create({
        data: {
          ...validatedData,
          admissionNumber,
          dateOfBirth: validatedData.dateOfBirth
            ? new Date(validatedData.dateOfBirth)
            : undefined,
        },
        include: {
          parent: true,
        },
      });

      logger.info(`Student created: ${student.admissionNumber}`);

      res.status(201).json({
        success: true,
        data: student,
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
      const validatedData = updateStudentSchema.parse(req.body);

      const student = await prisma.student.findUnique({
        where: { id },
      });

      if (!student) {
        throw new NotFoundError('Student');
      }

      const updatedStudent = await prisma.student.update({
        where: { id },
        data: {
          ...validatedData,
          dateOfBirth: validatedData.dateOfBirth
            ? new Date(validatedData.dateOfBirth)
            : undefined,
        },
        include: {
          parent: true,
        },
      });

      res.json({
        success: true,
        data: updatedStudent,
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

      const student = await prisma.student.findUnique({
        where: { id },
      });

      if (!student) {
        throw new NotFoundError('Student');
      }

      await prisma.student.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Student deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};
