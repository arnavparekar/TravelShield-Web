// import React, { useState } from "react";
// import Tabs from "../components/Tabs";
// import PassengerList from "../components/PassengerList";
// import SearchBar from "../components/SearchBar";
// import "./Home.css";
// import SignIn from "../pages/SignIn";

// const passengers = [
//   { id: "001", name: "John Doe", from: "Mumbai", to: "London", status: "Approved" },
//   { id: "002", name: "Jane Smith", from: "Cape Town", to: "London", status: "Pending" },
//   { id: "003", name: "Michael Johnson", from: "London", to: "Cape Town", status: "Declined" },
//   { id: "004", name: "Emily Brown", from: "Mumbai", to: "Cape Town", status: "Approved" },
//   { id: "005", name: "Arnav Parekar", from: "Cape Town", to: "Mumbai", status: "Pending" },
//   { id: "006", name: "Nikhil Parkar", from: "London", to: "Mumbai", status: "Declined" },
// ];

// function Home() {
//   const [activeTab, setActiveTab] = useState("List");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showSignIn, setShowSignIn] = useState(false);

//   const tabFilteredPassengers = passengers.filter((passenger) => {
//     if (activeTab === "List") return true;
//     if (activeTab === "Safe to Travel") return passenger.status === "Approved";
//     if (activeTab === "Needs Review") return passenger.status === "Pending";
//     if (activeTab === "Not Eligible") return passenger.status === "Declined";
//     return false;
//   });

//   const finalFilteredPassengers = searchQuery
//     ? tabFilteredPassengers.filter((passenger) =>
//         passenger.name.toLowerCase().includes(searchQuery.toLowerCase())
//       )
//     : tabFilteredPassengers;

//   const handleSearch = (query) => {
//     setSearchQuery(query);
//   };

//   const toggleSignIn = () => {
//     setShowSignIn(!showSignIn);
//   };

//   return (
//     <div className={`home ${showSignIn ? "blurred" : ""}`}>
//       <div className="hero">
//         <h1>Safer Travel, for Healthier World</h1>
//         <p>Transforming Global Travel by Helping Airports Prioritize Passenger Safety and Health.</p>
//         <div className="tabs-section">
//           <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
//         </div>
//         <SearchBar onSearch={handleSearch} />
//         <PassengerList passengers={finalFilteredPassengers} />
//       </div>

//       {/* Sign In Modal */}
//       {showSignIn && <SignIn toggleSignIn={toggleSignIn} />}
//     </div>
//   );
// }

// export default Home;

import React from "react";
import { Link } from "react-router-dom";
import { Shield, Globe, UserCheck } from "lucide-react";
import "./Home.css";

function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
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

      {/* Features Section */}
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

      {/* Statistics Section */}
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

      {/* CTA Section */}
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