import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true); // waiting for auth check
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Clean up the listener
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-white">Loading...</p>; // optional loader
  }

  if (!user) {
    // Not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  // Logged in → render the protected component
  return children;
};

export default ProtectedRoute;
