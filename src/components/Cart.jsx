import { useContext, useState } from 'react';
import api from '../api/api';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [phone, setPhone] = useState('');

  // Calculate total cart price
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
  const taxRate = 0.08; // 8% tax
  const taxAmount = (parseFloat(cartTotal) * taxRate).toFixed(2);
  const grandTotal = (parseFloat(cartTotal) + parseFloat(taxAmount)).toFixed(2);

  const placeOrder = async () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    if (!phone.trim()) {
      toast.error('📱 Phone number is required!');
      return;
    }

    try {
      setPlacingOrder(true);

      const items = cart.map(item => ({
        bookId: item.bookId,
        quantity: item.quantity,
      }));

      console.log('🛒 Placing order:', { items, phone });

      const token = localStorage.getItem('token');

      const res = await api.post(
        '/orders',
        { items, phone },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('✅ Order placed successfully!');
      console.log('Order Response:', res.data);

      clearCart();
    } catch (error) {
      toast.error('❌ Failed to place order!');
      console.error('Order error:', error);
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleStripeCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    try {
      const line_items = cart.map((item) => ({
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      }));

      const res = await api.post('/payment/checkout', {
        title: 'Book Order',
        price: cartTotal,
        quantity: 1
      });

      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (error) {
      toast.error('❌ Stripe checkout failed!');
      console.error('Stripe checkout error:', error);
    }
  };

  return (
    <section className="p-4 md:p-10 min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <h2 className="text-3xl font-bold mb-6 text-center">🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <div className="text-center text-gray-600 text-lg mt-12">
          No items in cart. Go add some books! 📚
        </div>
      ) : (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-xl space-y-6">
          <ul className="divide-y divide-gray-200">
            {cart.map((item) => (
              <li key={item.bookId} className="p-4 flex justify-between items-center">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  <p className="text-sm font-medium text-gray-700">
                    Price: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(item.bookId)}
                  className="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-all duration-200"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 p-4 border rounded-lg bg-gray-50 space-y-2">
            <div className="flex justify-between">
              <span className="text-md font-semibold">Subtotal:</span>
              <span className="text-md text-gray-800">${cartTotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-md font-semibold">Tax (8%):</span>
              <span className="text-md text-gray-800">${taxAmount}</span>
            </div>
            <div className="flex justify-between pt-2 border-t font-bold text-lg">
              <span>Total:</span>
              <span className="text-green-600">${grandTotal}</span>
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              📱 Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="Enter your mobile number"
              className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Place Order Button */}
          <div className="mt-4 text-center">
            <button
              onClick={placeOrder}
              disabled={placingOrder}
              className={`w-full md:w-auto bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-md font-medium hover:from-green-600 hover:to-green-700 transition duration-200 ${
                placingOrder ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {placingOrder ? 'Placing Order...' : '✅ Place Order'}
            </button>
          </div>

          <div className="mt-2 text-center">
            <button
              onClick={handleStripeCheckout}
              className="w-full md:w-auto bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-md font-medium hover:from-purple-600 hover:to-purple-700 transition duration-200"
            >
              💳 Buy with Stripe
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Cart;
