import React from "react";
import { BiListUl } from "react-icons/bi";
import { FaPlane } from "react-icons/fa";
import { MdWarning, MdCancel } from "react-icons/md";
import "./Tabs.css";

function Tabs({ activeTab, setActiveTab }){
  const tabs = [
    { id: "List", icon: BiListUl },
    { id: "Safe to Travel", icon: FaPlane },
    { id: "Needs Review", icon: MdWarning },
    { id: "Not Eligible", icon: MdCancel }
  ];

  return (
    <div className="tabs-container">
      <div className="tabs">
        {tabs.map(({ id, icon: Icon }) => (
          <div
            key={id}
            className={`tab ${activeTab === id ? "active" : ""}`}
            onClick={() => setActiveTab(id)}
          >
            <Icon className="tab-icon" size={18} />
            <span>{id}</span>
          </div>
        ))}
        <div
          className="tab-highlight"
          style={{
            width: `${document.querySelectorAll('.tab')[tabs.findIndex(t => t.id === activeTab)]?.offsetWidth || 0}px`,
            transform: `translateX(${
              Array.from(document.querySelectorAll('.tab'))
                .slice(0, tabs.findIndex(t => t.id === activeTab))
                .reduce((acc, el) => acc + (el.offsetWidth || 0), 0)
            }px)`,
          }}
        />
      </div>
    </div>
  );
}

export default Tabs;