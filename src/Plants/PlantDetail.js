import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPowerPlants, getProductionData, updatePowerPlant } from "../API/api";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

const PlantDetail = () => {
  const { plantId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    capacity_mw: "",
    status: "",
    water_flow_rate: "",
  });
  const [productionData, setProductionData] = useState([]);
  const [displayWeeks, setDisplayWeeks] = useState(Infinity);



  useEffect(() => {
    const fetchPlantDetails = async () => {
      try {
        const plantData = await getPowerPlants();
        const selectedPlant = plantData.find(
          (plant) => plant.id === parseInt(plantId)
        );
        setFormData({
          name: selectedPlant.name,
          location: selectedPlant.location,
          capacity_mw: selectedPlant.capacity_mw,
          status: selectedPlant.status,
          water_flow_rate: selectedPlant.water_flow_rate,
        });

        const prodData = await getProductionData(parseInt(plantId));
        setProductionData(
          prodData.map((item) => ({
            production_date: new Date(item.production_date).toLocaleDateString(
              "en-GB"
            ),
            production_mw: item.production_mw,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchPlantDetails();
  }, [plantId]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdatePlant = async (e) => {
    e.preventDefault();
    try {
      await updatePowerPlant(parseInt(plantId), formData);
      alert("Plant details updated successfully.");
    } catch (error) {
      console.error("Failed to update plant details:", error);
      alert("Failed to update plant details.");
    }
  };

  const filteredProductionData = productionData.slice(0, displayWeeks);


  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <h3>Edit Plant Details</h3>
          
          <form onSubmit={handleUpdatePlant}>
            <div className="mb-3">

              <label htmlFor="name" className="form-label">
                Name
              </label>

              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="location" className="form-label">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                className="form-control"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="capacity_mw" className="form-label">
                Capacity (MW)
              </label>
              <input
                type="number"
                id="capacity_mw"
                name="capacity_mw"
                className="form-control"
                value={formData.capacity_mw}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <input
                type="text"
                id="status"
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="water_flow_rate" className="form-label">
                Water Flow Rate
              </label>

              <input
                type="number"
                id="water_flow_rate"
                name="water_flow_rate"
                className="form-control"
                value={formData.water_flow_rate}
                onChange={handleInputChange}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Update
            </button>

          </form>
        </div>

        <div className="col-md-6">
          <h3>Weekly Production Data</h3>
          <div className="mb-3">
            <button
              className="btn btn-primary me-2"
              onClick={() => setDisplayWeeks(10)}
            >
              10 Weeks
            </button>
            <button
              className="btn btn-primary me-2"
              onClick={() => setDisplayWeeks(50)}
            >
              50 Weeks
            </button>
            <button
              className="btn btn-primary me-2"
              onClick={() => setDisplayWeeks(100)}
            >
              100 Weeks
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setDisplayWeeks(Infinity)}
            >
              All Time
            </button>
          </div>
          
            <LineChart
              width={700}
              height={400}
              data={filteredProductionData}
            >
              <Line type="monotone" dataKey="production_mw" />
              <CartesianGrid />
              <XAxis dataKey="production_date" />
              <YAxis />
              <Tooltip />

            </LineChart>
          
        </div>
      </div>
    </div>
  );
};

export default PlantDetail;
