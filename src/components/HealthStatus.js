import React from "react";
import "./HealthStatus.css"; 
const HealthStatus = ({ status }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return "approved-status";
      case "Pending":
        return "pending-status";
      case "Declined":
        return "declined-status";
      default:
        return "default-status";
    }
  };

  return (
    <span className={`status-badge ${getStatusClass(status)}`}>
      {status}
    </span>
  );
};

export default HealthStatus;
