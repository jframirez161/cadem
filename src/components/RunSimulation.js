import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { useDiets } from './DietContext'; 
import { useScenarios } from './ScenarioContext';
import Plot from './Plot';

const RunSimulation = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState([]);
    
    const { diets } = useDiets(); 
    const { scenarios } = useScenarios();

    const [dietsList, setDietsList] = useState([]);
    const [scenariosList, setScenariosList] = useState([]);

    // Update dietsList when 'diets' changes
    useEffect(() => {
        setDietsList(diets);
    }, [diets]);

    // Update scenariosList when 'scenarios' changes
    useEffect(() => {
        setScenariosList(scenarios);
        console.log('Scenarios:', scenarios);
    }, [scenarios]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Identify unique diets and collect them into a Map
            const uniqueDietsMap = new Map();

            scenariosList.forEach(scenario => {
                scenario.data.forEach(scenarioElem => {
                    const diet = dietsList.find(diet => diet.name === scenarioElem.dietName);
                    if (diet && !uniqueDietsMap.has(scenarioElem.dietName)) {
                        uniqueDietsMap.set(scenarioElem.dietName, diet);
                    }
                });
            });

            console.log('Unique diets count:', uniqueDietsMap.size);

            const results = [];
            const requests = Array.from(uniqueDietsMap.values()).map(async diet => {
                // Calculate the total composition for the unique diet
                const totalComposition = diet.composition.reduce((acc, dietElem) => {
                    const weight = dietElem.percentage / 100;
                    acc['DM (%AF)'] = (acc['DM (%AF)'] || 0) + parseFloat(dietElem['DM (%AF)']) * weight;
                    acc['DE (Mcal/kg)'] = (acc['DE (Mcal/kg)'] || 0) + parseFloat(dietElem['DE (Mcal/kg)']) * weight;
                    acc['TDN (%DM)'] = (acc['TDN (%DM)'] || 0) + parseFloat(dietElem['TDN (%DM)']) * weight;
                    acc['NDF (%DM)'] = (acc['NDF (%DM)'] || 0) + parseFloat(dietElem['NDF (%DM)']) * weight;
                    acc['CP (%DM)'] = (acc['CP (%DM)'] || 0) + parseFloat(dietElem['CP (%DM)']) * weight;
                    acc['Fat (%DM)'] = (acc['Fat (%DM)'] || 0) + parseFloat(dietElem['Fat (%DM)']) * weight;
                    return acc;
                }, {});

                // Print the final composition of this diet
                console.log(`Final Composition for Diet Name ${diet.name}:`, totalComposition);

                const dummyData = [{
                    FrFu: "0.070",
                    FrFd: String(totalComposition['NDF (%DM)'] / 100 * 0.5),
                    FrSi: "0.159",
                    FrWs: "0.125",
                    FrLa: "0.021",
                    FrTg: "0.033",
                    FrFaU: "0.014",
                    FrFaS: "0.004",
                    FrAm: "0.001",
                    FrPs: "0.066",
                    FrPi: "0.128",
                    FrAc: "0.011",
                    FrBu: "0.002",
                    FrPr: "0.002",
                    FrNOP: "0.000",
                    FrBr: "0.000",
                    FrAsh: "0.079",
                    FrDM: "0.465",
                    FrForage: "0.700",
                    FrNDF: String(totalComposition['NDF (%DM)'] / 100),
                    FrBicarb: "0.0006",
                    FrP: "0.0041",
                    FrDp: "0.85"
                }];


                //const response = await axios.post('http://127.0.0.1:5000/', dummyData);
                
                const response = await axios.post('https://backend-methane-model-8a3a8e5f802a.herokuapp.com/data', dummyData, {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });


                results.push({ data: response.data, name: diet.name }); 
            });

            // Wait for all requests to complete
            await Promise.all(requests);
            setResult(results);
        } catch (error) {
            alert('Failed to run simulation: ' + error.message);
        }
        setLoading(false);
    };

    return (
        <Card sx={{ maxWidth: '1200px', margin: '0 auto' }}> {/* Adjust the max width to your desired value */}
            <CardContent>
                <Box 
                    sx={{ 
                        backgroundColor: '#f0f0f0', 
                        padding: '8px 16px', 
                        borderRadius: '4px', 
                        display: 'inline-block', 
                        border: '1px solid #d0d0d0', 
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        marginBottom: '16px',
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        Simulate Scenarios
                    </Typography>
                </Box>

                <Typography variant="body1" gutterBottom>
                    To calculate the methane emissions from each diet and the total emissions for each scenario, press the 'RUN' button. To create or modify diets, switch to the 'DIET BUILDER' tab. To create or modify scenarios, switch to the 'SCENARIO BUILDER' tab. Each tab allows you to customize different aspects of your simulation.
                </Typography>

                {result.length > 0 && (
                    <Box sx={{ marginTop: '16px' }}>
                        <Plot results={result} scenarios={scenarios} />
                    </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Running...' : <span role="img" aria-label="play">▶️ Run</span>}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default RunSimulation;
