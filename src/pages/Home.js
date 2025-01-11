import React, { useState } from "react";
import Tabs from "../components/Tabs";
import PassengerList from "../components/PassengerList";
import SearchBar from "../components/SearchBar";
import "./Home.css";

const passengers = [
  { id: "001", name: "John Doe", from: "Mumbai", to: "London", status: "Approved" },
  { id: "002", name: "Jane Smith", from: "Cape Town", to: "London", status: "Pending" },
  { id: "003", name: "Michael Johnson", from: "London", to: "Cape Town", status: "Declined" },
  { id: "004", name: "Emily Brown", from: "Mumbai", to: "Cape Town", status: "Approved" },
  { id: "005", name: "Arnav Parekar", from: "Cape Town", to: "Mumbai", status: "Pending" },
  { id: "006", name: "Nikhil Parkar", from: "London", to: "Mumbai", status: "Declined" },
];

function Home() {
  const [activeTab, setActiveTab] = useState("List");
  const [searchQuery, setSearchQuery] = useState("");


  const tabFilteredPassengers = passengers.filter((passenger) => {
    if (activeTab === "List") return true;
    if (activeTab === "Safe to Travel") return passenger.status === "Approved";
    if (activeTab === "Needs Review") return passenger.status === "Pending";
    if (activeTab === "Not Eligible") return passenger.status === "Declined";
    return false;
  });


  const finalFilteredPassengers = searchQuery
    ? tabFilteredPassengers.filter((passenger) =>
        passenger.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tabFilteredPassengers;

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="home">
      <div className="hero">
        <h1>Safer Travel, for Healthier World</h1>
        <p>Transforming Global Travel by Helping Airports Prioritize Passenger Safety and Health.</p>
        <div className="tabs-section">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <SearchBar onSearch={handleSearch} />
        <PassengerList passengers={finalFilteredPassengers} />
      </div>
    </div>
  );
}

export default Home;