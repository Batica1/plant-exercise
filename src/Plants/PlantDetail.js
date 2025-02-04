import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPowerPlants, getProductionData, updatePowerPlant } from "../API/api";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import "react-datepicker/dist/react-datepicker.css";

const ConcentricCircles = ({ year, circleCount = 4 }) => {
  const colors = [
    "#00BCD4",
    "#0097A7",
    "#0D3697",
    "#02136E",
  ];

  const radiusBase = 70;
  const radii = Array.from({ length: circleCount }, (_, index) => radiusBase + index * 23);

  const getRandomHoles = (radius, minHoles = 3, maxHoles = 4) => {
    const circumference = 2 * Math.PI * radius;
    const holes = [];
    const holeCount = Math.floor(Math.random() * (maxHoles - minHoles + 1)) + minHoles;

    for (let i = 0; i < holeCount; i++) {
      const holePosition = Math.random() * circumference;
      const holeSize = (Math.random() * 0.3) * circumference;
      holes.push({ position: holePosition, size: holeSize });
    }

    return holes;
  };

  return (
    <div className="d-flex justify-content-center align-items-center flex-column">
      <svg
        width={radii[circleCount - 1] * 2 + 20}
        height={radii[circleCount - 1] * 2 + 20}
        className="pulse-animation"
      >
        {radii.map((radius, index) => {
          const holes = getRandomHoles(radius);
          let strokeDasharray = `${2 * Math.PI * radius}`;
          let strokeDashoffset = 0;

          holes.forEach((hole) => {
            strokeDasharray += `, ${hole.size} ${2 * Math.PI * radius - hole.position}`;
            strokeDashoffset = hole.position;
          });

          const circleClass = `circle${index + 1} ${index % 2 === 0 ? "rotate-left" : "rotate-right"}`;

          return (
            <circle
              key={index}
              cx="50%"
              cy="50%"
              r={radius}
              stroke={colors[index]}
              strokeWidth={4}
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className={circleClass}
            />
          );
        })}

        <text
          x="50%"
          y="53%"
          textAnchor="middle"
          alignmentBaseline="middle"
          fontFamily="sans-serif"
          fontSize="40px"
          fill="#fff"
        >
          {year}
        </text>
      </svg>
      <h3 className="mt-4 last-year-update">
        Last Year Update
      </h3>
    </div>
  );
};


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
  const [filteredData, setFilteredData] = useState([]);
  const [lastYearRecorded, setLastYearRecorded] = useState(null);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("All Time");

  useEffect(() => {
    const fetchPlantDetails = async () => {
      try {
        const plantData = await getPowerPlants();
        const selectedPlant = plantData.find((plant) => plant.id === parseInt(plantId));

        setFormData({
          name: selectedPlant.name,
          location: selectedPlant.location,
          capacity_mw: selectedPlant.capacity_mw,
          status: selectedPlant.status,
          water_flow_rate: selectedPlant.water_flow_rate,
        });

        const prodData = await getProductionData(parseInt(plantId));
        const formattedData = prodData.map((item) => ({
          production_date: new Date(item.production_date).toLocaleDateString("en-GB"),
          production_mw: item.production_mw,
          year: new Date(item.production_date).getFullYear(),
        }));

        setProductionData(formattedData);
        setFilteredData(formattedData);

        if (formattedData.length > 0) {
          const years = formattedData.map((item) => item.year);
          setLastYearRecorded(Math.max(...years));
        }
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

  const handleTimeFrameChange = (e) => {
    const selectedTime = e.target.value;
    setSelectedTimeFrame(selectedTime);

    const currentDate = new Date();
    const weeksInMillis = 1000 * 60 * 60 * 24 * 7;
    let filtered;

    if (selectedTime === "All Time") {
      filtered = productionData;
    } else {
      const weekLimit = parseInt(selectedTime.split(" ")[0]) * weeksInMillis;
      filtered = productionData.filter((item) => {
        const itemDate = new Date(item.production_date);
        return currentDate - itemDate <= weekLimit;
      });
    }

    setFilteredData(filtered);
  };


  return (
    <div className="dark-bg">
      <div className="container pt-5">
        <div className="row gx-3 gy-3">

          <div className="col-md-6">
            <div className="card p-4 shadow-sm equal-height-card card-detail-information">
              <h4>General Information</h4>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
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
                <label htmlFor="location" className="form-label">Location</label>
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
                <label htmlFor="status" className="form-label">Status</label>
                <select
                  id="status"
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="Operational">Operational</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                  <option value="Decommissioned">Decommissioned</option>
                </select>
              </div>

              <button className="btn btn-detail-update" onClick={handleUpdatePlant}>Update</button>
            </div>
          </div>


          <div className="col-md-6">
            <div className="card p-4 shadow-sm equal-height-card card-detail-information">
              <h4> Technical Details </h4>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="capacity_mw" className="form-label">Capacity (MW)</label>
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
                    <label htmlFor="water_flow_rate" className="form-label">Water Flow Rate</label>
                    <input
                      type="number"
                      id="water_flow_rate"
                      name="water_flow_rate"
                      className="form-control"
                      value={formData.water_flow_rate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <button className="btn btn-detail-update" onClick={handleUpdatePlant}>Update</button>
                </div>

                <div className="col-md-6 d-flex justify-content-center align-items-center">
                  <div className="technical-detail-card" />
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="row gx-3 gy-3">
          <div className="col-md-12">
            <div className="card card-detail-information p-4 shadow-sm" >
              <h4>Production Data</h4>

              <div className="row w-100">
                <div className="col-md-6">

                  <div className="row w-100 align-items-end">

                    <div className="col-md-3 mb-4">
                      <select
                        id="time-frame"
                        className="form-select"
                        value={selectedTimeFrame}
                        onChange={handleTimeFrameChange}
                      >
                        <option value="All Time">All Time</option>
                        <option value="20 Weeks">20 Weeks</option>
                        <option value="50 Weeks">50 Weeks</option>
                        <option value="70 Weeks">70 Weeks</option>
                        <option value="100 Weeks">100 Weeks</option>
                      </select>
                    </div>

                  </div>

                  <ResponsiveContainer width="105%" height={300}>
                    <AreaChart data={filteredData}>
                      <defs>
                        <linearGradient id="gradientOpacity" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#80DEEA" stopOpacity={1} />
                          <stop offset="100%" stopColor="#80DEEA" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>

                      <Area
                        type="monotone"
                        dataKey="production_mw"
                        stroke="#80DEEA"
                        fill="url(#gradientOpacity)"
                      />

                      <CartesianGrid
                        stroke="#ccc"
                        strokeOpacity={0.3}
                        vertical={false}
                      />

                      <XAxis
                        dataKey="production_date"
                        axisLine={false}
                        tick={false}
                      />

                      <YAxis
                        axisLine={false}
                        tick={true}
                      />
                      <Tooltip />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="col-md-6 d-flex justify-content-center align-self-center">
                  {lastYearRecorded && (
                    <ConcentricCircles year={lastYearRecorded} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDetail;
