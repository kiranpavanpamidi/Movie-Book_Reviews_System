const axios = require("axios");

exports.getTrendingMovies = async (req, res) => {
  try {
    const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.TMDB_API_KEY}`;
    const result = await axios.get(url);
    res.json(result.data.results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMovieDetails = async (req, res) => {
  try {
    const url = `https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${process.env.TMDB_API_KEY}`;
    const result = await axios.get(url);
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
