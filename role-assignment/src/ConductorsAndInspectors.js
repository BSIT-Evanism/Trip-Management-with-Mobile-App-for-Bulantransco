import React, { useState, useEffect } from 'react';
import { fetchInspectors, fetchInspectionPoints } from './api'; // Adjust import if necessary

const ConductorsAndInspectors = () => {
  const [conductors, setConductors] = useState([]);
  const [inspectors, setInspectors] = useState([]);
  const [inspectionPoints, setInspectionPoints] = useState([]);

  useEffect(() => {
    handleFetchData();
  }, []); // Fetch data on component mount

  const handleFetchData = async () => {
    try {
      // Fetch conductors
      const conductorsData = await fetchInspectors();
      setConductors(conductorsData);
      
      // Fetch inspectors
      const inspectorsData = await fetchInspectors();
      setInspectors(inspectorsData);

      // Fetch inspection points
      const pointsData = await fetchInspectionPoints();
      setInspectionPoints(pointsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <h1>Assign Conductors and Inspectors</h1>

      <div>
        <label>Choose Conductor: </label>
        <select>
          <option value="">Select Conductor</option>
          {conductors.map(conductor => (
            <option key={conductor.id} value={conductor.id}>
              {conductor.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Choose Inspector: </label>
        <select>
          <option value="">Select Inspector</option>
          {inspectors.map(inspector => (
            <option key={inspector.id} value={inspector.id}>
              {inspector.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Choose Inspection Point: </label>
        <select>
          <option value="">Select Inspection Point</option>
          {inspectionPoints.map(point => (
            <option key={point.id} value={point.id}>
              {point.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ConductorsAndInspectors;
