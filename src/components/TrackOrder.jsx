import { useState } from 'react';
import api from '../api/api';
import { toast } from 'react-toastify';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrackOrder = async () => {
    if (!orderId.trim()) {
      toast.warning('Please enter a valid Order ID!');
      return;
    }

    try {
      setLoading(true);
      setTrackingInfo(null); // Clear previous data

      const res = await api.get(`/orders/${orderId}/tracking`);
      setTrackingInfo(res.data);

      toast.success('Tracking info fetched successfully!');
    } catch (error) {
      console.error('Error tracking order:', error);
      toast.error('Failed to fetch tracking information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-6 md:p-10 bg-gradient-to-br from-yellow-50 to-blue-50 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-900 tracking-tight">📦 Track Your Order</h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <input
            type="text"
            placeholder="Enter your Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="flex-1 border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
          />

          <button
            onClick={handleTrackOrder}
            disabled={loading}
            className={`bg-blue-600 text-white px-6 py-2 rounded-md font-semibold transition-all duration-200 shadow-md ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {loading ? 'Tracking...' : 'Track Order'}
          </button>
        </div>

        {/* Display tracking information */}
        {trackingInfo && (
          <div className="mt-8 bg-blue-50 p-6 rounded-xl border border-blue-200 animate-fadeIn">
            <h3 className="text-xl font-bold mb-3 text-blue-800">📍 Tracking Details</h3>
            <p className="text-blue-900 mb-2">
              <strong>Status:</strong> {trackingInfo.status_description || 'Unknown'}
            </p>
            <p className="text-blue-900 mb-2">
              <strong>Tracking Number:</strong> {trackingInfo.tracking_number}
            </p>
            <a
              href={trackingInfo.tracking_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-sm text-blue-700 underline hover:text-blue-900"
            >
              🔗 View on Carrier Site
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default TrackOrder;
