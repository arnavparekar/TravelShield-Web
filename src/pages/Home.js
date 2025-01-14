import React from "react";
import { Link } from "react-router-dom";
import { Shield, Globe, UserCheck } from "lucide-react";
import "./Home.css";

function Home() {
  return (
    <div className="home">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Safer Travel, for Healthier World</h1>
          <p>Transforming Global Travel by Helping Airports Prioritize Passenger Safety and Health.</p>
          <div className="cta-buttons">
            <Link to="/list" className="primary-btn">Check Passengers</Link>
            <Link to="/world-map" className="secondary-btn">View World Map</Link>
          </div>
        </div>
      </section>
      <section className="features-section">
        <div className="container">
          <h2>Why Choose TravelShield?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Shield className="icon" />
              </div>
              <h3>Health Screening</h3>
              <p>Advanced health monitoring and screening protocols for safer travel</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Globe className="icon" />
              </div>
              <h3>Global Network</h3>
              <p>Connected with airports worldwide for seamless health verification</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <UserCheck className="icon" />
              </div>
              <h3>Real-time Updates</h3>
              <p>Instant health status verification and travel recommendations</p>
            </div>
          </div>
        </div>
      </section>
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>98%</h3>
              <p>Health Verification Accuracy</p>
            </div>
            <div className="stat-card">
              <h3>2-5 min</h3>
              <p>Average Screening Time</p>
            </div>
            <div className="stat-card">
              <h3>24/7</h3>
              <p>Real-time Monitoring</p>
            </div>
          </div>
        </div>
      </section>
      <section className="cta-section">
        <div className="container">
          <h2>Ready to ensure safer travels?</h2>
          <p>Join the network of airports prioritizing passenger health</p>
          <Link to="/sign-in" className="primary-btn">Get Started Today</Link>
        </div>
      </section>
    </div>
  );
}

export default Home;