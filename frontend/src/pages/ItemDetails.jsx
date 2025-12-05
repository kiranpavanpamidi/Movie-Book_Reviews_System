import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const ItemDetails = () => {
  const { type, id } = useParams();
  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/items/${type}/${id}`);
        setItem(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load details.");
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/reviews/${id}`);
        setReviews(res.data);
      } catch (err) {
        console.error("Failed to load reviews", err);
      }
    };

    fetchItem();
    fetchReviews();
  }, [id, type]);

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={item.poster}
            alt={item.title}
            className="w-full md:w-1/3 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-4">{item.title}</h1>
            {item.authors && item.authors.length > 0 && (
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Authors:</span> {item.authors.join(", ")}
              </p>
            )}
            {item.rating && (
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Rating:</span> ⭐ {item.rating}
              </p>
            )}
            <p className="text-gray-700 mb-4">{item.description || item.plot}</p>

            <Link
              to={`/item/${type}/${id}/review`}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
            >
              Add Review
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-600">No reviews yet.</p>
          ) : (
            reviews.map((r) => (
              <div key={r._id} className="border-t border-gray-200 py-2">
                <p className="font-semibold">{r.user?.name || "Anonymous"}</p>
                {r.title && <p className="italic">{r.title}</p>}
                <p>{r.comment}</p>
                <p className="text-yellow-500">⭐ {r.rating}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;