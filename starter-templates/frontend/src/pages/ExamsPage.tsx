import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { assessmentService } from '../services/assessmentService';
import { toast } from 'react-toastify';

const ExamsPage = () => {
  const [statusFilter, setStatusFilter] = useState<string>('');

  const { data: exams, isLoading, error } = useQuery({
    queryKey: ['exams', statusFilter],
    queryFn: () => assessmentService.getAllExams({ status: statusFilter || undefined }),
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    toast.error('Failed to load exams');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Exams</h1>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700">
          Create Exam
        </button>
      </div>

      <div className="mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="">All Status</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {exams?.map((exam) => (
            <li key={exam.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{exam.name}</h3>
                  <p className="text-sm text-gray-500">
                    {exam.examType} • Academic Year: {exam.academicYear}
                  </p>
                  {exam.startDate && (
                    <p className="text-sm text-gray-500">
                      {new Date(exam.startDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-xs ${
                    exam.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    exam.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {exam.status}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    Total: {exam.totalMarks} marks
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExamsPage;
