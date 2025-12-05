import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 sticky top-0 z-50">
      <div className="flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          MovieBook Reviews
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">

          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Home
          </Link>

          {!isLoggedIn && (
            <>
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50"
              >
                Register
              </Link>
            </>
          )}

          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden block text-2xl"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenu && (
        <div className="md:hidden mt-4 space-y-4">
          <Link
            to="/"
            className="block text-gray-700 hover:text-blue-600 font-medium"
            onClick={() => setMobileMenu(false)}
          >
            Home
          </Link>

          {!isLoggedIn && (
            <>
              <Link
                to="/login"
                className="block px-4 py-2 bg-blue-600 text-white rounded-xl text-center hover:bg-blue-700"
                onClick={() => setMobileMenu(false)}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="block px-4 py-2 border border-blue-600 text-blue-600 rounded-xl text-center hover:bg-blue-50"
                onClick={() => setMobileMenu(false)}
              >
                Register
              </Link>
            </>
          )}

          {isLoggedIn && (
            <button
              onClick={() => {
                handleLogout();
                setMobileMenu(false);
              }}
              className="block w-full px-4 py-2 bg-red-500 text-white rounded-xl text-center hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}