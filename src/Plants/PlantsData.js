import React, { useEffect, useState } from 'react';
import { getPowerPlants, deletePowerPlant, navigateToPlantDetails } from '../API/api';
import { Card, Row, Col, Form } from 'react-bootstrap';
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

  return (
    <div className="container">
      <h1 className="text-center my-4">Plants</h1>
      
      <Form className="search-bar-container">
        <Form.Control
          type="text"
          placeholder="Search plants..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-bar"
        />
      </Form>

      <Row className="g-4 justify-content-center">
        {filteredPlants.map((plant) => (
          <Col key={plant.id} sm={12} md={6} lg={4} className="d-flex justify-content-center">
            <Card className="card-width-height card-hover shadow-lg rounded-3 overflow-hidden card-plant">
              <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center">
                
                <h2 className="card-title text-dark fw-bold mb-3 fs-4">
                  {plant.name}
                </h2>

                <Card.Text className="text-muted mb-3" style={{ fontSize: '1.1rem' }}>
                  <strong>Status:</strong> {plant.status}
                </Card.Text>

                <div className="d-flex justify-content-center">
                  <button
                    type="button"
                    className="btn btn-primary rounded-pill px-4 py-2 me-2"
                    onClick={() => navigateToPlantDetails(navigate, plant.id)}
                  >
                    See More
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(plant.id)}
                    className="btn btn-danger rounded-pill px-4 py-2"
                  >
                    Delete
                  </button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {filteredPlants.length === 0 && (
        <p className="text-center mt-4">No plants found...</p>
      )}
    </div>
  );
};

export default Plants;
