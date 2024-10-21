import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import MyChart from './MyChart';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './components/main.css';
import {
  assignConductorInspector,
  fetchInspectors,
  fetchInspectionPoints,
  addInspector,
  removeInspector,
  addInspectionPoint,
  removeInspectionPoint,
} from './api';

const localizer = momentLocalizer(moment);

const MainMenu = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedConductor, setSelectedConductor] = useState('');
  const [selectedInspector, setSelectedInspector] = useState('');
  const [selectedInspectionPoint, setSelectedInspectionPoint] = useState('');
  const [conductors, setConductors] = useState([]);
  const [inspectors, setInspectors] = useState([]);
  const [inspectionPoints, setInspectionPoints] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (showModal) {
      fetch('http://localhost:5000/conductors')
        .then((response) => response.json())
        .then((data) => setConductors(data));
      fetchInspectors().then(setInspectors);
      fetchInspectionPoints().then(setInspectionPoints);
    }
  }, [showModal]);

  const handleAssignment = async () => {
    await assignConductorInspector(
      selectedConductor,
      selectedInspector,
      selectedInspectionPoint
    );
    setShowModal(false);
    fetchAssignments(); // Refetch the assignments to update UI
  };

  const fetchAssignments = async () => {
    const response = await fetch('http://localhost:5000/assignments');
    const data = await response.json();
    setAssignments(data);

    const calendarEvents = data.map((assignment, idx) => ({
      id: idx,
      title: `${assignment.conductor_name} & ${assignment.inspector_name} @ ${assignment.inspection_point}`,
      start: new Date(), // Replace with actual start date
      end: new Date(new Date().setHours(new Date().getHours() + 1)), // Replace with actual end date
    }));
    setEvents(calendarEvents);
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleAddInspector = async (name) => {
    await addInspector(name);
    fetchInspectors(); // Refetch inspectors after adding
  };

  const handleRemoveInspector = async (id) => {
    await removeInspector(id);
    fetchInspectors(); // Refetch inspectors after removal
  };

  const handleAddInspectionPoint = async (name) => {
    await addInspectionPoint(name);
    fetchInspectionPoints(); // Refetch inspection points after adding
  };

  const handleRemoveInspectionPoint = async (id) => {
    await removeInspectionPoint(id);
    fetchInspectionPoints(); // Refetch inspection points after removal
  };

  const handleClearAssignments = async () => {
    await fetch('http://localhost:5000/assignments', {
      method: 'DELETE',
    });
    setAssignments([]);
    setEvents([]);
  };

  return (
    <div className="main-container">
      <header className="header">
        <button className="assign-button" onClick={() => setShowModal(true)}>
          Assign Roles
        </button>
      </header>

      <div className="cards-container">
        {/* Line Graph Container */}
        <div className="card linechart-card">
          <MyChart />
        </div>

        {/* Assigned Personnel Container */}
        <div className="card assigned-table">
          <h3>Assigned Personnel</h3>
          <table>
            <thead>
              <tr>
                <th>Conductor</th>
                <th>Inspector</th>
                <th>Inspection Point</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment, idx) => (
                <tr key={idx}>
                  <td>{assignment.conductor_name}</td>
                  <td>{assignment.inspector_name}</td>
                  <td>{assignment.inspection_point}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleClearAssignments}>Clear Assignments</button>
        </div>

        {/* Calendar Container */}
        <div className="card calendar-card">
          <h3>Calendar</h3>
          <div style={{ width: '100%', overflow: 'hidden' }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '500px' }}
              views={['month', 'week', 'day']}
            />
          </div>
        </div>
      </div>

      {/* Modal for assigning roles */}
      <div className={`modal-overlay ${showModal ? 'show' : ''}`}>
        <div className="modal-content">
          <h3>Assign Conductor, Inspector & Inspection Point</h3>

          <div className="dropdown-container">
            <select
              className="dropdown"
              onChange={(e) => setSelectedConductor(e.target.value)}
            >
              <option value="">Select Conductor</option>
              {conductors.map((conductor) => (
                <option key={conductor.id} value={conductor.id}>
                  {conductor.name}
                </option>
              ))}
            </select>

            <select
              className="dropdown"
              onChange={(e) => setSelectedInspector(e.target.value)}
            >
              <option value="">Select Inspector</option>
              {inspectors.map((inspector) => (
                <option key={inspector.id} value={inspector.id}>
                  {inspector.name}
                </option>
              ))}
            </select>

            <select
              className="dropdown"
              onChange={(e) => setSelectedInspectionPoint(e.target.value)}
            >
              <option value="">Select Inspection Point</option>
              {inspectionPoints.map((point) => (
                <option key={point.id} value={point.id}>
                  {point.name}
                </option>
              ))}
            </select>
          </div>

          <div className="dropdown-row">
            <button className="assign-button" onClick={handleAssignment}>
              Assign
            </button>
            <button
              className="close-modal"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>

          <div className="button-row">
            <button
              className="small-button"
              onClick={() =>
                handleAddInspector(prompt('Enter inspector name:'))
              }
            >
              Add Inspector
            </button>
            <button
              className="small-button"
              onClick={() =>
                handleRemoveInspector(prompt('Enter inspector ID to remove:'))
              }
            >
              Remove Inspector
            </button>
            <button
              className="small-button"
              onClick={() =>
                handleAddInspectionPoint(prompt('Enter inspection point name:'))
              }
            >
              Add Inspection Point
            </button>
            <button
              className="small-button"
              onClick={() =>
                handleRemoveInspectionPoint(
                  prompt('Enter inspection point ID to remove:')
                )
              }
            >
              Remove Inspection Point
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
