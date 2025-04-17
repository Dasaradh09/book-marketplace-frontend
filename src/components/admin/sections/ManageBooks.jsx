import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5001/api/books', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load books.');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this book?');
    if (!confirm) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/api/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(books.filter((book) => book._id !== id));
    } catch (err) {
      alert('Failed to delete the book.');
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">📚 Manage Books</h2>

      {loading ? (
        <p>Loading books...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : books.length === 0 ? (
        <p className="text-gray-500">No books found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book._id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{book.title}</h3>
                <p className="text-sm text-gray-600 italic">by {book.author}</p>
                <p className="mt-2 text-sm text-blue-700 font-medium">${book.price}</p>
                <p className="text-sm text-gray-500">Stock: {book.stock}</p>
              </div>
              <div className="mt-4 flex justify-between gap-2">
                <button
                  onClick={() => navigate(`/admin/books/edit/${book._id}`)}
                  className="flex-1 bg-yellow-400 text-sm text-blue-900 font-medium py-1.5 rounded hover:bg-yellow-500"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(book._id)}
                  className="flex-1 bg-red-500 text-sm text-white font-medium py-1.5 rounded hover:bg-red-600"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageBooks;