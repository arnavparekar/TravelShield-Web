import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "../firebase";  
import "./Header.css";

function Header() {
  const [user, setUser] = useState(null);
  const history = useHistory();
  
  useEffect(() => {
    const auth = getAuth(app); 
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      const auth = getAuth(app);  
      await signOut(auth);
      setUser(null);
      history.push("/");  
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="header">
      <div className="logo">TravelShield</div>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/user-dashboard">User Dashboard</Link>
        <Link to="/world-map">World Map</Link>
        {user ? (
          <button onClick={handleSignOut} className="auth-btn">
            Sign Out
          </button>
        ) : (
          <Link to="/sign-in" className="auth-btn">
            Sign In
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Header;
