import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { academicService } from '../services/academicService';
import { toast } from 'react-toastify';

const ClassesPage = () => {
  const { data: classes, isLoading, error } = useQuery({
    queryKey: ['classes'],
    queryFn: () => academicService.getAllClasses(),
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    toast.error('Failed to load classes');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Classes</h1>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700">
          Add Class
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {classes?.map((classItem) => (
          <div key={classItem.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{classItem.name}</h3>
                <p className="text-sm text-gray-500">{classItem.level}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                classItem.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {classItem.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Capacity: {classItem.capacity} students
              </p>
              <p className="text-sm text-gray-600">
                Academic Year: {classItem.academicYear}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassesPage;
