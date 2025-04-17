import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const TrendingNYT = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBooks = async () => {
    setLoading(true);
    const apiKey = import.meta.env.VITE_NYT_API_KEY;
    try {
      const res = await axios.get(
        `https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=${apiKey}`
      );
      setBooks(res.data.results.books);
    } catch {
      toast.error('Failed to load NYT trending books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAdd = async (book) => {
    const confirm = window.confirm(`Add "${book.title}" by ${book.author} to your store?`);
    if (!confirm) return;

    const stockInput = prompt('Enter stock quantity:', '5');
    const stock = parseInt(stockInput);
    if (isNaN(stock) || stock < 0) {
      toast.error('Invalid stock amount');
      return;
    }

    try {
      const payload = {
        title: book.title,
        author: book.author,
        price: 20,
        stock,
        image: book.book_image,
      };
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5001/api/books', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`"${book.title}" added to your store!`);
    } catch {
      toast.error('Failed to add book to your store');
    }
  };

  const handleViewReview = async (title) => {
    const apiKey = import.meta.env.VITE_NYT_API_KEY;
    try {
      const res = await axios.get(`https://api.nytimes.com/svc/books/v3/reviews.json?title=${encodeURIComponent(title)}&api-key=${apiKey}`);
      const review = res.data.results?.[0];
      if (review && review.url) {
        window.open(review.url, '_blank');
      } else {
        toast.info('No NYT review found for this book.');
      }
    } catch {
      toast.error('Error fetching book review.');
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-yellow-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">🔥 Trending Books (NYT)</h1>
        {loading ? (
          <p className="text-center text-blue-500">🔄 Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div key={book.primary_isbn13} className="bg-white border border-gray-200 rounded-xl shadow p-4 hover:shadow-md transition">
                <img
                  src={book.book_image}
                  alt={book.title}
                  className="h-48 w-full object-cover mb-4 rounded"
                />
                <h3 className="text-lg font-bold text-gray-900">{book.title}</h3>
                <p className="text-sm text-gray-600 italic mb-4">by {book.author}</p>
                <button
                  onClick={() => handleAdd(book)}
                  className="w-full py-2 bg-green-500 text-white font-medium rounded hover:bg-green-600 transition"
                >
                  ➕ Add to My Store
                </button>
                <button
                  onClick={() => handleViewReview(book.title)}
                  className="w-full mt-2 py-2 bg-blue-100 text-blue-800 font-medium rounded hover:bg-blue-200 transition"
                >
                  📰 View NYT Review
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingNYT;