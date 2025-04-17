import React, { useState } from 'react';
import axios from 'axios';

const AdminSettings = () => {
  const [settings, setSettings] = useState({ name: '', description: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5001/api/settings', settings, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStatus('✅ Settings updated!');
    } catch (err) {
      setStatus('❌ Failed to update settings.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-xl rounded-3xl p-8 border border-[#e8dbc7] font-serif">
      <h2 className="text-2xl font-semibold text-[#AF9B79] mb-6 flex items-center gap-2">
        ⚙️ Admin Settings
      </h2>
      <form onSubmit={handleSave} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Platform Name"
          value={settings.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AF9B79]"
        />
        <textarea
          name="description"
          placeholder="Platform Description"
          value={settings.description}
          onChange={handleChange}
          rows="3"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AF9B79] resize-none"
        />
        <button
          type="submit"
          className="bg-[#AF9B79] text-white px-6 py-2 rounded-full hover:bg-[#9e8762] transition-all font-medium shadow-md"
        >
          Save Settings
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

export default AdminSettings;