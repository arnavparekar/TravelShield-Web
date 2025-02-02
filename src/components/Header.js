import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "../firebase";
import "./Header.css";
import LogoImage from "../Assets/Logo_TravelShield.jpg"

function Header() {
  const [user, setUser] = useState(null);
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [isSmallHeader, setIsSmallHeader] = useState(false);

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

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrollingUp(currentScrollY < lastScrollY);
      setIsSmallHeader(currentScrollY > 100);
      lastScrollY = currentScrollY;
      setScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`header ${isScrollingUp ? "visible" : "hidden"} ${
        isSmallHeader ? "small" : ""
      }`}
    >
      <div className="logo">
      <img src={LogoImage} alt="TravelShield Logo" className="logo-img"/>
        TravelShield
      </div>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/list">List</Link>
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
