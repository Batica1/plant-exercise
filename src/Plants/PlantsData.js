import React, { useEffect, useState } from 'react';
import { getPowerPlants, deletePowerPlant, navigateToPlantDetails } from '../API/api';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Plants = () => {
  const [plants, setPlants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPowerPlants();
        setPlants(data);
      } catch (error) {
        console.error('Failed to fetch plants:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredPlants = plants.filter((plant) =>
    plant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (plantId) => {
    try {
      await deletePowerPlant(plantId);
      setPlants((prevPlants) => prevPlants.filter((plant) => plant.id !== plantId));
    } catch (error) {
      console.error('Failed to delete plant:', error);
    }
  };

  const handleScrollToPlants = () => {
    const element = document.getElementById('explore-hydropower-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="dark-bg">
      {/* Hydropower UI Section */}
      <div className="container-fluid py-5">
        <div className="container">
          <div className="row align-items-center">
            
            <div className="col-md-6">
              <h1 className="fw-bold mb-3 white-text">Hydropower Plants</h1>
              <p className="mb-4 white-text lead">
              A leading provider of electromechanical equipment and services for hydropower stations, supporting the growth of clean, renewable energy worldwide.
              </p>
              <button className="btn-home-dark-blue" onClick={handleScrollToPlants}>
                See more
              </button>
            </div>

            
            <div className="col-md-6 ">
              <div className="image-home">
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-bg-color">
        <div className="container">
          <div className="row">
            <div className="col text-center py-5">
            <h1 className="display-4">Hydropower potential worldwide </h1>
              <p className="lead red">Approximately 16% of the world's electrical energy comes from hydropower. It offers a wide spectrum of applications, including energy storage for grid stability and peak load coverage.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Plants List */}
      <div className="container mt-5">
        {/* Search Bar */}
        <Form className="d-flex justify-content-center mb-5 pb-3">
          <div className="search-bar-container">
            <Form.Control
              type="text"
              placeholder="Search plants..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-bar"
            />
          </div>
        </Form>

        {/* Plants List */}
        <div id="explore-hydropower-section" className="row g-4 justify-content-center">
          {filteredPlants.map((plant) => (
            <div className="col-12 col-md-6 col-lg-4" key={plant.id}>
              <div className="card l-bg-blue-dark">
                <div className="card-statistic-3 p-4">
                  <div className="card-icon card-icon-large">
                    <i className="fa-solid fa-arrow-up-from-ground-water"></i> {/* Your icon */}
                  </div>
                  <div className="mb-4">
                    <h5 className="fw-bold">{plant.name}</h5>
                  </div>
                  <div className="row align-items-center mb-2 d-flex">
                    <div className="col-8">
                      <h6 className="d-flex align-items-center mb-0">Status: {plant.status} </h6>
                    </div>

                    <div className="col-4 d-flex justify-content-end">
                      <span>{plant.water_flow_rate}% <i className="fa fa-arrow-up"></i></span>
                    </div>

                  </div>
                  <div className="progress mt-1" data-height="8" style={{ height: '8px' }}>
                    <div className="progress-bar l-bg-green" role="progressbar" style={{ width: `${(plant.water_flow_rate / 10) * 100}%` }}></div>
                  </div>

                  {/* Buttons Section */}
                  <div className="d-flex justify-content-center gap-3 mt-4">
                    <Button 
                      variant="outline-primary" 
                      className="custom-btn custom-btn-see-more custom-btn-lg px-4" 
                      onClick={() => navigateToPlantDetails(navigate, plant.id)}
                    >
                      See More
                    </Button>
                    
                    <Button 
                      variant="outline-danger" 
                      className="custom-btn custom-btn-delete custom-btn-lg px-4" 
                      onClick={() => handleDelete(plant.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Plants Found Message */}
        {filteredPlants.length === 0 && (
          <p className="text-center mt-4">No plants found...</p>
        )}
      </div>
    </div>
  );
};

export default Plants;
