import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import CheckoutPage from "./pages/CheckoutPage";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <Routes>
        <Route path="/" element={<CheckoutPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}
