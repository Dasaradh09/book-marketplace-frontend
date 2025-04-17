import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5001/api/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      setError('Failed to fetch analytics.');
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const quickActions = [
    { label: 'Add Book', path: '/admin/books/add' },
    { label: 'Manage Books', path: '/admin?section=books' },
    { label: 'Manage Orders', path: '/admin?section=orders' },
    { label: 'Manage Users', path: '/admin?section=users' },
    { label: 'Moderate Reviews', path: '/admin?section=reviews' }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">📊 Admin Dashboard Overview</h2>
      {error && <p className="text-red-500">{error}</p>}
      {!stats ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-100 p-4 rounded shadow">
            <h3 className="text-lg font-semibold">Total Books</h3>
            <p className="text-2xl">{stats.totalBooks}</p>
          </div>
          <div className="bg-green-100 p-4 rounded shadow">
            <h3 className="text-lg font-semibold">Total Users</h3>
            <p className="text-2xl">{stats.totalUsers}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded shadow">
            <h3 className="text-lg font-semibold">Total Orders</h3>
            <p className="text-2xl">{stats.totalOrders}</p>
          </div>
          <div className="bg-purple-100 p-4 rounded shadow">
            <h3 className="text-lg font-semibold">Total Reviews</h3>
            <p className="text-2xl">{stats.totalReviews}</p>
          </div>
        </div>
      )}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">🚀 Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="bg-white border border-gray-200 shadow hover:bg-blue-50 rounded-lg p-4 text-left"
            >
              <h3 className="text-lg font-medium">{action.label}</h3>
              <p className="text-sm text-gray-500">Go to {action.label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;