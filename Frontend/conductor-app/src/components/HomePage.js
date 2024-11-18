// src/HomePage.js

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LocationDropdown from "./LocationDropdown";
import "../styles/mobile.css";

const HomePage = () => {
  const [selectedDestination, setSelectedDestination] = useState("");
  const [addedPassengers, setAddedPassengers] = useState([]); // Store added passengers with counts
  const navigate = useNavigate();

  // Fetch added passengers from the backend
  useEffect(() => {
    fetch("http://localhost:5001/added-passengers")
      .then((response) => response.json())
      .then((data) => setAddedPassengers(data))
      .catch((error) =>
        console.error("Error fetching added passengers:", error)
      );
  }, []);

  // Handle adding a passenger
  const handleAddPassenger = () => {
    if (selectedDestination) {
      fetch("http://localhost:5001/passengers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ destinationId: selectedDestination }),
      })
        .then((response) => response.json())
        .then((data) => {
          setAddedPassengers((prev) =>
            prev.map((p) =>
              p.id === data.id ? { ...p, count: p.count + 1 } : p
            )
          );
          alert("Passenger Added");
        })
        .catch((error) => console.error("Error adding passenger:", error));
    } else {
      alert("Please select a destination");
    }
  };

  // Navigate to the Departure page
  const handleDeparture = () => {
    navigate("/departure");
  };

  return (
    <div className="home-container">
      <h1 className="welcome-text">Welcome, Conductor</h1>

      {/* Section for adding passengers */}
      <div className="passenger-container">
        <h2 className="section-title">Add Enroute Passenger</h2>

        {/* Location Dropdown */}
        <LocationDropdown
          selectedDestination={selectedDestination}
          setSelectedDestination={setSelectedDestination}
        />

        <button onClick={handleAddPassenger} className="button">
          Add Passenger
        </button>
      </div>

      {/* Button for navigating to Departure page */}
      <button onClick={handleDeparture} className="departure-button">
        Departure
      </button>

      {/* Display list of added passengers */}
      <div className="passenger-list">
        <h3>Added Passengers:</h3>
        <ul>
          {addedPassengers.map((passenger) => (
            <li key={passenger.location_name}>
              {passenger.location_name} - {passenger.count}x
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
