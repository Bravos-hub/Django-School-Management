import api from './api';

export interface Student {
  id: string;
  userId: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  phoneNumber?: string;
  currentAddress?: string;
  permanentAddress?: string;
  parentId?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianRelation?: string;
  district?: string;
  nationality?: string;
  classId?: string;
  enrollmentDate: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'TRANSFERRED' | 'GRADUATED' | 'DROPPED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentData {
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  phoneNumber?: string;
  currentAddress?: string;
  permanentAddress?: string;
  parentId?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianRelation?: string;
  district?: string;
  nationality?: string;
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

export const studentService = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<Student>> => {
    const response = await api.get<{ success: boolean; data: Student[]; meta: any }>('/students', {
      params,
    });
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  },

  getById: async (id: string): Promise<Student> => {
    const response = await api.get<{ success: boolean; data: Student }>(`/students/${id}`);
    return response.data.data;
  },

  create: async (data: CreateStudentData): Promise<Student> => {
    const response = await api.post<{ success: boolean; data: Student }>('/students', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<CreateStudentData>): Promise<Student> => {
    const response = await api.put<{ success: boolean; data: Student }>(`/students/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/students/${id}`);
  },
};
