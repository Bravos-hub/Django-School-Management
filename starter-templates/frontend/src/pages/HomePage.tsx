import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to School Management System
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Manage your school operations efficiently
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/login"
            className="bg-primary-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-primary-700"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
