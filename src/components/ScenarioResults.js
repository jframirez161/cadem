//ScenarioResults.js

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import Plot from 'react-plotly.js';

const getResultsFromIndexedDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('OdeResultsDB', 2);

        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            // Check if the object store already exists, if not, create it
            if (!db.objectStoreNames.contains('results')) {
                db.createObjectStore('results', { keyPath: 'id' });
            }
        };

        request.onerror = function(event) {
            console.error("IndexedDB error:", event.target.errorCode);
            reject(event.target.errorCode);
        };

        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(['results'], 'readonly');
            const store = transaction.objectStore('results');
            const getAllRequest = store.getAll(); // Fetch all stored items

            getAllRequest.onsuccess = function(event) {
                if (event.target.result.length > 0) {
                    resolve(event.target.result);
                } else {
                    resolve(null);
                }
            };

            getAllRequest.onerror = function(event) {
                console.error("Error fetching data from IndexedDB:", event.target.errorCode);
                reject(event.target.errorCode);
            };
        };
    });
};


const ScenarioRst = () => {
    const [results, setResults] = useState(null);

    useEffect(() => {
        getResultsFromIndexedDB()
            .then((data) => {
                if (data) {
                    setResults(data);
                } else {
                    console.log("No results found in IndexedDB");
                }
            })
            .catch((error) => {
                console.error("Failed to retrieve results:", error);
            });
    }, []);

    const createBarPlot = (data, yKey, title) => {
        const trace = {
            x: data.map(result => result.data.dietName),
            y: data.map(result => result.data[yKey]),
            type: 'bar',
        };

        return (
            <Plot
                data={[trace]}
                layout={{
                    title: title,
                    yaxis: { title: yKey },
                    xaxis: { title: 'Diet' },
                    margin: { t: 40, b: 40, l: 40, r: 40 }
                }}
                style={{ width: '100%', height: '400px' }}
            />
        );
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Scenario Results
            </Typography>
            {results ? (
                <>
                    <Box mb={4}>
                        {createBarPlot(results, 'lastIntake', 'Last Intake Comparison')}
                    </Box>
                    <Box mb={4}>
                        {createBarPlot(results, 'lastCH4', 'Last CH4 Comparison')}
                    </Box>
                    <Box mb={4}>
                        {createBarPlot(results, 'lastCO2', 'Last CO2 Comparison')}
                    </Box>
                </>
            ) : (
                <Typography>Loading results...</Typography>
            )}
        </Container>
    );
};

export default ScenarioRst;

