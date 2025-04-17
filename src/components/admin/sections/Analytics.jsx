import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5001/api/analytics', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(res.data);
    } catch (err) {
      setError('Failed to load analytics data.');
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-900 mb-6 tracking-tight">📊 Analytics Overview</h2>
      {error && <p className="text-red-600 bg-red-50 p-3 rounded border border-red-200">{error}</p>}
      {!stats ? (
        <p>Loading analytics...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
          <div className="bg-white border border-gray-200 rounded-xl shadow p-6 flex flex-col items-center text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl shadow p-6 flex flex-col items-center text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Books</h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalBooks}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl shadow p-6 flex flex-col items-center text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.totalOrders}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;