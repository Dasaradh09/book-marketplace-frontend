import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    image: '',
    stock: ''
  });

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5001/api/books/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData(res.data);
      } catch (err) {
        toast.error('Failed to fetch book');
      }
    };
    fetchBook();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5001/api/books/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('✅ Book updated!');
      navigate('/admin?section=books');
    } catch (err) {
      toast.error('❌ Failed to update book');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">✏️ Edit Book</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter book title"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white"
        />
        <input
          name="author"
          value={formData.author}
          onChange={handleChange}
          placeholder="Enter author name"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white"
        />
        <input
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          placeholder="Enter price (e.g., 12.99)"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white"
        />
        <input
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="Paste image URL (optional)"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white"
        />
        <input
          name="stock"
          type="number"
          value={formData.stock}
          onChange={handleChange}
          placeholder="Enter stock quantity"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white"
        />
        <button
          type="submit"
          className="w-full py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 font-semibold rounded-md hover:from-yellow-500 hover:to-yellow-600 transition shadow-md flex items-center justify-center gap-2"
        >
          <span>💾</span> <span>Update Book</span>
        </button>
      </form>
    </div>
  );
};

export default EditBook;