// src/components/LocationDropdown.js

import React, { useEffect, useState } from "react";

const LocationDropdown = ({ selectedDestination, setSelectedDestination }) => {
  const [destinations, setDestinations] = useState([]);

  // Fetch destinations from the backend
  useEffect(() => {
    fetch("http://localhost:5001/destinations")
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => setDestinations(Array.isArray(data) ? data : []))
      .catch((error) => console.error("Error fetching destinations:", error));
  }, []);

  return (
    <div>
      <select
        value={selectedDestination || ""}
        onChange={(e) => setSelectedDestination(e.target.value)}
        className="destination-dropdown"
      >
        <option value="" disabled>
          Select Destination
        </option>
        {destinations.map((destination) => (
          <option key={destination.id} value={destination.id}>
            {destination.location_name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationDropdown;
