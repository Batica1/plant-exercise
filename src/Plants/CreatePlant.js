import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Card } from 'react-bootstrap';
import { createPlant } from '../API/api';

const CreatePlant = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [status, setStatus] = useState('');
  const [waterFlowRate, setWaterFlowRate] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPlant = {
      name: name.trim(),
      location: location.trim(),
      capacity_mw: parseFloat(capacity),
      status,
      water_flow_rate: parseFloat(waterFlowRate),
    };

    try {
      await createPlant(newPlant);
      navigate('/');
    } catch (error) {
      console.error('Error creating plant:', error);
      if (error.response) {
        console.error('Validation errors:', error.response.data);
      }
    }
  };

  return (
    <div className="container mt-5">
     
      <div className="create-plant-container">
        <Card className="shadow p-4 rounded border-0">
          <Card.Body>
         
            <h2 className="create-plant-title">Create New Power Plant</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="create-plant-form-label">Plant Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter plant name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="create-plant-form-control"
                />

              </Form.Group>

              <Form.Group className="mb-3">
   
                <Form.Label className="create-plant-form-label">Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="create-plant-form-control" 
                />

              </Form.Group>

              <Form.Group className="mb-3">
       
                <Form.Label className="create-plant-form-label">Capacity (MW)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter capacity"
                  value={capacity}
                  onChange={(e) => setCapacity(Math.max(0, e.target.value))}
                  required
                  className="create-plant-form-control" 
                />

              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="create-plant-form-label">Status</Form.Label>
                <Form.Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                  className="create-plant-form-select" 
                >

                  <option value="">Select Status</option>
                  <option value="Operational">Operational</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                  <option value="Decommissioned">Decommissioned</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="create-plant-form-label">Water Flow Rate</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter water flow rate"
                  value={waterFlowRate}
                  onChange={(e) => setWaterFlowRate(Math.max(0, e.target.value))}
                  required
                  className="create-plant-form-control" 
                />
              </Form.Group>

              <div className="text-center">
                <Button variant="primary" type="submit" className="create-plant-btn px-4">
                  Create Plant
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default CreatePlant;
