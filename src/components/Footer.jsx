import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-blue-50 to-yellow-50 border-t border-gray-200 shadow-inner mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <img src="/logo.png" alt="Gilded Page" className="h-10 w-10 rounded-full shadow-md" />
          <h3 className="text-2xl font-bold text-blue-800">Gilded Page</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">Discover. Read. Repeat.</p>
        <nav className="flex justify-center gap-8 text-sm font-medium text-gray-600">
          <a href="/store" className="hover:text-blue-700 transition">Store</a>
          <a href="/track" className="hover:text-blue-700 transition">Track Order</a>
          <a href="/about" className="hover:text-blue-700 transition">About</a>
        </nav>
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-blue-800 mb-2">📬 Join Our Literary Circle</h4>
          <p className="text-sm text-gray-600 mb-3">Receive curated book recommendations and elegant reads straight to your inbox.</p>
          <form className="flex flex-col sm:flex-row justify-center gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#AF9B79] outline-none w-full sm:w-auto"
            />
            <button
              type="submit"
              className="bg-[#AF9B79] text-white px-6 py-2 rounded-full hover:bg-[#9e8762] transition-all"
            >
              Subscribe
            </button>
          </form>
        </div>
        <p className="text-xs text-gray-400 mt-4">
          &copy; {new Date().getFullYear()} BookVerse. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;