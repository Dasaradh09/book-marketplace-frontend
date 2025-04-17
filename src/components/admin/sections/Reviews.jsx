import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5001/api/reviews', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(res.data);
    } catch (err) {
      setError('Failed to fetch reviews.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/api/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(reviews.filter((review) => review._id !== id));
    } catch (err) {
      alert('Failed to delete review.');
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-900 mb-6 tracking-tight">📝 Review Moderation</h2>
      {error && <p className="text-red-600 bg-red-50 border border-red-200 rounded p-3">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
          <thead className="bg-blue-100 text-blue-900 text-left">
            <tr>
              <th className="px-4 py-2 font-semibold">Reviewer</th>
              <th className="px-4 py-2 font-semibold">Book</th>
              <th className="px-4 py-2 font-semibold">Content</th>
              <th className="px-4 py-2 font-semibold">Rating</th>
              <th className="px-4 py-2 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-4">No reviews found.</td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review._id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2">{review.reviewerEmail || 'N/A'}</td>
                  <td className="px-4 py-2">{review.bookTitle || 'N/A'}</td>
                  <td className="px-4 py-2">{review.content}</td>
                  <td className="px-4 py-2">{review.rating}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition text-sm"
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reviews;
