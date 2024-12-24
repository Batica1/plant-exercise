import axios from 'axios';

const API_URL = "http://127.0.0.1:8000/plants/";
const PRODUCTION_API_URL = "http://127.0.0.1:8000/production/";

export const getPowerPlants = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching power plants:", error);
    throw error;
  }
};

export const navigateToPlantDetails = (navigate, plantId) => {
  navigate(`/plant/${plantId}`);
};

export const createPlant = async (plantData) => {
  try {
    const response = await axios.post(API_URL, plantData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createPlantAndNavigate = async (plantData, navigate) => {
  try {
    await createPlant(plantData);
    navigate('/');
  } catch (error) {
    console.error('Error creating plant:', error);
    if (error.response) {
      console.error('Validation errors:', error.response.data);
    }
    throw error;
  }
};

export const deletePowerPlant = async (plantId) => {
  try {
    const response = await axios.delete(`${API_URL}${plantId}`, {
      params: { power_plant_id: plantId },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting power plant:", error);
    throw error;
  }
};

export const updatePowerPlant = async (plantId, plantData) => {
  try {
    const response = await axios.put(`${API_URL}${plantId}`, plantData);
    return response.data;
  } catch (error) {
    console.error("Error updating power plant:", error);
    throw error;
  }
};

export const getProductionData = async (powerPlantId) => {
  try {
    const response = await axios.get(`${PRODUCTION_API_URL}${powerPlantId}/weekly-productions`);
    return response.data;
  } catch (error) {
    console.error("Error fetching production data:", error);
    throw error;
  }
};
