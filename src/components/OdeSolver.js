//OdeSolver.js

import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Button from '@mui/material/Button'; 
import { Box } from '@mui/material'; 
import * as XLSX from 'xlsx';  
import { odeSystem } from './odeFunctions'; 
import { useDiets } from './DietContext'; 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RK4 = (t0, t1, initialConditions, odeSystem, dt, params) => {
    const times = [t0];
    const solutions = [initialConditions];
    let currentTime = t0;
    let currentState = initialConditions;

    while (currentTime < t1) {
        const k1 = odeSystem(currentTime, currentState, ...params);
        const k2 = odeSystem(
            currentTime + dt / 2,
            currentState.map((value, index) => value + dt / 2 * k1[index]),
            ...params
        );
        const k3 = odeSystem(
            currentTime + dt / 2,
            currentState.map((value, index) => value + dt / 2 * k2[index]),
            ...params
        );
        const k4 = odeSystem(
            currentTime + dt,
            currentState.map((value, index) => value + dt * k3[index]),
            ...params
        );

        currentState = currentState.map(
            (value, index) => value + (dt / 6) * (k1[index] + 2 * k2[index] + 2 * k3[index] + k4[index])
        );
        currentTime += dt;

        times.push(currentTime);
        solutions.push(currentState);
    }

    return { times, solutions };
};



const saveResultsToIndexedDB = (results) => {
    const request = indexedDB.open('OdeResultsDB', 1);

    request.onupgradeneeded = function(event) {
        const db = event.target.result;
        // Create the object store if it doesn't exist
        if (!db.objectStoreNames.contains('results')) {
            db.createObjectStore('results', { keyPath: 'id' });
        }
    };

    request.onerror = function(event) {
        console.error("IndexedDB error:", event.target.errorCode);
    };

    request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(['results'], 'readwrite');
        const store = transaction.objectStore('results');

        // Clear the store before saving new results
        store.clear().onsuccess = function() {
            results.forEach((result, index) => {
                const lastSolution = result.result.solutions[result.result.solutions.length - 1];
                const savedData = {
                    dietName: result.dietName,
                    lastIntake: lastSolution[0],
                    lastCH4: lastSolution[1],
                    lastCO2: lastSolution[2]
                };

                store.add({ id: `dietResult_${index}`, data: savedData });
            });
        };

        transaction.oncomplete = function() {
            console.log("Results saved to IndexedDB");
        };
    };
};





