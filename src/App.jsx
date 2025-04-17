import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import BookList from './components/BookList';
import Cart from './components/Cart';
import TrackOrder from './components/TrackOrder';
import AdminDashboard from './components/admin/AdminDashboard';
import AddBook from './components/admin/sections/AddBook';
import EditBook from './components/admin/sections/EditBook';
import BookStore from './components/BookStore';
import BookSearch from './components/BookSearch';
import Welcome from './components/Welcome';
import Footer from './components/Footer';
import TrendingNYT from './components/TrendingNYT';
import UserProfile from './components/UserProfile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <Navbar />
      <>
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route
              path="/"
              element={
                localStorage.getItem('token') ? <BookList /> : <Navigate to="/welcome" />
              }
            />
            <Route path="/cart" element={<Cart />} />
            <Route path="/track" element={<TrackOrder />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} /> {/* New Route */}
            <Route
              path="/store"
              element={
                localStorage.getItem('token') ? <BookStore /> : <Navigate to="/welcome" />
              }
            />
            <Route
              path="/search"
              element={
                localStorage.getItem('token') ? <BookSearch /> : <Navigate to="/welcome" />
              }
            />
            <Route path="/welcome" element={<Welcome />} />
            <Route
              path="/nyt-trending"
              element={
                localStorage.getItem('token') ? <TrendingNYT /> : <Navigate to="/welcome" />
              }
            />
            <Route
              path="/admin"
              element={
                localStorage.getItem('userRole') === 'admin' ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/admin/books/add"
              element={
                localStorage.getItem('userRole') === 'admin' ? (
                  <AddBook />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/admin/books/edit/:id"
              element={
                localStorage.getItem('userRole') === 'admin' ? <EditBook /> : <Navigate to="/" />
              }
            />
            <Route
              path="/profile"
              element={
                localStorage.getItem('token') ? <UserProfile /> : <Navigate to="/login" />
              }
            />
          </Routes>
        </div>
        <Footer />
      </>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </Router>
  );
}

export default App;
