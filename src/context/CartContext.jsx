import { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (book) => {
    console.log('Adding to cart:', book);
    const existingItem = cart.find((item) => item.bookId === book._id);
    if (existingItem) {
      setCart(cart.map((item) =>
        item.bookId === book._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        bookId: book._id,
        title: book.title,
        price: book.price,
        quantity: 1
      }]);
    }
  };

  const removeFromCart = (bookId) => {
    console.log('Removing from cart:', bookId);
    setCart(cart.filter(item => item.bookId !== bookId));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
