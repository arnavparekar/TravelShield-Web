// import React, { useState, useEffect } from "react";
// import Tabs from "../components/Tabs";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../firebase";
// import PassengerList from "../components/PassengerList";
// import SearchBar from "../components/SearchBar";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import "./List.css";
// import SignIn from "../pages/SignIn";

// function List() {
//   const [activeTab, setActiveTab] = useState("List");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showSignIn, setShowSignIn] = useState(false);
//   const [passengers, setPassengers] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchPassengers = async () => {
//       try {
//         setLoading(true);
//         const usersRef = collection(db, "users");
//         const userSnapshot = await getDocs(usersRef);
//         const usersList = [];

//         for (const userDoc of userSnapshot.docs) {
//           const userData = userDoc.data();
//           const userName = userData.name;
//           const travelHistoryRef = collection(userDoc.ref, "travelHistory");
//           const travelHistorySnapshot = await getDocs(travelHistoryRef);

//           for (const travelDoc of travelHistorySnapshot.docs) {
//             const travelData = travelDoc.data();
//             const travelHealthScore = travelData.travelHealthScore;
//             const vaccinationsRef = collection(userDoc.ref, "vaccinations");
//             const vaccinationsSnapshot = await getDocs(vaccinationsRef);

//             let status = "Pending";

//             if (!travelHealthScore) {
//               status = "Pending";
//             } else if (parseFloat(travelHealthScore) > 9.0) {
//               status = "Approved";
//             } else {
//               status = "Declined";
//             }

//             if (vaccinationsSnapshot.empty) {
//               status = "Pending";
//             }

//             usersList.push({
//               id: travelData.travelID,
//               name: userName,
//               from: travelData.currentCity,
//               to: travelData.destinationCity,
//               date: travelData.date,
//               status: status,
//             });
//           }
//         }

//         setPassengers(usersList);
//       } catch (error) {
//         console.error("Error fetching passengers:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPassengers();
//   }, []); 

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

//   const handleDateChange = (date) => {
//     setSelectedDate(date ? date.toISOString().split("T")[0] : null);
//   };

//   return (
//     <div className={`home ${showSignIn ? "blurred" : ""}`}>
//       <div className="hero">
//         <h1>Safer Travel, for Healthier World</h1>
//         <p>
//           Transforming Global Travel by Helping Airports Prioritize Passenger
//           Safety and Health.
//         </p>
//         <div className="tabs-section">
//           <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
//         </div>
//         <SearchBar onSearch={handleSearch} />
//         <div className="date-picker">
//           <DatePicker
//             selected={selectedDate ? new Date(selectedDate) : null}
//             onChange={handleDateChange}
//             dateFormat="yyyy-MM-dd"
//             placeholderText="Select Date"
//           />
//         </div>
//         {loading ? (
//           <div className="loading">Loading passengers...</div>
//         ) : (
//           <PassengerList passengers={finalFilteredPassengers} />
//         )}
//       </div>

//       {showSignIn && <SignIn toggleSignIn={toggleSignIn} />}
//     </div>
//   );
// }

// export default List;

import React, { useState, useEffect } from "react";
import Tabs from "../components/Tabs";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import PassengerList from "../components/PassengerList";
import SearchBar from "../components/SearchBar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./List.css";
import SignIn from "../pages/SignIn";

function List() {
  const [activeTab, setActiveTab] = useState("List");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSignIn, setShowSignIn] = useState(false);
  const [passengers, setPassengers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPassengers = async () => {
      try {
        setLoading(true);
        const usersRef = collection(db, "users");
        const userSnapshot = await getDocs(usersRef);
        const usersList = [];

        for (const userDoc of userSnapshot.docs) {
          const userData = userDoc.data();
          const userName = userData.name;
          const travelHistoryRef = collection(userDoc.ref, "travelHistory");
          const travelHistorySnapshot = await getDocs(travelHistoryRef);

          for (const travelDoc of travelHistorySnapshot.docs) {
            const travelData = travelDoc.data();
            const travelHealthScore = travelData.travelHealthScore;
            const vaccinationsRef = collection(userDoc.ref, "vaccinations");
            const vaccinationsSnapshot = await getDocs(vaccinationsRef);

            let status = "Pending";

            if (!travelHealthScore) {
              status = "Pending";
            } else if (parseFloat(travelHealthScore) > 9.0) {
              status = "Approved";
            } else {
              status = "Declined";
            }

            if (vaccinationsSnapshot.empty) {
              status = "Pending";
            }

            usersList.push({
              id: travelData.travelID,
              name: userName,
              from: travelData.currentCity,
              to: travelData.destinationCity,
              date: travelData.date,
              status: status,
            });
          }
        }

        setPassengers(usersList);
      } catch (error) {
        console.error("Error fetching passengers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPassengers();
  }, []);

  const tabFilteredPassengers = passengers.filter((passenger) => {
    if (activeTab === "List") return true;
    if (activeTab === "Safe to Travel") return passenger.status === "Approved";
    if (activeTab === "Needs Review") return passenger.status === "Pending";
    if (activeTab === "Not Eligible") return passenger.status === "Declined";
    return false;
  });

  const finalFilteredPassengers = tabFilteredPassengers.filter((passenger) => {
    const matchesSearch = searchQuery
      ? passenger.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesDate = selectedDate
      ? passenger.date === selectedDate
      : true;

    return matchesSearch && matchesDate;
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const toggleSignIn = () => {
    setShowSignIn(!showSignIn);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date ? date.toISOString().split("T")[0] : null);
  };

  return (
    <div className={`home ${showSignIn ? "blurred" : ""}`}>
      <div className="hero">
        <h1>Safer Travel, for Healthier World</h1>
        <p>
          Transforming Global Travel by Helping Airports Prioritize Passenger
          Safety and Health.
        </p>
        <div className="tabs-section">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <SearchBar onSearch={handleSearch} />
        <div className="date-picker">
          <DatePicker
            selected={selectedDate ? new Date(selectedDate) : null}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select Date"
          />
        </div>
        {loading ? (
          <div className="loading">Loading passengers...</div>
        ) : (
          <PassengerList passengers={finalFilteredPassengers} />
        )}
      </div>

      {showSignIn && <SignIn toggleSignIn={toggleSignIn} />}
    </div>
  );
}

export default List;

