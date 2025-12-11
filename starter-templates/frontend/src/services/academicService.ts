import api from './api';

export interface Class {
  id: string;
  name: string;
  level: 'PRIMARY' | 'SECONDARY';
  section?: string;
  capacity: number;
  classTeacherId?: string;
  academicYear: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
  level: 'PRIMARY' | 'SECONDARY';
  category: 'CORE' | 'ELECTIVE' | 'PRACTICAL';
  theoryMarks: number;
  practicalMarks: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const academicService = {
  // Classes
  getAllClasses: async (): Promise<Class[]> => {
    const response = await api.get<{ success: boolean; data: Class[] }>('/classes');
    return response.data.data;
  },

  getClassById: async (id: string): Promise<Class> => {
    const response = await api.get<{ success: boolean; data: Class }>(`/classes/${id}`);
    return response.data.data;
  },

  createClass: async (data: Partial<Class>): Promise<Class> => {
    const response = await api.post<{ success: boolean; data: Class }>('/classes', data);
    return response.data.data;
  },

  // Subjects
  getAllSubjects: async (level?: string): Promise<Subject[]> => {
    const response = await api.get<{ success: boolean; data: Subject[] }>('/subjects', {
      params: { level },
    });
    return response.data.data;
  },

  getSubjectById: async (id: string): Promise<Subject> => {
    const response = await api.get<{ success: boolean; data: Subject }>(`/subjects/${id}`);
    return response.data.data;
  },

  createSubject: async (data: Partial<Subject>): Promise<Subject> => {
    const response = await api.post<{ success: boolean; data: Subject }>('/subjects', data);
    return response.data.data;
  },
};
