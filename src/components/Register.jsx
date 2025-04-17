import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [form, setForm] = useState({ email: '', password: '', role: 'user' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/auth/register', form);
      alert('Registered successfully! Please log in.');
    } catch (err) {
      console.error(err);
      alert('Registration failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-blue-100 px-4">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 shadow-xl rounded-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-blue-900 mb-2 text-center">📝 Create an Account</h2>
        <p className="text-sm text-gray-600 mb-6 text-center">Sign up to get started</p>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="role">Role</label>
          <select
            name="role"
            id="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-md hover:from-blue-700 hover:to-blue-900 transition shadow-md"
        >
          🚀 Register
        </button>
      </form>
    </div>
  );
};

export default Register;