import { useAppSelector } from '../hooks/redux';

const DashboardPage = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Welcome, {user?.email}!
        </h2>
        <p className="text-gray-600">
          Your role: <span className="font-medium">{user?.role}</span>
        </p>
        <p className="text-gray-600 mt-2">
          This is your dashboard. Start building your features here.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
