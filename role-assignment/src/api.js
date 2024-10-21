// api.js
import axios from 'axios';

// Function to assign conductor and inspector
export const assignConductorInspector = async (conductorId, inspectorId, inspectionPointId) => {
  try {
    const response = await axios.post('http://localhost:5000/assignments', {
      conductor_id: conductorId,
      inspector_id: inspectorId,
      inspection_point_id: inspectionPointId,
    });
    return response.data;
  } catch (error) {
    console.error('Error assigning conductor, inspector, and inspection point:', error.message);
    throw error;
  }
};

// Fetch all inspectors from the database
export const fetchInspectors = async () => {
  try {
    const response = await axios.get('http://localhost:5000/inspectors');
    return response.data;
  } catch (error) {
    console.error('Error fetching inspectors:', error.message);
    throw error;
  }
};

// Fetch all inspection points from the database
export const fetchInspectionPoints = async () => {
  try {
    const response = await axios.get('http://localhost:5000/inspection-points');
    return response.data;
  } catch (error) {
    console.error('Error fetching inspection points:', error.message);
    throw error;
  }
};

// Add a new inspector
export const addInspector = async (name) => {
  try {
    const response = await axios.post('http://localhost:5000/inspectors', { name });
    return response.data;
  } catch (error) {
    console.error('Error adding inspector:', error.message);
    throw error;
  }
};

// Remove an inspector
export const removeInspector = async (inspectorId) => {
  try {
    const response = await axios.delete(`http://localhost:5000/inspectors/${inspectorId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing inspector:', error.message);
    throw error;
  }
};

// Add a new inspection point
export const addInspectionPoint = async (name) => {
  try {
    const response = await axios.post('http://localhost:5000/inspection-points', { name });
    return response.data;
  } catch (error) {
    console.error('Error adding inspection point:', error.message);
    throw error;
  }
};

// Remove an inspection point
export const removeInspectionPoint = async (inspectionPointId) => {
  try {
    const response = await axios.delete(`http://localhost:5000/inspection-points/${inspectionPointId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing inspection point:', error.message);
    throw error;
  }
};
