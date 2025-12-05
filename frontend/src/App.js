import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import ItemDetails from "./pages/ItemDetails";
import AddReview from "./pages/AddReview";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Search />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Item details route with type and id */}
        <Route
          path="/item/:type/:id"
          element={
            <ProtectedRoute>
              <ItemDetails />
            </ProtectedRoute>
          }
        />

        {/* Add review page */}
        <Route
          path="/item/:type/:id/review"
          element={
            <ProtectedRoute>
              <AddReview />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}