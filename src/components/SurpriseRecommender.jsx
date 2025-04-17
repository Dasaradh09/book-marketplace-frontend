import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const SurpriseRecommender = () => {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);

  const fetchSurpriseRecommendation = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('Please log in to get AI suggestions');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get('http://localhost:5001/api/ai/recommend', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRecommendation(res.data);
    } catch (err) {
      console.error('Surprise AI error:', err);
      toast.error('Failed to fetch recommendation from AI');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-blue-50 p-6 rounded-lg shadow-md mt-10">
      <div className="text-center">
        <button
          onClick={fetchSurpriseRecommendation}
          className="bg-indigo-600 text-white px-6 py-2 rounded-full text-lg font-medium shadow hover:bg-indigo-700 transition"
        >
          ✨ Surprise Me with a Book
        </button>
      </div>

      {loading && (
        <p className="text-center mt-4 text-blue-600 font-semibold">🔮 Consulting the book gods...</p>
      )}

      {recommendation && (
        <div className="mt-6 bg-white border border-gray-200 rounded-xl p-5 shadow-lg max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">📘 {recommendation.title}</h2>
          <p className="text-md italic text-gray-700 mb-2">by {recommendation.author}</p>
          <p className="text-gray-600 mb-4">{recommendation.reason}</p>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
            ➕ Add to My Store
          </button>
        </div>
      )}
    </div>
  );
};

export default SurpriseRecommender;