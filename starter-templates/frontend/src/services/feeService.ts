import api from './api';

export interface FeeStructure {
  id: string;
  name: string;
  description?: string;
  academicYear: string;
  term?: string;
  classId?: string;
  feeType:
    | 'TUITION'
    | 'DEVELOPMENT'
    | 'LIBRARY'
    | 'LABORATORY'
    | 'SPORTS'
    | 'UNIFORM'
    | 'EXAM'
    | 'TRANSPORT'
    | 'BOARDING'
    | 'OTHER';
  amount: number;
  dueDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  studentId: string;
  feeStructureId?: string;
  amount: number;
  paymentMethod:
    | 'CASH'
    | 'MTN_MOBILE_MONEY'
    | 'AIRTEL_MONEY'
    | 'BANK_TRANSFER'
    | 'CHEQUE'
    | 'CARD';
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED';
  transactionId?: string;
  paymentDate: string;
  dueDate?: string;
  receiptNumber: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const feeService = {
  // Fee Structures
  getAllFeeStructures: async (params?: {
    academicYear?: string;
    feeType?: string;
  }): Promise<FeeStructure[]> => {
    const response = await api.get<{ success: boolean; data: FeeStructure[] }>(
      '/fee-structures',
      { params }
    );
    return response.data.data;
  },

  getFeeStructureById: async (id: string): Promise<FeeStructure> => {
    const response = await api.get<{ success: boolean; data: FeeStructure }>(
      `/fee-structures/${id}`
    );
    return response.data.data;
  },

  createFeeStructure: async (data: Partial<FeeStructure>): Promise<FeeStructure> => {
    const response = await api.post<{ success: boolean; data: FeeStructure }>(
      '/fee-structures',
      data
    );
    return response.data.data;
  },

  // Payments
  getAllPayments: async (params?: {
    studentId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Payment>> => {
    const response = await api.get<{ success: boolean; data: Payment[]; meta: any }>(
      '/payments',
      { params }
    );
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  },

  getPaymentById: async (id: string): Promise<Payment> => {
    const response = await api.get<{ success: boolean; data: Payment }>(`/payments/${id}`);
    return response.data.data;
  },

  createPayment: async (data: Partial<Payment>): Promise<Payment> => {
    const response = await api.post<{ success: boolean; data: Payment }>('/payments', data);
    return response.data.data;
  },

  updatePaymentStatus: async (
    id: string,
    status: Payment['paymentStatus']
  ): Promise<Payment> => {
    const response = await api.patch<{ success: boolean; data: Payment }>(
      `/payments/${id}/status`,
      { status }
    );
    return response.data.data;
  },
};
