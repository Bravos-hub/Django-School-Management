import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { studentService } from '../services/studentService';

const StudentDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: student, isLoading } = useQuery({
    queryKey: ['student', id],
    queryFn: () => studentService.getById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Student not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/students"
        className="text-primary-600 hover:text-primary-800 mb-4 inline-block"
      >
        ← Back to Students
      </Link>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <h1 className="text-2xl font-bold text-gray-900">
            {student.firstName} {student.lastName}
          </h1>
          <p className="mt-1 text-sm text-gray-500">Admission Number: {student.admissionNumber}</p>
        </div>

        <div className="px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <span className={`px-2 py-1 rounded text-xs ${
                  student.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                  student.status === 'SUSPENDED' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {student.status}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Gender</dt>
              <dd className="mt-1 text-sm text-gray-900">{student.gender || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
              <dd className="mt-1 text-sm text-gray-900">{student.phoneNumber || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">District</dt>
              <dd className="mt-1 text-sm text-gray-900">{student.district || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Nationality</dt>
              <dd className="mt-1 text-sm text-gray-900">{student.nationality || 'N/A'}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Current Address</dt>
              <dd className="mt-1 text-sm text-gray-900">{student.currentAddress || 'N/A'}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Permanent Address</dt>
              <dd className="mt-1 text-sm text-gray-900">{student.permanentAddress || 'N/A'}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailPage;
