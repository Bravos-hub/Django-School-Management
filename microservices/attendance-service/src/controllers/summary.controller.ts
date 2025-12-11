import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { ValidationError } from '@school-management/shared';
import { z } from 'zod';

export const summaryController = {
  getByStudent: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { studentId } = req.params;
      const { academicYear, term, month } = req.query;

      const where: any = { studentId };
      if (academicYear) where.academicYear = academicYear;
      if (term) where.term = term;
      if (month) where.month = parseInt(month as string);

      const summaries = await prisma.attendanceSummary.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.json({
        success: true,
        data: summaries,
      });
    } catch (error) {
      next(error);
    }
  },

  generate: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { studentId, academicYear, term, month } = z
        .object({
          studentId: z.string().uuid(),
          academicYear: z.string(),
          term: z.string().optional(),
          month: z.number().int().min(1).max(12).optional(),
        })
        .parse(req.body);

      // Calculate attendance statistics
      const startDate = month
        ? new Date(parseInt(academicYear), month - 1, 1)
        : new Date(`${academicYear}-01-01`);
      const endDate = month
        ? new Date(parseInt(academicYear), month, 0)
        : new Date(`${academicYear}-12-31`);

      const attendances = await prisma.attendance.findMany({
        where: {
          studentId,
          date: {
            gte: startDate,
            lte: endDate,
          },
          ...(term && {
            // You might need to add term filtering logic
          }),
        },
      });

      const totalDays = attendances.length;
      const presentDays = attendances.filter((a) => a.status === 'PRESENT').length;
      const absentDays = attendances.filter((a) => a.status === 'ABSENT').length;
      const lateDays = attendances.filter((a) => a.status === 'LATE').length;
      const excusedDays = attendances.filter((a) => a.status === 'EXCUSED').length;
      const percentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

      const summary = await prisma.attendanceSummary.upsert({
        where: {
          studentId_academicYear_term_month: {
            studentId,
            academicYear,
            term: term || null,
            month: month || null,
          },
        },
        update: {
          totalDays,
          presentDays,
          absentDays,
          lateDays,
          excusedDays,
          percentage,
        },
        create: {
          studentId,
          academicYear,
          term: term || null,
          month: month || null,
          totalDays,
          presentDays,
          absentDays,
          lateDays,
          excusedDays,
          percentage,
        },
      });

      res.json({
        success: true,
        data: summary,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new ValidationError(error.errors[0].message));
      }
      next(error);
    }
  },
};
