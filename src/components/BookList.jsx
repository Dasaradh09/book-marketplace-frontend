import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorFilter, setAuthorFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [dealBook, setDealBook] = useState(null);
  const [dealCountdown, setDealCountdown] = useState('');
  const { addToCart } = useContext(CartContext);
  const [openRec, setOpenRec] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get('/books');
        setBooks(res.data);
      } catch (err) {
        console.error('Error fetching books:', err);
        toast.error('Failed to load books.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const today = new Date().toDateString();
    const cachedDeal = JSON.parse(localStorage.getItem('dealOfTheDay'));

    if (cachedDeal && cachedDeal.date === today) {
      setDealBook(cachedDeal.book);
    } else if (books.length > 0) {
      const random = books[Math.floor(Math.random() * books.length)];
      const newDeal = { book: random, date: today };
      localStorage.setItem('dealOfTheDay', JSON.stringify(newDeal));
      setDealBook(random);
    }
  }, [books]);

  useEffect(() => {
    if (dealBook) {
      const interval = setInterval(() => {
        const now = new Date();
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0);
        const diff = midnight - now;
        const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
        const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0');
        const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
        setDealCountdown(`${hours}:${minutes}:${seconds}`);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [dealBook]);

  useEffect(() => {
    const fetchOpenLibraryRec = async () => {
      const subjects = ['adventure', 'romance', 'fantasy', 'science_fiction', 'mystery'];
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      try {
        const res = await fetch(`https://openlibrary.org/subjects/${subject}.json?limit=50`);
        const data = await res.json();
        const works = data.works;
        const random = works[Math.floor(Math.random() * works.length)];
        setOpenRec({
          title: random.title,
          author: random.authors?.[0]?.name || 'Unknown',
          cover: random.cover_id
            ? `https://covers.openlibrary.org/b/id/${random.cover_id}-L.jpg`
            : 'https://via.placeholder.com/150',
          subject,
        });
      } catch (error) {
        console.error('Open Library rec error:', error);
      }
    };

    fetchOpenLibraryRec();
    const interval = setInterval(fetchOpenLibraryRec, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAddToCart = (book) => {
    addToCart(book);
    toast.success(`${book.title} added to cart!`);
  };

  const handleTrackView = (book) => {
    const recent = JSON.parse(localStorage.getItem("recentBooks") || "[]");
    const updated = [book, ...recent.filter((b) => b._id !== book._id)].slice(0, 5);
    localStorage.setItem("recentBooks", JSON.stringify(updated));
  };

  let filteredBooks = books
    .filter((book) => (authorFilter ? book.author === authorFilter : true))
    .filter((book) => {
      if (priceFilter === 'under10') return book.price < 10;
      if (priceFilter === '10to20') return book.price >= 10 && book.price <= 20;
      if (priceFilter === 'above20') return book.price > 20;
      return true;
    });

  if (sortOrder === 'newest') {
    filteredBooks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortOrder === 'oldest') {
    filteredBooks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (sortOrder === 'priceLow') {
    filteredBooks.sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'priceHigh') {
    filteredBooks.sort((a, b) => b.price - a.price);
  }

  return (
    <section className="p-4 md:p-8">
      <h2 className="text-3xl font-bold mb-6 text-center">📚 Available Books</h2>
      {dealBook && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-6 mb-8 shadow flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={dealBook.image || 'https://via.placeholder.com/100'}
              alt={dealBook.title}
              className="w-24 h-32 object-cover rounded-md shadow"
            />
            <div>
              <h3 className="text-lg font-bold text-yellow-800">🔥 Deal of the Day</h3>
              <p className="text-xl font-semibold text-gray-900">{dealBook.title}</p>
              <p className="text-sm text-gray-600 italic mb-1">by {dealBook.author}</p>
              <p className="text-blue-700 font-bold">
                Now only ${(dealBook.price * 0.8).toFixed(2)}{' '}
                <span className="line-through text-sm text-gray-400">${dealBook.price}</span>
              </p>
              <p className="text-sm text-yellow-700 mt-2">
                ⏳ Deal ends in: <span className="font-mono">{dealCountdown}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => handleAddToCart(dealBook)}
            className="mt-4 md:mt-0 px-6 py-2 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600 transition"
          >
            Grab Deal 🛒
          </button>
        </div>
      )}
      {openRec && (
        <div className="bg-gradient-to-r from-[#fef9f3] to-[#fffdf9] border border-[#f2e8d7] rounded-xl p-6 mb-8 shadow flex items-center justify-between gap-6 hover:shadow-lg transition-all">
          <div className="flex items-center gap-4">
            <img
              src={openRec.cover}
              alt={openRec.title}
              className="w-20 h-28 object-cover rounded shadow-md"
            />
            <div>
              <h3 className="text-md text-[#AF9B79] font-semibold">📖 From the Open Library</h3>
              <p className="text-lg font-bold text-gray-800">{openRec.title}</p>
              <p className="text-sm text-gray-600 italic">by {openRec.author}</p>
              <p className="text-xs text-gray-500 mt-1">Subject: {openRec.subject}</p>
            </div>
          </div>
          <button
            onClick={() => navigate(`/search?query=${encodeURIComponent(openRec.title)}`)}
            className="px-4 py-2 text-sm bg-[#AF9B79] text-white rounded hover:bg-[#a68c63] transition"
          >
            See More 📚
          </button>
        </div>
      )}
      <div className="flex flex-wrap gap-4 justify-end mb-4">
        <select
          className="px-4 py-2 border border-gray-300 rounded-md text-sm"
          onChange={(e) => {
            const value = e.target.value;
            setBooks((prev) => [...prev]); // Reset list
            setAuthorFilter(value);
          }}
        >
          <option value="">All Authors</option>
          {[...new Set(books.map((b) => b.author))].map((author) => (
            <option key={author} value={author}>
              {author}
            </option>
          ))}
        </select>

        <select
          className="px-4 py-2 border border-gray-300 rounded-md text-sm"
          onChange={(e) => {
            const filter = e.target.value;
            if (filter === "all") {
              setBooks((prev) => [...prev]);
            } else if (filter === "in") {
              setBooks((prev) => prev.filter((book) => book.stock > 0));
            } else if (filter === "out") {
              setBooks((prev) => prev.filter((book) => book.stock === 0));
            }
          }}
        >
          <option value="all">All Books</option>
          <option value="in">In Stock</option>
          <option value="out">Out of Stock</option>
        </select>

        <select
          className="px-4 py-2 border border-gray-300 rounded-md text-sm"
          onChange={(e) => setPriceFilter(e.target.value)}
        >
          <option value="">All Prices</option>
          <option value="under10">Under $10</option>
          <option value="10to20">$10 - $20</option>
          <option value="above20">Above $20</option>
        </select>

        <select
          className="px-4 py-2 border border-gray-300 rounded-md text-sm"
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center text-gray-600">
          <p className="text-xl">No books found! 😢</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => {
            const imageUrl = book.image
              ? book.image
              : book.isbn
              ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`
              : 'https://via.placeholder.com/150';

            return (
              <div
                key={book._id}
                onMouseEnter={() => handleTrackView(book)}
                className="bg-white rounded-xl shadow hover:shadow-xl transition duration-300 flex flex-col justify-between border border-gray-200"
              >
                <div className="p-4">
                  <img
                    src={imageUrl}
                    alt={book.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{book.title}</h3>
                  <p className="text-sm text-gray-600 mb-1 italic">by {book.author}</p>
                  <p className="text-xs text-gray-400 mb-1">
                    Added {dayjs(book.createdAt).fromNow()}
                  </p>
                  <p className="text-sm text-blue-700 font-semibold mb-2">${book.price}</p>
                  {book.stock > 0 && (
                    <p className="text-xs text-gray-500 mb-2">In stock: {book.stock}</p>
                  )}
                  {book.stock === 0 && (
                    <span className="inline-block text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                      Out of Stock
                    </span>
                  )}
                </div>

                <div className="p-4 border-t flex justify-center">
                  <button
                    onClick={() => handleAddToCart(book)}
                    disabled={book.stock === 0}
                    className={`w-full px-4 py-2 rounded text-white font-medium transition duration-200 ${
                      book.stock === 0
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                    }`}
                  >
                    {book.stock === 0 ? 'Out of Stock' : 'Add to Cart 🛒'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {typeof window !== 'undefined' && localStorage.getItem('recentBooks') && (
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4 text-blue-900">📚 Recently Viewed</h3>
          <Slider
            dots={true}
            infinite={false}
            speed={500}
            slidesToShow={3}
            slidesToScroll={1}
            responsive={[
              { breakpoint: 1024, settings: { slidesToShow: 3 } },
              { breakpoint: 768, settings: { slidesToShow: 2 } },
              { breakpoint: 480, settings: { slidesToShow: 1 } },
            ]}
          >
            {JSON.parse(localStorage.getItem("recentBooks")).map((book) => (
              <div key={book._id} className="px-2">
                <div className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition p-4 flex flex-col items-center text-center h-full">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="h-40 w-full object-cover rounded-md mb-3"
                  />
                  <h4 className="text-sm font-bold text-gray-800 mb-1 truncate">{book.title}</h4>
                  <p className="text-xs text-gray-500 italic">{book.author}</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </section>
  );
};

export default BookList;