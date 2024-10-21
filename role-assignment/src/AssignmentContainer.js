import React, { useState, useEffect } from 'react';

const AssignmentContainer = ({ clearCalendar }) => {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    fetch('/assignments')
      .then((response) => response.json())
      .then((data) => setAssignments(data))
      .catch((error) => console.error('Error fetching assignments:', error));
  }, []);

  const handleClear = () => {
    setAssignments([]); // Clear assignments from the container
    clearCalendar(); // Clear assignments from the calendar
  };

  return (
    <div className="assignment-container">
      <h2>Assigned Personnel</h2>
      {assignments.length === 0 ? (
        <p>No assignments yet.</p>
      ) : (
        <ul>
          {assignments.map((assignment) => (
            <li key={assignment.id}>
              <strong>Conductor:</strong> {assignment.conductor_name} <br />
              <strong>Inspector:</strong> {assignment.inspector_name} <br />
              <strong>Inspection Point:</strong> {assignment.inspection_point_name}
            </li>
          ))}
        </ul>
      )}
      <button onClick={handleClear}>Clear</button>
    </div>
  );
};

export default AssignmentContainer;
