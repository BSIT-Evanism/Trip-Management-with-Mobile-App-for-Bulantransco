// src/DeparturePage.js

import React, { useState, useEffect } from "react";

const DeparturePage = () => {
  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState("");
  const [multiplier, setMultiplier] = useState(1);

  // Fetch destinations with passengers for dropdown on mount
  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = () => {
    fetch("http://localhost:5001/departure-destinations")
      .then((response) => response.json())
      .then((data) => setDestinations(data))
      .catch((error) =>
        console.error("Error fetching departure destinations:", error)
      );
  };

  const handleDeboardPassenger = () => {
    if (!selectedDestination) {
      alert("Please select a destination");
      return;
    }

    // Send deboard request to backend
    fetch("http://localhost:5001/deboard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ destinationId: selectedDestination, multiplier }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          alert(data.message);
          // Update the destinations list with the latest from the backend
          setDestinations(data.destinations);
          setSelectedDestination("");
        }
      })
      .catch((error) => console.error("Error deboarding passengers:", error));
  };

  return (
    <div className="departure-container">
      <h1>Departure Page</h1>
      <div className="select-container">
        <label>Select Destination:</label>
        <select
          className="destination-dropdown"
          value={selectedDestination}
          onChange={(e) => setSelectedDestination(e.target.value)}
        >
          <option value="">-- Select Destination --</option>
          {destinations.map((destination) => (
            <option key={destination.id} value={destination.id}>
              {destination.location_name} ({destination.count}x)
            </option>
          ))}
        </select>
      </div>

      <div className="multiplier-container">
        <label>Multiplier:</label>
        <input
          className="multiplier-input"
          type="number"
          value={multiplier}
          onChange={(e) => setMultiplier(Number(e.target.value))}
          min="1"
        />
      </div>

      <button className="deboard-button" onClick={handleDeboardPassenger}>
        Deboard Passenger
      </button>
    </div>
  );
};

export default DeparturePage;