function OdeSolver() {   
    const { diets } = useDiets(); 
    const [dietsList, setDietsList] = useState([]);
    const [results, setResults] = useState([]); 
    
    useEffect(() => {
        setDietsList(diets);        
    }, [diets]);


    const stateVariableNames = [
        'intake', 'H2O', 'Pi', 'Am', 'Ba', 'Bf', 'Fn', 'PoFl', 'SpFl', 'Tg',
        'Fu', 'Fd', 'Si', 'Sf', 'La', 'Sa', 'Sfn', 'Lactate', 'Ac', 'Acetate',
        'Bu', 'Butyrate', 'Pr', 'Propionate', 'Br', 'NOP', 'NO3', 'NO2', 'N2O',
        'NADH', 'H2', 'Me', 'CH4', 'CO2', 'Bicarb', 'Hplus', 'maxHplus',
        'InsolFSG', 'OMHind', 'OMFecal', 'CH4_hind', 'fecalH2O', 'fecalN',
        'fecalC', 'Dp', 'Ip', 'RMp', 'Gp', 'Np', 'LBa', 'LBf', 'Lp', 'LMp',
        'Tp', 'Ep', 'Fp', 'Up', 'Po', 'Sp', 'Ps', 'Ws', 'FaU', 'FaS'
    ];
    
    const [selectedVars1, setSelectedVars1] = useState([
        stateVariableNames.indexOf('intake'), 
        stateVariableNames.indexOf('Fu'),    
        stateVariableNames.indexOf('Me')     
    ]);

    const [selectedVars2, setSelectedVars2] = useState([
        stateVariableNames.indexOf('Br'), 
        stateVariableNames.indexOf('La'),   
        stateVariableNames.indexOf('CH4')   
    ]);
    
    const [selectedVars3, setSelectedVars3] = useState([
        stateVariableNames.indexOf('NADH'), 
        stateVariableNames.indexOf('Dp'),   
        stateVariableNames.indexOf('OMHind')
    ]);

    const plot1Variables = ['intake', 'H2O'];
    const plot2Variables = ['Fu', 'Fd', 'Si', 'Ws', 'Pi', 'Ps', 'Am', 'Tg', 'FaU', 'FaS']; 
    const plot3Variables = ['Me','Ba','Bf','Fn','Po','PoFl','SpFl','Sa','Sf','Sfn', 'Sp','LBa', 'LBf']; 
    const plot4Variables = ['Br', 'NOP', 'NO3', 'NO2', 'N2O']; 
    const plot5Variables = ['La', 'Lactate', 'Ac', 'Acetate', 'Pr', 'Propionate', 'Bu', 'Butyrate']; 
    const plot6Variables = ['CH4', 'CH4_hind', 'fecalH2O', 'H2', 'CO2']; 
    const plot7Variables = ['NADH', 'Bicarb', 'Hplus', 'InsolFSG']; 
    const plot8Variables = ['Dp', 'Ip', 'RMp', 'Gp',  'Np',  'Lp',  'LMp', 'Tp', 'Ep']; 
    const plot9Variables = ['OMHind', 'OMFecal', 'fecalN', 'fecalC', 'Fp', 'Up']; 
    
    const plotsNames1 = [
        'Fluids and Solutes', 'Feed Components', 'Microorganisms'
    ];
    
    const plotsNames2 = [
        'Additives', 'Organic Acids', 'Gases'
    ];
    
    const plotsNames3 = [
        'Other Chemicals', 'Phosphorus', 'Fecal, and Urine Outputs'
    ];

    const variableDescriptions = {
        intake: 'cumulated intake (grams)',
        H2O: 'H2O/water with dissolved solutes (L)',
        Fu: 'undegradable fiber (mol)',
        Fd: 'degradable fiber (mol)',
        Si: 'insoluble [degradable] starch (mol)',
        Ws: 'water soluble carbohydrates [including glycerol] (mol)',
        Pi: 'insoluble (degradable) protein (mol)',
        Ps: 'soluble protein (mol)',
        Am: 'ammonia (mol)',
        Tg: 'triacylglycerides (mol)',
        FaU: 'unsaturated long chain fatty acid (mol)',
        FaS: 'saturated long chain fatty acid (mol)',
        Me: 'methanogens (grams)',
        Ba: 'amylolytic bacteria (grams)',
        Bf: 'fibrolytic bacteria (grams)',
        Fn: 'anaerobic fungi (grams)',
        Po: 'protozoa (grams)',        
        PoFl: 'fluid-associated protozoa (grams)',
        SpFl: 'fluid-associated protozoal storage polysaccharide (grams)',
        Sa: 'amylolytic bacterial storage polysaccharide (grams)',
        Sf: 'fibrolytic bacterial storage polysaccharide (grams)',
        Sfn: 'anaerobic fungi storage polysaccharide (grams)',
        Sp: 'protozoal storage polysaccharide (grams)',
        LBa: 'Large intestine amylolytic bacteria (grams)',
        LBf: 'Large intestine fibrolytic bacteria (grams)',
        Br: 'bromoform (mol)',
        NOP: '3NOP (mol)',
        NO3: 'nitrate (mol)',
        NO2: 'nitrite (mol)',
        N2O: 'nitrous oxide (mol)',
        La: 'lactic acid (mol)',
        Lactate: 'Lactate [disassociated lactic acid] (mol)',
        Ac: 'acetic acid (mol)',
        Acetate: 'Acetate [disassociated acetic acid] (mol)',
        Pr: 'propionic acid (mol)',
        Propionate: 'Propionate [disassociated propionic acid] (mol)',
        Bu: 'butyric acid (mol)',
        Butyrate: 'Butyrate [disassociated butyric acid](mol)',
        CH4: 'methane (mol)',
        CH4_hind: 'CH4 produced from organic matter in hindgut (mol)',
        fecalH2O: 'fecal water (L)',
        H2: 'metabolic hydrogen gas',        
        CO2: 'carbon dioxide',
        NADH: 'reduced NAD+ (mol)',
        Bicarb: 'bicarbonate (mol)',
        Hplus: 'hydrogen ion (mol)',
        InsolFSG: 'ratio of density of particle to density of water',
        Dp: 'Rumen digestible phosphorus (grams)',
        Ip: 'Rumen indigestible phosphorus (grams)',
        RMp: 'Rumen microbial phosphorus (grams)',
        Gp: 'Small intestinal digestible phosphorus (grams)',
        Np: 'Small intestinal indigestible phosphorus (grams)',       
        Lp: 'Large intestinal digestible phosphorus (grams)',
        LMp: 'Large intestinal microbial phosphorus (grams)',
        Tp: 'Large intestinal indigestible phosphorus (grams)',
        Ep: 'extracellular phosphorus(grams)',
        OMHind: 'organic matter in hindgut (grams)',
        OMFecal: 'organic matter in feces (grams)',       
        fecalN: 'manure Nitrogen (mol)',
        fecalC: 'manure carbon (mol)',
        Fp: 'fecal phosphorus (grams)',
        Up: 'urine phosphorus (grams)'
    };

    const solveODEForDiets = () => {
        const dietResults = dietsList.map(diet => {
            let initialConditions = [0.3398711440407751,
 60.924,
 2.727272727272727,
 1.1743291644647995,
 359.01111460198115,
 359.01111460198115,
 136.7661388959928,
 1e-10,
 1e-10,
 0.06822833750284285,
 3.3950617283950617,
 5.319300884673414,
 1.2672019810910926,
 1e-10,
 0.001,
 1e-10,
 1e-10,
 0.062,
 0.001,
 0.062,
 0.001,
 0.062,
 0.001,
 0.062,
 0.0,
 0.0,
 1e-05,
 1e-05,
 0.0,
 0.003242104167802708,
 0.000419527803775296,
 22.5374672018789,
 0.0,
 0.0,
 0.087,
 1.9265860416809835e-05,
 1.9265860416809835e-05,
 1.5197945035520457,
 0.0,
 0.0,
 0.0,
 24.369600000000002,
 0.0,
 0.0,
 2.2902315,
 0.40415850000000003,
 26.536050099295004,
 0.0,
 0.0,
 3.5901111460198114e-06,
 3.5901111460198114e-06,
 1.1092617199458833e-08,
 1.2852597902750925e-07,
 1.9575206822574415e-09,
 4.0,
 0.0,
 0.0,
 854.788368099955,
 1e-10,
 13.636363636363637,
 0.0422116597467475,
 1e-10,
 1e-10];

            const totalComposition = diet.composition.reduce((acc, dietElem) => {
                const weight = dietElem.percentage / 100;
                acc['DM (%AF)'] = (acc['DM (%AF)'] || 0) + parseFloat(dietElem['DM (%AF)']) * weight;
                acc['DE (Mcal/kg)'] = (acc['DE (Mcal/kg)'] || 0) + parseFloat(dietElem['DE (Mcal/kg)']) * weight;
                acc['TDN (%DM)'] = (acc['TDN (%DM)'] || 0) + parseFloat(dietElem['TDN (%DM)']) * weight;
                acc['NDF (%DM)'] = (acc['NDF (%DM)'] || 0) + parseFloat(dietElem['NDF (%DM)']) * weight;
                acc['CP (%DM)'] = (acc['CP (%DM)'] || 0) + parseFloat(dietElem['CP (%DM)']) * weight;
                acc['Fat (%DM)'] = (acc['Fat (%DM)']) * weight;
                return acc;
            }, {});

            let Fr_data = [{
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
            
            const t0 = 0;
            const t1 = 24;
            const dt = 0.001;

            return {
                dietName: diet.name,
                result: RK4(t0, t1, initialConditions, odeSystem, dt, Fr_data)
            };
        });

        setResults(dietResults);
        console.log(dietResults)
        saveResultsToIndexedDB(dietResults);
    };

    const downloadResultsAsExcel = () => {
        const worksheetData = results.map(({ dietName, result }) => {
            const { times, solutions } = result;

            const rows = times.map((time, index) => {
                const row = { Time: time };
                solutions[index].forEach((value, i) => {
                    row[stateVariableNames[i]] = value;
                });
                return row;
            });

            return {
                name: dietName,
                rows
            };
        });

        const workbook = XLSX.utils.book_new();

        worksheetData.forEach(({ name, rows }) => {
            const worksheet = XLSX.utils.json_to_sheet(rows);
            XLSX.utils.book_append_sheet(workbook, worksheet, name);
        });

        XLSX.writeFile(workbook, 'simulation_results.xlsx');
    };

const getPlotData = (varIndex) => {
    // If results is undefined or empty, return an empty dataset
    if (!results || results.length === 0) {
        return { labels: [], datasets: [] };
    }

    const datasets = results.map(({ dietName, result }) => {
        const { times, solutions } = result;
        return {
            label: dietName,
            data: solutions.map(sol => sol[varIndex]),
            fill: false,
            borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
            borderWidth: 3,
            tension: 0.1,
            pointRadius: 0, // Hide the points (dots)
            pointHoverRadius: 0, // Also hide points on hover
        };
    });

    return {
        labels: results[0].result.times.map(t => Math.round(t)),
        datasets: datasets
    };
};


    const getPlotOptions = (varIndex) => ({
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time (Hours)', 
                },
            },
            y: {
                title: {
                    display: true,
                    text: stateVariableNames[varIndex], 
                },
            },
        },
    });

    const handleSelectionChange1 = (index, event) => {
        const newSelectedVars1 = [...selectedVars1];
        newSelectedVars1[index] = event.target.value;
        setSelectedVars1(newSelectedVars1);
    };

    const handleSelectionChange2 = (index, event) => {
        const newSelectedVars2 = [...selectedVars2];
        newSelectedVars2[index] = event.target.value;
        setSelectedVars2(newSelectedVars2);
    };
    
    const handleSelectionChange3 = (index, event) => {
        const newSelectedVars3 = [...selectedVars3];
        newSelectedVars3[index] = event.target.value;
        setSelectedVars3(newSelectedVars3);
    };

    const labelStyle = {
        fontWeight: 'bold',       
        color: '#007BFF',         
        backgroundColor: '#E8F0FE', 
        padding: '5px 10px',     
        borderRadius: '5px',     
        display: 'inline-block', 
        marginBottom: '10px'     
    };

    return (
    <div>
        <Box textAlign="center">
            <Button variant="contained" color="primary" onClick={solveODEForDiets}>
                Solve ODE for All Diets
            </Button>
        </Box>

        {/* Only render plots if results are available */}
        {results && results.length > 0 ? (
            <>
                {/* First row of plots */}
                <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
                    {selectedVars1.map((selectedVar, index) => (
                        <div key={index} style={{ width: '30%' }}>
                            <label style={labelStyle}>{plotsNames1[index]}: </label>
                            <select 
                                value={selectedVar} 
                                onChange={(e) => handleSelectionChange1(index, e)}
                                style={{ marginBottom: '10px', display: 'block' }}
                            >
                                {(index === 0 ? plot1Variables : index === 1 ? plot2Variables : plot3Variables).map((variable, i) => (
                                    <option key={i} value={stateVariableNames.indexOf(variable)}>
                                        {variable + ' - ' + (variableDescriptions[variable] || 'No description available')}
                                    </option>
                                ))}
                            </select>
                            <Line data={getPlotData(selectedVar)} options={getPlotOptions(selectedVar)} />
                        </div>
                    ))}
                </div>

                {/* Second row of plots */}
                <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
                    {selectedVars2.map((selectedVar, index) => (
                        <div key={index} style={{ width: '30%' }}>
                            <label style={labelStyle}>{plotsNames2[index]}: </label>
                            <select 
                                value={selectedVar} 
                                onChange={(e) => handleSelectionChange2(index, e)}
                                style={{ marginBottom: '10px', display: 'block' }}
                            >
                                {(index === 0 ? plot4Variables : index === 1 ? plot5Variables : plot6Variables).map((variable, i) => (
                                    <option key={i} value={stateVariableNames.indexOf(variable)}>
                                        {variable + ' - ' + (variableDescriptions[variable] || 'No description available')}
                                    </option>
                                ))}
                            </select>
                            <Line data={getPlotData(selectedVar)} options={getPlotOptions(selectedVar)} />
                        </div>
                    ))}
                </div>

                {/* Third row of plots */}
                <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
                    {selectedVars3.map((selectedVar, index) => (
                        <div key={index} style={{ width: '30%' }}>
                            <label style={labelStyle}>{plotsNames3[index]}: </label>
                            <select 
                                value={selectedVar} 
                                onChange={(e) => handleSelectionChange3(index, e)}
                                style={{ marginBottom: '10px', display: 'block' }}
                            >
                                {(index === 0 ? plot7Variables : index === 1 ? plot8Variables : plot9Variables).map((variable, i) => (
                                    <option key={i} value={stateVariableNames.indexOf(variable)}>
                                        {variable + ' - ' + (variableDescriptions[variable] || 'No description available')}
                                    </option>
                                ))}
                            </select>
                            <Line data={getPlotData(selectedVar)} options={getPlotOptions(selectedVar)} />
                        </div>
                    ))}
                </div>
            </>
        ) : (
            <p>No results available. Please solve the ODE for diets to view plots.</p>
        )}

        <Button 
            variant="contained" 
            color="secondary" 
            onClick={downloadResultsAsExcel} 
            style={{ marginLeft: '10px' }}
        >
            Download Results as Excel
        </Button>
    </div>
);

}
export default OdeSolver;
