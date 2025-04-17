import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [stock, setStock] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5001/api/books', {
        title,
        author,
        price,
        image,
        stock
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('✅ Book added successfully!');
      navigate('/admin?section=books');
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to add book');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">📘 Add a New Book</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Enter book title" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
          <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required placeholder="Enter author name" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="Enter price (e.g., 12.99)" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="Paste image URL (optional)" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            placeholder="Enter stock quantity"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-gradient-to-r from-blue-700 to-blue-900 text-white font-semibold rounded-md hover:from-blue-800 hover:to-blue-950 transition shadow-md flex items-center justify-center gap-2"
        >
          <span>➕</span> <span>Add Book</span>
        </button>
      </form>
    </div>
  );
};

export default AddBook;