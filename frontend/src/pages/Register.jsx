import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/auth/register", {
        name: username,
        email,
        password,
      });

      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      alert("Registration failed. Try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Centered Register Form */}
      <div className="relative flex justify-center items-center min-h-screen px-6">
        <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
          
          <h1 className="text-3xl font-bold text-white text-center mb-6">
            Create an Account 
          </h1>
          <p className="text-gray-200 text-center mb-6">
            Join us to explore thousands of reviews
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Username */}
            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white border border-white/30 outline-none focus:ring-2 focus:ring-blue-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white border border-white/30 outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white border border-white/30 outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="text-center text-gray-300 mt-4">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-400 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
