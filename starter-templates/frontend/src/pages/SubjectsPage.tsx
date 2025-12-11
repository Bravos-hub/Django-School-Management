import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { academicService } from '../services/academicService';
import { toast } from 'react-toastify';

const SubjectsPage = () => {
  const [levelFilter, setLevelFilter] = useState<string>('');

  const { data: subjects, isLoading, error } = useQuery({
    queryKey: ['subjects', levelFilter],
    queryFn: () => academicService.getAllSubjects(levelFilter || undefined),
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    toast.error('Failed to load subjects');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Subjects</h1>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700">
          Add Subject
        </button>
      </div>

      <div className="mb-4">
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="">All Levels</option>
          <option value="PRIMARY">Primary</option>
          <option value="SECONDARY">Secondary</option>
        </select>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {subjects?.map((subject) => (
            <li key={subject.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{subject.name}</h3>
                  <p className="text-sm text-gray-500">
                    Code: {subject.code} • {subject.level} • {subject.category}
                  </p>
                </div>
                <div className="text-sm text-gray-600">
                  {subject.theoryMarks} marks
                  {subject.practicalMarks > 0 && ` + ${subject.practicalMarks} practical`}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SubjectsPage;
