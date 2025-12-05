const express = require("express");
const axios = require("axios");
const router = express.Router();

// Movies
router.get("/movies/:query", async (req, res) => {
  try {
    const query = req.params.query;
    const apiKey = process.env.OMDB_API_KEY;
    const response = await axios.get(
      `http://www.omdbapi.com/?apikey=${apiKey}&s=${query}`
    );

    const movies = (response.data.Search || []).map((movie) => ({
      id: movie.imdbID,
      title: movie.Title,
      type: movie.Type,
      poster:
        movie.Poster !== "N/A"
          ? movie.Poster
          : "https://via.placeholder.com/200x300",
    }));

    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch movies" });
  }
});

// Books
router.get("/books/:query", async (req, res) => {
  try {
    const query = req.params.query;
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${query}`
    );

    const books = (response.data.items || []).map((item) => ({
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || [],
      description: item.volumeInfo.description || "No description available",
      type: "book",
      poster:
        item.volumeInfo.imageLinks?.thumbnail ||
        "https://via.placeholder.com/200x300",
    }));

    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch books" });
  }
});

// Single item details
router.get("/:type/:id", async (req, res) => {
  const { type, id } = req.params;
  try {
    if (type === "movie") {
      const apiKey = process.env.OMDB_API_KEY;
      const response = await axios.get(
        `http://www.omdbapi.com/?apikey=${apiKey}&i=${id}`
      );
      res.json({
        id: response.data.imdbID,
        title: response.data.Title,
        type: response.data.Type,
        poster:
          response.data.Poster !== "N/A"
            ? response.data.Poster
            : "https://via.placeholder.com/200x300",
        year: response.data.Year,
        plot: response.data.Plot,
        rating: response.data.imdbRating,
      });
    } else if (type === "book") {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes/${id}`
      );
      const item = response.data;
      res.json({
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors || [],
        description: item.volumeInfo.description || "No description",
        poster:
          item.volumeInfo.imageLinks?.thumbnail ||
          "https://via.placeholder.com/200x300",
        pageCount: item.volumeInfo.pageCount || "N/A",
        publishedDate: item.volumeInfo.publishedDate || "N/A",
      });
    } else {
      res.status(400).json({ message: "Invalid type" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch item details" });
  }
});

module.exports = router;
