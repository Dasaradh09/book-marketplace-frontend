import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api/api';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', role: '' });
  const [editMode, setEditMode] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
        setForm({ name: res.data.name || '', role: res.data.role || '' });
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUser();
    }
  }, [token]);

  if (!token) return <Navigate to="/login" />;
  if (loading) return <div className="p-10 text-center text-gray-600">Loading profile...</div>;
  if (!user) return <div className="p-10 text-center text-red-500">Failed to load user profile.</div>;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen pt-20 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-3xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="bg-blue-600 text-white flex flex-col items-center justify-center p-8 md:w-1/3">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-blue-600 text-3xl font-bold shadow-md mb-4">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <h3 className="text-lg font-semibold text-center break-all">{user.email}</h3>
            <p className="text-sm mt-1 opacity-80">{user.role}</p>
          </div>

          <div className="p-8 md:w-2/3">
            <h2 className="text-2xl font-bold text-blue-800 mb-6 border-b pb-2">Account Details</h2>
            <div className="space-y-4 text-gray-700">
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Name:</span>
                {editMode ? (
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="text-right border-b border-blue-200 focus:outline-none bg-transparent"
                  />
                ) : (
                  <span className="text-right">{form.name || 'N/A'}</span>
                )}
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Role:</span>
                {editMode ? (
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="text-right bg-transparent border-b border-blue-200 focus:outline-none"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  <span className="capitalize text-right">{form.role}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Joined:</span>
                <span className="text-right">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={() => setEditMode(!editMode)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
              >
                {editMode ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>
      </div>
      {user && (
        <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-[#AF9B79] mb-4">🧾 Order History</h3>
          <div className="space-y-4">
            {(user.orders || []).map((order, idx) => (
              <div key={idx} className="border rounded-lg p-4 shadow bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">
                    📅 {new Date(order.orderDate).toLocaleDateString()}
                  </span>
                  <span className={`text-sm font-semibold ${order.status === 'Shipped' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-sm text-gray-800 mb-1">
                  <strong>Total:</strong> ${order.totalPrice.toFixed(2)}
                </div>
                <ul className="text-sm text-gray-700 list-disc list-inside">
                  {order.items.map((item, i) => (
                    <li key={i}>{item.title} × {item.quantity}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;