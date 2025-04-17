import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BookStore = () => {
  const [books, setBooks] = useState([]);
  const [coverUrls, setCoverUrls] = useState({});

  const fetchCoverUrl = async (title) => {
    try {
      const res = await axios.get(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`);
      const coverId = res.data.docs[0]?.cover_i;
      return coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5001/api/books', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBooks(res.data);

        const covers = {};
        for (const book of res.data) {
          const url = await fetchCoverUrl(book.title);
          covers[book._id] = url;
        }
        setCoverUrls(covers);
      } catch (err) {
        toast.error('Failed to load books');
      }
    };
    fetchBooks();
  }, []);

  const handleBuyNow = async (book) => {
    try {
      const res = await axios.post('http://localhost:5001/api/payment/checkout', {
        title: book.title,
        price: book.price,
        quantity: 1
      });
      window.location.href = res.data.url;
    } catch (err) {
      toast.error('Failed to initiate payment');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📚 Book Store</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {books.map((book) => (
          <div key={book._id} className="border rounded-lg p-4 shadow bg-white">
            {coverUrls[book._id] && (
              <img src={coverUrls[book._id]} alt={book.title} className="w-full h-48 object-cover mb-3 rounded" />
            )}
            <h2 className="text-lg font-semibold">{book.title}</h2>
            <p className="text-sm text-gray-600">{book.author}</p>
            <p className="text-md font-bold mt-2">${book.price}</p>
            <button
              onClick={() => handleBuyNow(book)}
              className="btn btn-primary mt-3 w-full"
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookStore;