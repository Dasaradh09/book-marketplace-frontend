import React, { useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';
import SurpriseRecommender from './SurpriseRecommender';

const BookSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [yearFilter, setYearFilter] = useState('');

  const handleSearch = useCallback(
    debounce(async (query, yearFilter, setResults, setLoading, toast) => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      try {
        setLoading(true);
        const res = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
        const filtered = res.data.docs.filter((book) =>
          yearFilter ? book.first_publish_year === parseInt(yearFilter) : true
        );
        setResults(filtered.slice(0, 12));
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch results from Open Library');
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  const handleAdd = async (book) => {
    const confirmAdd = window.confirm(`Add "${book.title}" by ${book.author_name?.[0]} to your store?`);
    if (!confirmAdd) return;

    const priceInput = prompt('Enter price for this book:', '10');
    const stockInput = prompt('Enter stock quantity:', '5');

    const price = parseFloat(priceInput);
    const stock = parseInt(stockInput);

    if (isNaN(price) || isNaN(stock)) {
      toast.error('Invalid price or stock value.');
      return;
    }

    try {
      const coverUrl = book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
        : '';

      const payload = {
        title: book.title,
        author: book.author_name?.[0] || 'Unknown',
        price,
        stock,
        image: coverUrl,
      };

      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5001/api/books', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success(`"${book.title}" added to your store!`);
    } catch (err) {
      toast.error('Failed to add book to your store');
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-yellow-50 to-blue-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">🔍 Search & Add Books</h1>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              const newQuery = e.target.value;
              setQuery(newQuery);
              handleSearch(newQuery, yearFilter, setResults, setLoading, toast);
            }}
            placeholder="Search by title or author"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          />
          <select
            value={yearFilter}
            onChange={(e) => {
              setYearFilter(e.target.value);
              handleSearch(query, e.target.value, setResults, setLoading, toast);
            }}
            className="w-full sm:w-48 border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">All Years</option>
            <option value="2020">2020</option>
            <option value="2010">2010</option>
            <option value="2000">2000</option>
            <option value="1990">1990</option>
          </select>
        </div>

        <SurpriseRecommender />

        {loading && (
          <p className="text-center text-blue-500 font-semibold mb-4">🔄 Searching...</p>
        )}

        {!loading && results.length === 0 && query && (
          <p className="text-center text-gray-500 italic mb-4">No results found. Try another title.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((book) => (
            <div key={book.key} className="bg-white border border-gray-200 rounded-xl shadow p-4 hover:shadow-md transition">
              {book.cover_i ? (
                <img
                  src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`}
                  alt={book.title}
                  className="h-48 w-full object-cover mb-4 rounded"
                />
              ) : (
                <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400 mb-4 rounded">
                  No Image
                </div>
              )}
              <h3 className="text-lg font-bold text-gray-900">{book.title}</h3>
              <p className="text-sm text-gray-600 italic mb-4">
                by {book.author_name?.[0] || 'Unknown Author'}
              </p>
              <button
                onClick={() => handleAdd(book)}
                className="w-full py-2 bg-green-500 text-white font-medium rounded hover:bg-green-600 transition"
              >
                ➕ Add to My Store
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookSearch;
