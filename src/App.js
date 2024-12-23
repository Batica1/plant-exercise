import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Plants from './Plants/PlantsData';
import PlantDetail from './Plants/PlantDetail';
import CreatePlant from './Plants/CreatePlant';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './App.css';
import Navigation from './Navigation/Navigation';

function App() {
  return (
    <Router>
      <Navigation /> 
      <Routes>
        <Route path="/" element={<Plants />} /> 
        <Route path="/plant/:plantId" element={<PlantDetail />} />  
        <Route path="/create" element={<CreatePlant />} />
      </Routes>
    </Router>
  );
}

export default App;
