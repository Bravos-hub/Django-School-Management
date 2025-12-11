import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { NotFoundError, ValidationError } from '@school-management/shared';
import { z } from 'zod';
import { logger } from '../utils/logger';

const markAttendanceSchema = z.object({
  studentId: z.string().uuid(),
  classId: z.string().uuid().optional(),
  date: z.string().optional(), // ISO date string
  status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED', 'SICK']),
  period: z.number().int().positive().optional(),
  remarks: z.string().optional(),
});

const bulkMarkAttendanceSchema = z.object({
  classId: z.string().uuid(),
  date: z.string().optional(),
  period: z.number().int().positive().optional(),
  attendances: z.array(
    z.object({
      studentId: z.string().uuid(),
      status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED', 'SICK']),
      remarks: z.string().optional(),
    })
  ),
});

export const attendanceController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const studentId = req.query.studentId as string;
      const classId = req.query.classId as string;
      const date = req.query.date as string;
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;

      const where: any = {};
      if (studentId) where.studentId = studentId;
      if (classId) where.classId = classId;
      if (date) {
        const dateObj = new Date(date);
        where.date = {
          gte: new Date(dateObj.setHours(0, 0, 0, 0)),
          lt: new Date(dateObj.setHours(23, 59, 59, 999)),
        };
      } else if (startDate && endDate) {
        where.date = {
          gte: new Date(startDate),
          lte: new Date(endDate),
        };
      }

      const attendances = await prisma.attendance.findMany({
        where,
        orderBy: {
          date: 'desc',
        },
      });

      res.json({
        success: true,
        data: attendances,
      });
    } catch (error) {
      next(error);
    }
  },

  mark: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = markAttendanceSchema.parse(req.body);
      const userId = (req as any).user?.id;

      if (!userId) {
        throw new NotFoundError('User');
      }

      const attendanceDate = validatedData.date
        ? new Date(validatedData.date)
        : new Date();

      const attendance = await prisma.attendance.upsert({
        where: {
          studentId_date_period: {
            studentId: validatedData.studentId,
            date: attendanceDate,
            period: validatedData.period || null,
          },
        },
        update: {
          status: validatedData.status,
          remarks: validatedData.remarks,
          markedBy: userId,
        },
        create: {
          ...validatedData,
          date: attendanceDate,
          markedBy: userId,
        },
      });

      logger.info(
        `Attendance marked: ${validatedData.status} for student ${validatedData.studentId}`
      );

      res.status(201).json({
        success: true,
        data: attendance,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new ValidationError(error.errors[0].message));
      }
      next(error);
    }
  },

  bulkMark: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = bulkMarkAttendanceSchema.parse(req.body);
      const userId = (req as any).user?.id;

      if (!userId) {
        throw new NotFoundError('User');
      }

      const attendanceDate = validatedData.date
        ? new Date(validatedData.date)
        : new Date();

      // Create attendances in transaction
      const attendances = await prisma.$transaction(
        validatedData.attendances.map((attendanceData) =>
          prisma.attendance.upsert({
            where: {
              studentId_date_period: {
                studentId: attendanceData.studentId,
                date: attendanceDate,
                period: validatedData.period || null,
              },
            },
            update: {
              status: attendanceData.status,
              remarks: attendanceData.remarks,
              markedBy: userId,
            },
            create: {
              studentId: attendanceData.studentId,
              classId: validatedData.classId,
              date: attendanceDate,
              period: validatedData.period,
              status: attendanceData.status,
              remarks: attendanceData.remarks,
              markedBy: userId,
            },
          })
        )
      );

      logger.info(
        `Bulk attendance marked: ${attendances.length} records for class ${validatedData.classId}`
      );

      res.status(201).json({
        success: true,
        data: attendances,
        count: attendances.length,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new ValidationError(error.errors[0].message));
      }
      next(error);
    }
  },
};
