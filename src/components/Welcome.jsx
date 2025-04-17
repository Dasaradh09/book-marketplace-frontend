import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();
  const [featuredBook, setFeaturedBook] = useState(null);
  const [quote, setQuote] = useState('');
  const [topPicks, setTopPicks] = useState([]);

  const fetchFeatured = async () => {
    try {
      const subjects = ['fiction', 'romance', 'mystery', 'fantasy'];
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      const res = await fetch(`https://openlibrary.org/subjects/${subject}.json?limit=50`);
      const data = await res.json();
      const works = data.works;
      const random = works[Math.floor(Math.random() * works.length)];
      setFeaturedBook({
        title: random.title,
        author: random.authors?.[0]?.name || 'Unknown',
        cover: random.cover_id
          ? `https://covers.openlibrary.org/b/id/${random.cover_id}-L.jpg`
          : 'https://via.placeholder.com/150',
        subject,
      });
    } catch (error) {
      console.error('Error fetching featured book:', error);
    }
  };

  useEffect(() => {
    fetchFeatured();
    const interval = setInterval(fetchFeatured, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const quotes = [
      '“A reader lives a thousand lives before he dies.” – George R.R. Martin',
      '“So many books, so little time.” – Frank Zappa',
      '“Until I feared I would lose it, I never loved to read. One does not love breathing.” – Harper Lee',
      '“I have always imagined that Paradise will be a kind of library.” – Jorge Luis Borges',
      '“Reading is essential for those who seek to rise above the ordinary.” – Jim Rohn',
      '“We read to know we are not alone.” – William Nicholson',
      '“There is no friend as loyal as a book.” – Ernest Hemingway',
      '“Books are a uniquely portable magic.” – Stephen King',
      '“Once you learn to read, you will be forever free.” – Frederick Douglass'
    ];

    const updateQuote = () => {
      const random = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(random);
    };

    updateQuote();
    const interval = setInterval(updateQuote, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchTopPicks = async () => {
      try {
        const res = await fetch('https://openlibrary.org/subjects/popular.json?limit=6');
        const data = await res.json();
        const picks = data.works.map(book => ({
          title: book.title,
          author: book.authors?.[0]?.name || 'Unknown',
          cover: book.cover_id
            ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
            : 'https://via.placeholder.com/150',
        }));
        setTopPicks(picks);
      } catch (err) {
        console.error('Error fetching top picks:', err);
      }
    };

    fetchTopPicks();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6ec] to-[#f0e6d2] flex flex-col items-center justify-center px-6 py-16 text-center font-serif">
      {featuredBook && (
        <div className="flip-card mb-8 max-w-xs w-full">
          <div className="flip-card-inner">
            <div className="flip-card-front border border-[#e8dbc7] bg-white/70 rounded-2xl shadow p-4 flex flex-col items-center justify-center">
              <img
                src={featuredBook.cover}
                alt={featuredBook.title}
                className="w-24 h-32 object-cover rounded-md shadow mb-4"
              />
              <h3 className="text-md text-[#AF9B79] font-semibold mb-1">✨ Today’s Gilded Pick</h3>
              <p className="text-lg font-bold text-gray-800 text-center">{featuredBook.title}</p>
            </div>
            <div className="flip-card-back border border-[#e8dbc7] bg-[#f9f3ea] rounded-2xl shadow p-6 flex flex-col items-center justify-center text-center">
              <p className="text-md font-semibold text-gray-700 mb-2">by {featuredBook.author}</p>
              <p className="text-sm text-gray-600">Subject: {featuredBook.subject}</p>
              <button
                onClick={() => navigate(`/search?query=${encodeURIComponent(featuredBook.title)}`)}
                className="mt-4 px-4 py-2 text-sm bg-[#AF9B79] text-white rounded hover:bg-[#9e8762] transition"
              >
                Explore 📖
              </button>
            </div>
          </div>
        </div>
      )}
      {featuredBook && (
        <button
          onClick={fetchFeatured}
          title="Click for another featured book"
          className="mb-8 px-4 py-2 text-sm rounded-full border border-[#AF9B79] text-[#AF9B79] hover:bg-[#AF9B79] hover:text-white transition-all"
        >
          ⏭️ Next Recommendation
        </button>
      )}
      <div className="bg-white/80 backdrop-blur-md border border-[#d8cbb3] rounded-3xl shadow-2xl p-10 max-w-3xl w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-[#AF9B79] mb-4 flex items-center justify-center gap-2 tracking-wide">
          📚 <span>Welcome to Gilded Page</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-800 mb-6 leading-relaxed">
          Discover rare gems and modern marvels. Curate your own elegant literary collection with <span className="font-semibold text-[#AF9B79]">Gilded Page</span>.
        </p>

        <div className="flex justify-center gap-6 mt-6">
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 rounded-full bg-[#AF9B79] text-white font-medium shadow-md hover:bg-[#9e8762] transition-all"
          >
            🚪 Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-6 py-2 rounded-full bg-white text-[#AF9B79] font-medium border border-[#AF9B79] shadow-md hover:bg-[#f7f1e3] transition-all"
          >
            📝 Register
          </button>
        </div>

        {topPicks.length > 0 && (
          <div className="mt-12 text-left">
            <h2 className="text-2xl font-semibold text-[#AF9B79] mb-4 text-center">🌟 Top Picks of the Month</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {topPicks.map((book, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-white/80 border border-[#e2d9c4] rounded-lg p-4 shadow hover:shadow-md transition">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-16 h-24 object-cover rounded"
                  />
                  <div>
                    <p className="text-md font-semibold text-gray-800">{book.title}</p>
                    <p className="text-sm text-gray-600 italic">by {book.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-10 text-sm text-gray-600 italic">
          <p>“A room without books is like a body without a soul.” – Cicero</p>
          <p className="mt-1">Join the community. Begin your refined reading journey today.</p>
          <p className="mt-4 text-[#AF9B79] font-medium italic transition-all duration-500">{quote}</p>
        </div>
      </div>
      <style>
        {`
          .flip-card {
            perspective: 1000px;
            cursor: pointer;
          }
          .flip-card-inner {
            position: relative;
            width: 100%;
            height: 260px;
            transition: transform 0.8s;
            transform-style: preserve-3d;
          }
          .flip-card:hover .flip-card-inner {
            transform: rotateY(180deg);
          }
          .flip-card-front, .flip-card-back {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            border-radius: 1rem;
          }
          .flip-card-back {
            transform: rotateY(180deg);
          }
        `}
      </style>
    </div>
  );
};

export default Welcome;