// src/components/ScenarioContext.js
import React, { createContext, useState, useContext} from 'react';

const ScenarioContext = createContext();

export const ScenarioProvider = ({ children }) => {
    const [scenarios, setScenarios] = useState([]);

    return (
        <ScenarioContext.Provider value={{ scenarios, setScenarios }}>
            {children}
        </ScenarioContext.Provider>
    );
};

export const useScenarios = () => useContext(ScenarioContext);
