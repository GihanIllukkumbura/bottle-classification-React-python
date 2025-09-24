// src/components/Navbar.jsx
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Waste Sorting App</h1>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/register" className="hover:underline">Register</Link>
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/about" className="hover:underline">About</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
