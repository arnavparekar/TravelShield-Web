import React from "react";
import "./PassengerList.css";
import HealthStatus from "./HealthStatus";
import { useHistory } from "react-router-dom";

const PassengerList = ({ passengers }) => {
  const history = useHistory(); 

  const handleNameClick = (userId) => {
    history.push(`/user-dashboard/${userId}`); 
  };

  return (
    <div className="passenger-list-container">
      <table className="passenger-table">
        <thead>
          <tr>
            <th className="table-header">Flight ID</th>
            <th className="table-header">Name</th>
            <th className="table-header">Route</th>
            <th className="table-header">Health Status</th>
          </tr>
        </thead>
        <tbody>
          {passengers.length > 0 ? (
            passengers.map((passenger) => (
              <tr key={passenger.id} className="table-row">
                <td className="table-cell">{passenger.id}</td>
                <td 
                  className="table-cell name-cell" 
                  onClick={() => handleNameClick(passenger.userId)}
                  style={{ cursor: 'pointer', color: '#0066cc' }}
                >
                  {passenger.name}
                </td>
                <td className="table-cell">
                  {passenger.from} to {passenger.to}
                </td>
                <td className="table-cell">
                  <HealthStatus status={passenger.status} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                No passengers found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PassengerList;