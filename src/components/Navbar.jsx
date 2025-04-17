import { NavLink } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { ShoppingCartIcon, HomeIcon, TruckIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const { cart } = useContext(CartContext);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const storedToken = localStorage.getItem('token');
      const storedRole = localStorage.getItem('userRole');
      console.log('Fetched from localStorage → token:', storedToken, 'role:', storedRole);
      setToken(storedToken);
      setRole(storedRole);
    };

    // Run after a short delay to ensure localStorage updates are complete
    setTimeout(() => {
      checkAuth();
    }, 100);

    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setToken(null);
    setRole('');
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between space-x-4">
        <div className="flex items-center gap-4">
          <NavLink
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-blue-900 hover:text-yellow-500 transition"
          >
            <img src="/logo.png" alt="Gilded Page" className="h-8 mr-2" />
            <span className="text-xl font-serif text-[#AF9B79] font-semibold">Gilded Page</span>
          </NavLink>

          {role && (
            <div className="px-3 py-1 bg-gradient-to-r from-yellow-300 to-yellow-500 text-blue-900 text-xs font-bold rounded-full shadow-sm whitespace-nowrap">
              {role === 'admin' ? '🛠️ Admin Access' : '👤 User Mode'}
            </div>
          )}
        </div>

        <ul className="flex items-center gap-3 text-sm md:text-base font-medium whitespace-nowrap overflow-auto">
          {role === 'admin' && (
            <li>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md transition duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:transition-all after:duration-300 hover:after:w-full ${
                    isActive
                      ? 'bg-blue-700 text-yellow-400 font-semibold shadow-md'
                      : 'hover:bg-blue-700 hover:text-yellow-200'
                  }`
                }
              >
                Dashboard
              </NavLink>
            </li>
          )}
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md transition duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:transition-all after:duration-300 hover:after:w-full ${
                  isActive
                    ? 'bg-blue-700 text-yellow-400 font-semibold shadow-md'
                    : 'hover:bg-blue-700 hover:text-yellow-200'
                }`
              }
            >
              <HomeIcon className="h-4 w-4" />
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/search"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md transition duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:transition-all after:duration-300 hover:after:w-full ${
                  isActive
                    ? 'bg-blue-700 text-yellow-400 font-semibold shadow-md'
                    : 'hover:bg-blue-700 hover:text-yellow-200'
                }`
              }
            >
              🔍 Search
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/nyt-trending"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md transition duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:transition-all after:duration-300 hover:after:w-full ${
                  isActive
                    ? 'bg-blue-700 text-yellow-400 font-semibold shadow-md'
                    : 'hover:bg-blue-700 hover:text-yellow-200'
                }`
              }
            >
              📈 Trending
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `relative flex items-center gap-2 px-3 py-2 rounded-md transition duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:transition-all after:duration-300 hover:after:w-full ${
                  isActive
                    ? 'bg-blue-700 text-yellow-400 font-semibold shadow-md'
                    : 'hover:bg-blue-700 hover:text-yellow-200'
                }`
              }
            >
              <ShoppingCartIcon className="h-4 w-4" />
              Cart
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-4 bg-red-500 text-white text-[10px] font-semibold rounded-full px-1.5 py-0.5 animate-bounce">
                  {cart.length}
                </span>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/track"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md transition duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:transition-all after:duration-300 hover:after:w-full ${
                  isActive
                    ? 'bg-blue-700 text-yellow-400 font-semibold shadow-md'
                    : 'hover:bg-blue-700 hover:text-yellow-200'
                }`
              }
            >
              <TruckIcon className="h-4 w-4" />
              Track
            </NavLink>
          </li>
          {!token ? (
            <>
              <li>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-md transition duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:transition-all after:duration-300 hover:after:w-full ${
                      isActive
                        ? 'bg-blue-700 text-yellow-400 font-semibold shadow-md'
                        : 'hover:bg-blue-700 hover:text-yellow-200'
                    }`
                  }
                >
                  Register
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-md transition duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:transition-all after:duration-300 hover:after:w-full ${
                      isActive
                        ? 'bg-blue-700 text-yellow-400 font-semibold shadow-md'
                        : 'hover:bg-blue-700 hover:text-yellow-200'
                    }`
                  }
                >
                  Login
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-md transition duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:transition-all after:duration-300 hover:after:w-full ${
                      isActive
                        ? 'bg-blue-700 text-yellow-400 font-semibold shadow-md'
                        : 'hover:bg-blue-700 hover:text-yellow-200'
                    }`
                  }
                >
                  👤 Profile
                </NavLink>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-md bg-red-500 hover:bg-red-600 transition text-white font-medium"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
