import api from './api';

export interface Exam {
  id: string;
  name: string;
  examType: 'CONTINUOUS_ASSESSMENT' | 'MID_TERM' | 'END_OF_TERM' | 'MOCK_EXAM' | 'UCE' | 'UACE' | 'PLE';
  classId: string;
  subjectId?: string;
  termId?: string;
  academicYear: string;
  startDate?: string;
  endDate?: string;
  totalMarks: number;
  passingMarks: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  instructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  subjectId?: string;
  marksObtained: number;
  grade?: string;
  remarks?: string;
  isAbsent: boolean;
  isPassed?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReportCard {
  id: string;
  studentId: string;
  termId?: string;
  academicYear: string;
  totalMarks: number;
  marksObtained: number;
  percentage: number;
  grade?: string;
  rank?: number;
  classRank?: number;
  remarks?: string;
  generatedAt: string;
  subjects: ReportCardSubject[];
}

export interface ReportCardSubject {
  id: string;
  subjectName: string;
  subjectCode?: string;
  marksObtained: number;
  totalMarks: number;
  grade?: string;
  rank?: number;
}

export const assessmentService = {
  // Exams
  getAllExams: async (params?: {
    classId?: string;
    examType?: string;
    status?: string;
  }): Promise<Exam[]> => {
    const response = await api.get<{ success: boolean; data: Exam[] }>('/exams', { params });
    return response.data.data;
  },

  getExamById: async (id: string): Promise<Exam> => {
    const response = await api.get<{ success: boolean; data: Exam }>(`/exams/${id}`);
    return response.data.data;
  },

  createExam: async (data: Partial<Exam>): Promise<Exam> => {
    const response = await api.post<{ success: boolean; data: Exam }>('/exams', data);
    return response.data.data;
  },

  updateExam: async (id: string, data: Partial<Exam>): Promise<Exam> => {
    const response = await api.put<{ success: boolean; data: Exam }>(`/exams/${id}`, data);
    return response.data.data;
  },

  deleteExam: async (id: string): Promise<void> => {
    await api.delete(`/exams/${id}`);
  },

  // Results
  getAllResults: async (params?: {
    examId?: string;
    studentId?: string;
  }): Promise<ExamResult[]> => {
    const response = await api.get<{ success: boolean; data: ExamResult[] }>('/results', { params });
    return response.data.data;
  },

  getResultById: async (id: string): Promise<ExamResult> => {
    const response = await api.get<{ success: boolean; data: ExamResult }>(`/results/${id}`);
    return response.data.data;
  },

  createResult: async (data: Partial<ExamResult>): Promise<ExamResult> => {
    const response = await api.post<{ success: boolean; data: ExamResult }>('/results', data);
    return response.data.data;
  },

  bulkCreateResults: async (data: {
    examId: string;
    results: Array<Partial<ExamResult>>;
  }): Promise<{ data: ExamResult[]; count: number }> => {
    const response = await api.post<{ success: boolean; data: ExamResult[]; count: number }>(
      '/results/bulk',
      data
    );
    return response.data;
  },

  updateResult: async (id: string, data: Partial<ExamResult>): Promise<ExamResult> => {
    const response = await api.put<{ success: boolean; data: ExamResult }>(`/results/${id}`, data);
    return response.data.data;
  },

  // Report Cards
  getReportCardsByStudent: async (
    studentId: string,
    academicYear?: string
  ): Promise<ReportCard[]> => {
    const response = await api.get<{ success: boolean; data: ReportCard[] }>(
      `/report-cards/student/${studentId}`,
      { params: { academicYear } }
    );
    return response.data.data;
  },

  generateReportCard: async (data: {
    studentId: string;
    termId?: string;
    academicYear: string;
  }): Promise<ReportCard> => {
    const response = await api.post<{ success: boolean; data: ReportCard }>(
      '/report-cards/generate',
      data
    );
    return response.data.data;
  },
};
