import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AddReview = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();

  const [itemTitle, setItemTitle] = useState("Loading...");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/items/${type}/${id}`);
        setItemTitle(res.data.title);
      } catch (err) {
        setItemTitle("Unknown Item");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/reviews",
        { itemId: id, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Review added successfully!");
      navigate(`/item/${type}/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to submit review.");
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Write a Review</h2>

        <div className="mb-4">
          <label className="font-semibold block mb-1">Item</label>
          <input value={itemTitle} disabled className="w-full px-3 py-2 bg-gray-200 rounded-lg" />
        </div>

        <div className="mb-4">
          <label className="font-semibold block mb-2">Rating</label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(null)}
                xmlns="http://www.w3.org/2000/svg"
                fill={(hover || rating) >= star ? "gold" : "gray"}
                viewBox="0 0 24 24"
                className="w-8 h-8 cursor-pointer"
              >
                <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.548 8.279L12 18.896l-7.484 4.517 1.548-8.279L0 9.306l8.332-1.151z" />
              </svg>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-semibold block mb-1">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddReview;