import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { assessmentService } from '../services/assessmentService';
import { toast } from 'react-toastify';

const ResultsPage = () => {
  const [examId, setExamId] = useState<string>('');
  const [studentId, setStudentId] = useState<string>('');

  const { data: results, isLoading, error } = useQuery({
    queryKey: ['results', examId, studentId],
    queryFn: () => assessmentService.getAllResults({
      examId: examId || undefined,
      studentId: studentId || undefined,
    }),
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    toast.error('Failed to load results');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Results</h1>
      </div>

      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Filter by Exam ID"
          value={examId}
          onChange={(e) => setExamId(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
        <input
          type="text"
          placeholder="Filter by Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Marks
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Grade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results?.map((result) => (
              <tr key={result.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {result.studentId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {result.marksObtained}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {result.grade || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {result.isAbsent ? (
                    <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-800">
                      Absent
                    </span>
                  ) : result.isPassed ? (
                    <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                      Passed
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">
                      Failed
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsPage;
