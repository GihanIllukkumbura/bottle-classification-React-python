// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import About from './pages/About';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import UserDashboard from "./pages/UserDashboard";
import UserObject from "./pages/UserObject";
import BottleDetails from "./pages/BottleDetails";
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-poppins">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
         <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/user-object" element={<UserObject />} />
          <Route path="/bottle-details" element={<BottleDetails />} />
               <Route path="/dashboard"element={<ProtectedRoute><UserDashboard /></ProtectedRoute>}/>
               
          
      </Routes>
    </div>
  );
}

export default App;
