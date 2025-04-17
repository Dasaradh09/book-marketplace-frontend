import React from 'react';
import { useLocation } from 'react-router-dom';
import ManageBooks from './sections/ManageBooks';
import ManageUsers from './sections/ManageUsers';
import Orders from './sections/Orders';
import Reviews from './sections/Reviews';
import Notifications from './sections/Notifications';
import AdminSettings from './sections/AdminSettings';
import Analytics from './sections/Analytics';
import DashboardHome from './sections/DashboardHome';

const AdminDashboard = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const activeTab = query.get('section') || 'dashboard';

  const renderSection = () => {
    switch (activeTab) {
      case 'books': return <ManageBooks />;
      case 'users': return <ManageUsers />;
      case 'orders': return <Orders />;
      case 'reviews': return <Reviews />;
      case 'notifications': return <Notifications />;
      case 'settings': return <AdminSettings />;
      case 'analytics': return <Analytics />;
      case 'dashboard': return <DashboardHome />;
      default: return null;
    }
  };

  return (
    <div className="flex min-h-screen font-sans">
      <aside className="w-64 bg-gradient-to-br from-blue-50 to-white border-r border-blue-200 p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-blue-900 mb-6 tracking-tight">📘 Admin Panel</h2>
        <ul className="space-y-3">
          <li><a href="/admin?section=dashboard" className="block px-3 py-2 rounded-md hover:bg-blue-100 text-gray-800 hover:text-blue-700 font-medium">📊 Dashboard</a></li>
          <li><a href="/admin?section=books" className="block px-3 py-2 rounded-md hover:bg-blue-100 text-gray-800 hover:text-blue-700 font-medium">📚 Manage Books</a></li>
          <li><a href="/admin?section=users" className="block px-3 py-2 rounded-md hover:bg-blue-100 text-gray-800 hover:text-blue-700 font-medium">👥 Manage Users</a></li>
          <li><a href="/admin?section=orders" className="block px-3 py-2 rounded-md hover:bg-blue-100 text-gray-800 hover:text-blue-700 font-medium">📦 Orders</a></li>
          <li><a href="/admin?section=reviews" className="block px-3 py-2 rounded-md hover:bg-blue-100 text-gray-800 hover:text-blue-700 font-medium">⭐ Reviews</a></li>
          <li><a href="/admin?section=notifications" className="block px-3 py-2 rounded-md hover:bg-blue-100 text-gray-800 hover:text-blue-700 font-medium">🔔 Notifications</a></li>
          <li><a href="/admin?section=analytics" className="block px-3 py-2 rounded-md hover:bg-blue-100 text-gray-800 hover:text-blue-700 font-medium">📈 Analytics</a></li>
          <li><a href="/admin?section=settings" className="block px-3 py-2 rounded-md hover:bg-blue-100 text-gray-800 hover:text-blue-700 font-medium">⚙️ Settings</a></li>
        </ul>
      </aside>

      <main className="flex-1 p-10 bg-gray-100 overflow-y-auto rounded-l-xl shadow-inner">
        {renderSection()}
      </main>
    </div>
  );
};

export default AdminDashboard;