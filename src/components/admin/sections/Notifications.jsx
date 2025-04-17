import React, { useState } from 'react';
import axios from 'axios';

const Notifications = () => {
  const [message, setMessage] = useState('');
  const [method, setMethod] = useState('sms');
  const [status, setStatus] = useState('');

  const sendNotification = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5001/api/notifications', {
        message,
        method,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStatus('✅ Notification sent!');
      setMessage('');
    } catch (err) {
      setStatus('❌ Failed to send notification.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-xl rounded-3xl p-8 border border-[#e8dbc7] font-serif">
      <h2 className="text-2xl font-semibold text-[#AF9B79] mb-6 flex items-center gap-2">
        🔔 Send Notification
      </h2>
      <form onSubmit={sendNotification} className="space-y-4">
        <textarea
          rows="4"
          placeholder="Write your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AF9B79] resize-none"
        />
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AF9B79]"
        >
          <option value="sms">📱 SMS</option>
          <option value="email">📧 Email</option>
        </select>
        <button
          type="submit"
          className="bg-[#AF9B79] text-white px-6 py-2 rounded-full hover:bg-[#9e8762] transition-all font-medium shadow-md"
        >
          Send Notification
        </button>
        {status && (
          <p className={`mt-3 text-sm ${status.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>
            {status}
          </p>
        )}
      </form>
    </div>
  );
};

export default Notifications;
