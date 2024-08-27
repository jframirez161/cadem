// ode_Context.js
import React, { createContext, useState, useEffect } from 'react';

export const OdeContext = createContext();

export const OdeProvider = ({ children }) => {
  const [results, setResults] = useState(() => {
    // Get initial state from localStorage, if it exists
    const savedResults = localStorage.getItem('odeResults');
    return savedResults ? JSON.parse(savedResults) : [];
  });

  useEffect(() => {
    // Save results to localStorage whenever they change
    localStorage.setItem('odeResults', JSON.stringify(results));
  }, [results]);

  return (
    <OdeContext.Provider value={{ results, setResults }}>
      {children}
    </OdeContext.Provider>
  );
};
