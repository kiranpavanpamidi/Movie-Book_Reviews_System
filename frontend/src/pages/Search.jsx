import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Search = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);

  const movieRowRef = useRef(null);
  const bookRowRef = useRef(null);

  // Fetch Trending Movies & Books on mount
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const movieRes = await axios.get(
          `http://localhost:5000/api/items/movies/popular`
        );
        setTrendingMovies(movieRes.data);

        const bookRes = await axios.get(
          `http://localhost:5000/api/items/books/popular`
        );
        setTrendingBooks(bookRes.data);
      } catch (err) {
        console.error("Failed to fetch trending", err);
      }
    };

    fetchTrending();
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setResults([]);
    setError("");

    try {
      let fetchedResults = [];

      if (category === "all" || category === "movie") {
        const movieRes = await axios.get(
          `http://localhost:5000/api/items/movies/${query}`
        );
        fetchedResults = [
          ...fetchedResults,
          ...movieRes.data.map((m) => ({ ...m, type: "movie" })),
        ];
      }

      if (category === "all" || category === "book") {
        const bookRes = await axios.get(
          `http://localhost:5000/api/items/books/${query}`
        );
        fetchedResults = [
          ...fetchedResults,
          ...bookRes.data.map((b) => ({ ...b, type: "book" })),
        ];
      }

      setResults(fetchedResults);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch results. Try again.");
    }

    setLoading(false);
  };

  // Scroll functions
  const scrollLeft = (ref) => {
    ref.current.scrollBy({ left: -300, behavior: "smooth" });
  };
  const scrollRight = (ref) => {
    ref.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  const arrowButtonStyle =
    "absolute top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 cursor-pointer z-20";

  const arrowIconStyle = "text-gray-600 text-xl font-bold select-none";

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Search Bar */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Search Movies & Books</h2>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by title..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />

          <select
            className="border border-gray-300 rounded-lg px-4 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All</option>
            <option value="movie">Movies</option>
            <option value="book">Books</option>
          </select>

          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            Search
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center mt-8 text-lg font-semibold">Searching...</div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center mt-8 text-red-500 font-semibold">{error}</div>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8 max-w-6xl mx-auto">
          {results.map((item) => (
            <Link
              key={item.id}
              to={`/item/${item.type}/${item.id}`}
              className="hover:no-underline text-black"
            >
              <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
                <img
                  src={item.poster}
                  alt={item.title}
                  className="rounded-lg mb-3 w-full h-56 object-cover"
                />
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="text-gray-600">{item.type}</p>
                {item.rating && <p className="font-semibold mt-2">⭐ {item.rating}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Trending Movies */}
      <div className="max-w-6xl mx-auto mt-12 relative">
        <h2 className="text-2xl font-bold mb-4">Trending Movies</h2>
        <div
          ref={movieRowRef}
          className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory relative"
        >
          {trendingMovies.map((movie) => (
            <Link
              key={movie.id}
              to={`/item/movie/${movie.id}`}
              className="min-w-[200px] bg-white rounded-xl shadow p-2 hover:shadow-lg snap-start"
            >
              <img
                src={movie.poster}
                alt={movie.title}
                className="rounded-lg w-full h-56 object-cover"
              />
              <h3 className="mt-2 font-semibold">{movie.title}</h3>
            </Link>
          ))}
        </div>
        <button
          onClick={() => scrollLeft(movieRowRef)}
          className={`${arrowButtonStyle} left-[-20px]`}
        >
          <span className={arrowIconStyle}>◀</span>
        </button>
        <button
          onClick={() => scrollRight(movieRowRef)}
          className={`${arrowButtonStyle} right-[-20px]`}
        >
          <span className={arrowIconStyle}>▶</span>
        </button>
      </div>

      {/* Trending Books */}
      <div className="max-w-6xl mx-auto mt-12 relative">
        <h2 className="text-2xl font-bold mb-4">Trending Books</h2>
        <div
          ref={bookRowRef}
          className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory relative"
        >
          {trendingBooks.map((book) => (
            <Link
              key={book.id}
              to={`/item/book/${book.id}`}
              className="min-w-[200px] bg-white rounded-xl shadow p-2 hover:shadow-lg snap-start"
            >
              <img
                src={book.poster}
                alt={book.title}
                className="rounded-lg w-full h-56 object-cover"
              />
              <h3 className="mt-2 font-semibold">{book.title}</h3>
            </Link>
          ))}
        </div>
        <button
          onClick={() => scrollLeft(bookRowRef)}
          className={`${arrowButtonStyle} left-[-20px]`}
        >
          <span className={arrowIconStyle}>◀</span>
        </button>
        <button
          onClick={() => scrollRight(bookRowRef)}
          className={`${arrowButtonStyle} right-[-20px]`}
        >
          <span className={arrowIconStyle}>▶</span>
        </button>
      </div>
    </div>
  );
};

export default Search;