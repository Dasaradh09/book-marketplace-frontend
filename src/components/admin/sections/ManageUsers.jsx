import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5001/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      setError('Failed to fetch users.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">👥 Manage Users</h2>
      {error && <p className="text-red-600">{error}</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-left border border-gray-200 shadow-sm rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Registered</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-4">No users found.</td></tr>
            ) : (
              users.map(user => (
                <tr key={user._id} className="border-t">
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2 capitalize">{user.role}</td>
                  <td className="px-4 py-2">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button className="px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200">Promote</button>
                    <button className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200">Demote</button>
                    <button className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
