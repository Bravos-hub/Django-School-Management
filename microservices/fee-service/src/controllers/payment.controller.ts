import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { NotFoundError, ValidationError } from '@school-management/shared';
import { z } from 'zod';
import { generateReceiptNumber, processMTNMobileMoney, processAirtelMoney } from '../utils/payment';
import { logger } from '../utils/logger';

const createPaymentSchema = z.object({
  studentId: z.string().uuid(),
  feeStructureId: z.string().uuid().optional(),
  amount: z.number().positive(),
  paymentMethod: z.enum([
    'CASH',
    'MTN_MOBILE_MONEY',
    'AIRTEL_MONEY',
    'BANK_TRANSFER',
    'CHEQUE',
    'CARD',
  ]),
  transactionId: z.string().optional(),
  phoneNumber: z.string().optional(), // For mobile money
  remarks: z.string().optional(),
});

export const paymentController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const studentId = req.query.studentId as string;
      const paymentStatus = req.query.status as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const where: any = {};
      if (studentId) where.studentId = studentId;
      if (paymentStatus) where.paymentStatus = paymentStatus;

      const [payments, total] = await Promise.all([
        prisma.payment.findMany({
          where,
          skip,
          take: limit,
          include: {
            feeStructure: true,
            installments: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
        prisma.payment.count({ where }),
      ]);

      res.json({
        success: true,
        data: payments,
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

      const payment = await prisma.payment.findUnique({
        where: { id },
        include: {
          feeStructure: true,
          installments: true,
        },
      });

      if (!payment) {
        throw new NotFoundError('Payment');
      }

      res.json({
        success: true,
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = createPaymentSchema.parse(req.body);
      const { paymentMethod, phoneNumber, transactionId, ...paymentData } = validatedData;

      // Process payment based on method
      let processedTransactionId = transactionId;
      let paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' = 'PENDING';

      if (paymentMethod === 'MTN_MOBILE_MONEY' && phoneNumber) {
        const result = await processMTNMobileMoney(
          phoneNumber,
          Number(paymentData.amount),
          paymentData.studentId
        );
        if (result.success && result.transactionId) {
          processedTransactionId = result.transactionId;
          paymentStatus = 'COMPLETED';
        } else {
          paymentStatus = 'FAILED';
        }
      } else if (paymentMethod === 'AIRTEL_MONEY' && phoneNumber) {
        const result = await processAirtelMoney(
          phoneNumber,
          Number(paymentData.amount),
          paymentData.studentId
        );
        if (result.success && result.transactionId) {
          processedTransactionId = result.transactionId;
          paymentStatus = 'COMPLETED';
        } else {
          paymentStatus = 'FAILED';
        }
      } else if (paymentMethod === 'CASH') {
        paymentStatus = 'COMPLETED';
      }

      const receiptNumber = generateReceiptNumber();

      const payment = await prisma.payment.create({
        data: {
          ...paymentData,
          transactionId: processedTransactionId,
          receiptNumber,
          paymentStatus,
          amount: paymentData.amount,
        },
        include: {
          feeStructure: true,
        },
      });

      logger.info(`Payment created: ${receiptNumber} for student ${paymentData.studentId}`);

      res.status(201).json({
        success: true,
        data: payment,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new ValidationError(error.errors[0].message));
      }
      next(error);
    }
  },

  updateStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = z
        .object({
          status: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED']),
        })
        .parse(req.body);

      const payment = await prisma.payment.findUnique({
        where: { id },
      });

      if (!payment) {
        throw new NotFoundError('Payment');
      }

      const updatedPayment = await prisma.payment.update({
        where: { id },
        data: { paymentStatus: status },
        include: {
          feeStructure: true,
        },
      });

      res.json({
        success: true,
        data: updatedPayment,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new ValidationError(error.errors[0].message));
      }
      next(error);
    }
  },
};
