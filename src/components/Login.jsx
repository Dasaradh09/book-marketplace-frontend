import { useState } from 'react';
import api from '../api/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post('/auth/login', { email, password });
      console.log('Login response:', res.data);
      const { token, role } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);

      toast.success('✅ Logged in successfully!');

      setTimeout(() => {
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
        window.location.reload(); // Ensure Navbar picks up updated localStorage
      }, 100);
    } catch (err) {
      console.error('Login error:', err);
      toast.error('❌ Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 shadow-xl rounded-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center flex items-center justify-center gap-2">
          🔐 <span>Login to Your Account</span>
        </h2>

        <div className="mb-5">
          <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-md hover:from-blue-700 hover:to-blue-900 transition shadow-md"
        >
          🚀 Login
        </button>
      </form>
    </div>
  );
};

export default Login;