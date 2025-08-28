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
import DataAndCloud from './pages/DigitalWayFinderr/DataAndCloud';
import Operational from './pages/DigitalWayFinderr/Operational';
import VisibilityProactive from './pages/DigitalWayFinderr/VisibilityProactive';
import AgenticAI from './pages/DigitalWayFinderr/AgenticAI';
import IndustryDataandCloud from './pages/DigitalWayFinderr/IndustryDataandCloud';
import TmsDataAndCloud from './pages/DigitalWayFinderr/TmsDataAndCloud';
import TmsOperational from './pages/DigitalWayFinderr/TmsOperational';
import TmsVisibilityProactive from './pages/DigitalWayFinderr/TmsVisibilityProactive';
import TmsAgenticAI from './pages/DigitalWayFinderr/TmsAgenticAI';
import TmsSystem from './pages/DigitalWayFinderr/TmsSystem';




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
import AgnosticFunctionalScope from './pages/DecisionTree/AgnosticFunctionalScope';
import AgnosticNonFunctionalScope from './pages/DecisionTree/AgnosticNonFunctionalScope';
import AgnosticDecisionCriteria from './pages/DecisionTree/AgnosticDecisionCriteria';
import AgnosticSolution from './pages/DecisionTree/AgnosticSolution';
import AgnosticDashboard from './pages/DecisionTree/AgnosticDashboard';
import RetailFunctionalScope from './pages/DecisionTree/RetailFunctionalScope';
import RetailNonFunctionalScope from './pages/DecisionTree/RetailNonFunctionalScope';
import RetailDecisionCriteria from './pages/DecisionTree/RetailDecisionCriteria';
import RetailSolution from './pages/DecisionTree/RetailSolution';
import RetailDashboard from './pages/DecisionTree/RetailDashboard';
import CustomerFunctionalScope from './pages/DecisionTree/CustomerFunctionalScope';
import CustomerNonFunctionalScope from './pages/DecisionTree/CustomerNonFunctionalScope';
import CustomerDecisionCriteria from './pages/DecisionTree/CustomerDecisionCriteria';
import CustomerSolution from './pages/DecisionTree/CustomerSolution';
import CustomerDashboard from './pages/DecisionTree/CustomerDashboard';
 
 
 
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
          <Route path="/digital-wayfinder/data-and-cloud" element={<DataAndCloud />} />
          <Route path="/digital-wayfinder/operational" element={<Operational />} />
          <Route path="/digital-wayfinder/visibility-proactive" element={<VisibilityProactive />} />
          <Route path="/digital-wayfinder/agentic-ai" element={<AgenticAI />} />
          {/* <Route path="/digital-wayfinder/agentic-ai" element={<IndustryDataandCloud />} /> */}
          <Route path="/digital-wayfinder/tms-data-and-cloud" element={<TmsDataAndCloud />} />
          <Route path="/digital-wayfinder/tms-operational" element={<TmsOperational />} />
          <Route path="/digital-wayfinder/tms-visibility-proactive" element={<TmsVisibilityProactive />} />
          <Route path="/digital-wayfinder/tms-agentic-ai" element={<TmsAgenticAI />} />
          <Route path="/digital-wayfinder/tms-system" element={<TmsSystem />} />


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
          <Route path="/decision-tree/agnostic-functional-scope" element={<AgnosticFunctionalScope />} />
          <Route path="/decision-tree/agnostic-non-functional-scope" element={<AgnosticNonFunctionalScope />} />
          <Route path="/decision-tree/agnostic-decision-criteria" element={<AgnosticDecisionCriteria/>} />
          <Route path="/decision-tree/agnostic-solution" element={<AgnosticSolution />} />
          <Route path="/decision-tree/agnostic-dashboard" element={<AgnosticDashboard/>} />
          <Route path="/decision-tree/retail-functional-scope" element={<RetailFunctionalScope />} />
          <Route path="/decision-tree/retail-non-functional-scope" element={<RetailNonFunctionalScope />} />
          <Route path="/decision-tree/retail-decision-criteria" element={<RetailDecisionCriteria/>} />
          <Route path="/decision-tree/retail-solution" element={<RetailSolution />} />
          <Route path="/decision-tree/retail-dashboard" element={<RetailDashboard/>} />
          <Route path="/decision-tree/customer-functional-scope" element={<CustomerFunctionalScope />} />
          <Route path="/decision-tree/customer-non-functional-scope" element={<CustomerNonFunctionalScope />} />
          <Route path="/decision-tree/customer-decision-criteria" element={<CustomerDecisionCriteria/>} />
          <Route path="/decision-tree/customer-solution" element={<CustomerSolution />} />
          <Route path="/decision-tree/customer-dashboard" element={<CustomerDashboard/>} />
          
          
 
          {/* <Route path="/digital-wayfinder/final" element={<FinalPage />} /> */}
        </Routes>
      </div>
    </Router>
  );
}
 
export default App;