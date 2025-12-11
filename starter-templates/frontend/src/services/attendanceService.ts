import api from './api';

export interface Attendance {
  id: string;
  studentId: string;
  classId?: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' | 'SICK';
  period?: number;
  remarks?: string;
  markedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceSummary {
  id: string;
  studentId: string;
  classId?: string;
  academicYear: string;
  term?: string;
  month?: number;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  excusedDays: number;
  percentage: number;
  createdAt: string;
  updatedAt: string;
}

export const attendanceService = {
  getAllAttendances: async (params?: {
    studentId?: string;
    classId?: string;
    date?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Attendance[]> => {
    const response = await api.get<{ success: boolean; data: Attendance[] }>('/attendances', {
      params,
    });
    return response.data.data;
  },

  markAttendance: async (data: {
    studentId: string;
    classId?: string;
    date?: string;
    status: Attendance['status'];
    period?: number;
    remarks?: string;
  }): Promise<Attendance> => {
    const response = await api.post<{ success: boolean; data: Attendance }>('/attendances', data);
    return response.data.data;
  },

  bulkMarkAttendance: async (data: {
    classId: string;
    date?: string;
    period?: number;
    attendances: Array<{
      studentId: string;
      status: Attendance['status'];
      remarks?: string;
    }>;
  }): Promise<{ data: Attendance[]; count: number }> => {
    const response = await api.post<{ success: boolean; data: Attendance[]; count: number }>(
      '/attendances/bulk',
      data
    );
    return response.data;
  },

  // Summaries
  getSummariesByStudent: async (
    studentId: string,
    params?: {
      academicYear?: string;
      term?: string;
      month?: number;
    }
  ): Promise<AttendanceSummary[]> => {
    const response = await api.get<{ success: boolean; data: AttendanceSummary[] }>(
      `/attendance-summaries/student/${studentId}`,
      { params }
    );
    return response.data.data;
  },

  generateSummary: async (data: {
    studentId: string;
    academicYear: string;
    term?: string;
    month?: number;
  }): Promise<AttendanceSummary> => {
    const response = await api.post<{ success: boolean; data: AttendanceSummary }>(
      '/attendance-summaries/generate',
      data
    );
    return response.data.data;
  },
};
