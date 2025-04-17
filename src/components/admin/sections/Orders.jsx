import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5001/api/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data);
    } catch (err) {
      setError('Failed to fetch orders.');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-blue-900">📦 Order Management</h2>
      {error && <p className="text-red-500 font-medium">{error}</p>}

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map(order => (
            <div
              key={order._id}
              className="bg-white shadow-sm border border-gray-200 rounded-xl p-6 hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-800">Order ID: {order._id}</h3>
                <span className="text-sm text-gray-500">
                  {order.createdAt ? dayjs(order.createdAt).format('MMM D, YYYY h:mm A') : 'N/A'}
                </span>
              </div>

              <p className="text-sm text-gray-700 mb-1">
                👤 <strong>Customer:</strong> {order.userId?.email || 'N/A'}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                💰 <strong>Total:</strong> ${order.totalAmount ? Number(order.totalAmount).toFixed(2) : '0.00'}
              </p>

              <div className="flex items-center gap-3 mt-3">
                <label className="text-sm text-gray-600 font-medium">Status:</label>
                <select
                  value={order.status}
                  onChange={async (e) => {
                    const newStatus = e.target.value;
                    try {
                      const token = localStorage.getItem('token');
                      await axios.put(`http://localhost:5001/api/orders/${order._id}/status`, { status: newStatus }, {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      });
                      setOrders((prevOrders) =>
                        prevOrders.map((o) =>
                          o._id === order._id ? { ...o, status: newStatus } : o
                        )
                      );
                    } catch (err) {
                      alert('Failed to update status');
                    }
                  }}
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <p className="text-xs text-gray-400 mt-2">{order.createdAt ? dayjs(order.createdAt).fromNow() : ''}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
