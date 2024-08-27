import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Box, Tabs, Tab } from '@mui/material';
import Header from './components/Header';
import SignIn from './components/SignIn';
import Register from './components/Register';
import Continue from './components/Continue';
import DietBuilder from './components/DietBuilder';
import ScenarioBuilder from './components/ScenarioBuilder';
import Footer from './components/Footer';

import { DietProvider } from './components/DietContext';
import { ScenarioProvider } from './components/ScenarioContext';
import { OdeProvider } from './components/ODEContext'; // OdeContext at a higher level

import OdeSolver from './components/OdeSolver';
import ScenarioRst from './components/ScenarioResults';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

const App = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  return (    
      <DietProvider>
        <ScenarioProvider>
         <OdeProvider> {/* Provider should wrap all components inside Router */}
          <Router>
            <Header />
            <Box sx={{ flexGrow: 1, padding: 3 }}>
              <Routes>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/register" element={<Register />} />
                <Route path="/continue" element={<Continue />} />
                <Route path="/" element={
                  <Box>
                    <Tabs value={tabIndex} onChange={handleTabChange} aria-label="simple tabs example">
                      <Tab label="Diet Builder" {...a11yProps(0)} />
                      <Tab label="Scenario Builder" {...a11yProps(1)} />
                      <Tab label="Run Simulation" {...a11yProps(2)} />
                      <Tab label="Scenario Results" {...a11yProps(3)} />
                    </Tabs>
                    <TabPanel value={tabIndex} index={0}>
                      <DietBuilder />
                    </TabPanel>
                    <TabPanel value={tabIndex} index={1}>
                      <ScenarioBuilder />
                    </TabPanel>
                    <TabPanel value={tabIndex} index={2}>
                      <OdeSolver />
                    </TabPanel>
                    <TabPanel value={tabIndex} index={3}>
                      <ScenarioRst />
                    </TabPanel>
                  </Box>
                } />
              </Routes>
            </Box>
            <Footer />
          </Router>
         </OdeProvider>
        </ScenarioProvider>
      </DietProvider>  
  );
};

export default App;
