import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import WayFinderProjectInfo from './pages/DigitalWayFinderr/WayFinderProjectInfo';
import FunctionalAreaPage from './pages/DigitalWayFinderr/FunctionalAreaPage';
import ReportPage from './pages/ReportPage';
import IndustryTypeFullfillment from './pages/DigitalWayFinderr/IndustryTypeFullfillment';
import IndustryTypePlanning from './pages/DigitalWayFinderr/IndustryTypePlanning';
import IndustryTypePlanParts from './pages/DigitalWayFinderr/IndustryTypePlanParts';
import WmsSystem from './pages/DigitalWayFinderr/WmsSystem';

//Decision Tree imports
import ProjectInfo from './pages/DecisionTree/ProjectInfo';
import FuncAreaPage from './pages/DecisionTree/FuncAreaPage';
import IndustryTypeFunc from './pages/DecisionTree/IndustryTypeFunc';
import IndustryTypePlannD from './pages/DecisionTree/IndustryTypePlannD';
import FunctionalScope from './pages/DecisionTree/FunctionalScope';
import NonFunctionalScope from './pages/DecisionTree/NonFunctionalScope';
import Solution from './pages/DecisionTree/Solution';
import Dashboard from './pages/DecisionTree/Dashboard';
import DecisionCriteria from './pages/DecisionTree/DecisionCriteria';
import TransportationFunctionalScope from './pages/DecisionTree/TransportationFunctionalScope';


// import FinalPage from './pages/DigitalWayFinderr/FinalPage';

import './App.css';


function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/report" element={<ReportPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/digital-wayfinder" element={<WayFinderProjectInfo />} />
          <Route path="/digital-wayfinder/project-info" element={<WayFinderProjectInfo />} />
          <Route path="/digital-wayfinder/functional-area" element={<FunctionalAreaPage />} />
          <Route path="/digital-wayfinder/industry-type-fullfillment" element={<IndustryTypeFullfillment />} />
          <Route path="/digital-wayfinder/industry-type-planning" element={<IndustryTypePlanning />} />
          <Route path="/digital-wayfinder/industry-type-plan-parts" element={<IndustryTypePlanParts />} />
          <Route path="/digital-wayfinder/wms-system" element={<WmsSystem />} />


          <Route path="/decision-tree" element={<ProjectInfo />} />
          <Route path="/decision-tree/functional-area" element={<FuncAreaPage />} />
          <Route path="/decision-tree/industry-type-func" element={<IndustryTypeFunc />} />
          <Route path="/decision-tree/industry-type-plannd" element={<IndustryTypePlannD />} />
          <Route path="/decision-tree/functional-scope" element={<FunctionalScope />} />
          <Route path="/decision-tree/non-functional-scope" element={<NonFunctionalScope />} />
          <Route path="/decision-tree/solution" element={<Solution />} />
          <Route path="/decision-tree/dashboard" element={<Dashboard/>} />
          <Route path="/decision-tree/decision-criteria" element={<DecisionCriteria/>} />
          <Route path="/decision-tree/transportation-functional-scope" element={<TransportationFunctionalScope />} />

          {/* <Route path="/digital-wayfinder/final" element={<FinalPage />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
