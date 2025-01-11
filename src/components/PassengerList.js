import React, { useState } from "react";
import "./PassengerList.css";
import HealthStatus from "./HealthStatus";

const PassengerList = ({ passengers }) => {
  const [filter, setFilter] = useState("List");

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const filteredPassengers = passengers.filter((passenger) => {
    if (filter === "List") return true;
    if (filter === "Safe to Travel") return passenger.status === "Approved";
    if (filter === "Needs Review") return passenger.status === "Pending";
    if (filter === "Not Eligible") return passenger.status === "Declined";
    return true;
  });

  return (
    <div className="passenger-list-container">
      {/* <div className="filter-container">
        {["List", "Safe to Travel", "Needs Review", "Not Eligible"].map((option) => (
          <div
            key={option}
            className={`filter-option ${filter === option ? "active" : ""}`}
            onClick={() => handleFilterChange(option)}
          >
            {option}
          </div>
        ))}
        <div className="filter-highlight" style={{ left: `${["List", "Safe to Travel", "Needs Review", "Not Eligible"].indexOf(filter) * 150}px` }} />
      </div> */}

      <table className="passenger-table">
        <thead>
          <tr>
            <th className="table-header">ID</th>
            <th className="table-header">Name</th>
            <th className="table-header">Route</th>
            <th className="table-header">Health Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredPassengers.map((passenger) => (
            <tr key={passenger.id} className="table-row">
              <td className="table-cell">{passenger.id}</td>
              <td className="table-cell">{passenger.name}</td>
              <td className="table-cell">
                {passenger.from} to {passenger.to}
              </td>
              <td className="table-cell">
                <HealthStatus status={passenger.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PassengerList;
