import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import Button from '@mui/material/Button'; 
import { Box } from '@mui/material'; 
import { odeSystem } from './odeFunctions'; 


const RK4 = (t0, t1, initialConditions, odeSystem, dt) => {
    const times = [t0];
    const solutions = [initialConditions];
    let currentTime = t0;
    let currentState = initialConditions;

    while (currentTime < t1) {
        const k1 = odeSystem(currentTime, currentState);
        const k2 = odeSystem(
            currentTime + dt / 2,
            currentState.map((value, index) => value + dt / 2 * k1[index])
        );
        const k3 = odeSystem(
            currentTime + dt / 2,
            currentState.map((value, index) => value + dt / 2 * k2[index])
        );
        const k4 = odeSystem(
            currentTime + dt,
            currentState.map((value, index) => value + dt * k3[index])
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


function OdeSolver() {   
        
    const [time, setTime] = useState([]);
    const [solution, setSolution] = useState([]);

    // Define the state variable names
    const stateVariableNames = [
        'intake', 'H2O', 'Pi', 'Am', 'Ba', 'Bf', 'Fn', 'PoFl', 'SpFl', 'Tg',
        'Fu', 'Fd', 'Si', 'Sf', 'La', 'Sa', 'Sfn', 'Lactate', 'Ac', 'Acetate',
        'Bu', 'Butyrate', 'Pr', 'Propionate', 'Br', 'NOP', 'NO3', 'NO2', 'N2O',
        'NADH', 'H2', 'Me', 'CH4', 'CO2', 'Bicarb', 'Hplus', 'maxHplus',
        'InsolFSG', 'OMHind', 'OMFecal', 'CH4_hind', 'fecalH2O', 'fecalN',
        'fecalC', 'Dp', 'Ip', 'RMp', 'Gp', 'Np', 'LBa', 'LBf', 'Lp', 'LMp',
        'Tp', 'Ep', 'Fp', 'Up', 'Po', 'Sp', 'Ps', 'Ws', 'FaU', 'FaS'
    ];
    
    const plotsNames1 = [
        'Fluids and Solutes', 'Feed Components', 'Microorganisms'
    ];
    
    const plotsNames2 = [
        'Additives', 'Organic Acids', 'Gases'
    ];
    
    const plotsNames3 = [
        'Other Chemicals', 'Phosphorus', 'Fecal, and Urine Outputs'
    ];

    // Specific lists for each plot
    const plot1Variables = ['intake', 'H2O'];
    const plot2Variables = ['Fu', 'Fd', 'Si', 'Ws', 'Pi', 'Ps', 'Am', 'Tg', 'FaU', 'FaS']; 
    const plot3Variables = ['Me','Ba','Bf','Fn','Po','PoFl','SpFl','Sa','Sf','Sfn', 'Sp','LBa', 'LBf']; 
    const plot4Variables = ['Br', 'NOP', 'N3O', 'NO2', 'N2O']; 
    const plot5Variables = ['La', 'Lactate', 'Ac', 'Acetate', 'Bu', 'Butyrate', 'Pr', 'Propionate']; 
    const plot6Variables = ['CH4', 'CH4_hind', 'fecalH2O', 'H2', 'CO2']; 
    const plot7Variables = ['NADH', 'Bicarb', 'Hplus', 'InsolFSG']; 
    const plot8Variables = ['Dp', 'Ip', 'RMp', 'Gp',  'Np',  'Lp',  'LMp', 'Tp', 'Ep']; 
    const plot9Variables = ['OMHind', 'OMFecal', 'fecalN', 'fecalC', 'Fp', 'Up']; 
    
    // Create a dictionary to hold descriptions for each state variable
const variableDescriptions = {
    
    // Fluids and Solutes
    intake: 'cumulated intake (grams)',
    H2O: 'H2O/water with dissolved solutes (L)',
    
    // Feed Components
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
    
    // Microorganisms
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
    
    // Additives
    Br: 'bromoform (mol)',
    NOP: '3NOP (mol)',
    N3O: 'nitrate (mol)',
    NO2: 'nitrite (mol)',
    N2O: 'nitrous oxide (mol)',
    
    // Organic Acids
    La: 'lactic acid (mol)',
    Lactate: 'Lactate [disassociated lactic acid] (mol)',
    Ac: 'acetic acid (mol)',
    Acetate: 'Acetate [disassociated acetic acid] (mol)',
    Bu: 'butyric acid (mol)',
    Butyrate: 'Butyrate [disassociated butyric acid](mol)',
    Pr: 'propionic acid (mol)',
    Propionate: 'Propionate [disassociated propionic acid] (mol)',
    
    // Gases
    CH4: 'methane (mol)',
    CH4_hind: 'CH4 produced from organic matter in hindgut (mol)',
    fecalH2O: 'fecal water (L)',
    H2: 'metabolic hydrogen gas',        
    CO2: 'carbon dioxide',
    
    // Other Chemicals
    NADH: 'reduced NAD+ (mol)',
    Bicarb: 'bicarbonate (mol)',
    Hplus: 'hydrogen ion (mol)',
    InsolFSG: 'ratio of density of particle to density of water',
    
    
    // Phosphorus
    Dp: 'Rumen digestible phosphorus (grams)',
    Ip: 'Rumen indigestible phosphorus (grams)',
    RMp: 'Rumen microbial phosphorus (grams)',
    Gp: 'Small intestinal digestible phosphorus (grams)',
    Np: 'Small intestinal indigestible phosphorus (grams)',       
    Lp: 'Large intestinal digestible phosphorus (grams)',
    LMp: 'Large intestinal microbial phosphorus (grams)',
    Tp: 'Large intestinal indigestible phosphorus (grams)',
    Ep: 'extracellular phosphorus(grams)',
    
    // Fecal, and Urine Outputs
    OMHind: 'organic matter in hindgut (grams)',
    OMFecal: 'organic matter in feces (grams)',       
    fecalN: 'manure Nitrogen (mol)',
    fecalC: 'manure carbon (mol)',
    Fp: 'fecal phosphorus (grams)',
    Up: 'urine phosphorus (grams)'

};


    

    // Set the indices corresponding to the initial values for each plot
    const [selectedVars1, setSelectedVars1] = useState([
        stateVariableNames.indexOf('intake'), // Initial default for Plot 1
        stateVariableNames.indexOf('Fu'),    // Initial default for Plot 2
        stateVariableNames.indexOf('Me')     // Initial default for Plot 3
    ]);

    const [selectedVars2, setSelectedVars2] = useState([
        stateVariableNames.indexOf('Br'), // Initial default for second row Plot 1
        stateVariableNames.indexOf('La'),    // Initial default for second row Plot 2
        stateVariableNames.indexOf('CH4')     // Initial default for second row Plot 3
    ]);
    
    const [selectedVars3, setSelectedVars3] = useState([
        stateVariableNames.indexOf('NADH'), // Initial default for second row Plot 1
        stateVariableNames.indexOf('Dp'),    // Initial default for second row Plot 2
        stateVariableNames.indexOf('OMHind')     // Initial default for second row Plot 3
    ]);

    const solveODE = () => {
        // Define your initial conditions as per the model
        let initialConditions = [0.3398711440407751,
 60.924,
 2.727272727272727,
 1.1743291644647995,
 359.01111460198115,
 359.01111460198115,
 136.7661388959928,
 1e-10,
 1e-10,
 0.001,
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
 0.027,
 0.000419527803775296,
 22.5374672018789,
 0.0,
 0.0,
 0.06,
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
 0.001,
 0.0422116597467475,
 1e-10,
 1e-10];
        
        

    
        
        const t0 = 0;
        const t1 = 24;
        const dt = 0.001; // Step size

        const { times, solutions } = RK4(t0, t1, initialConditions, odeSystem, dt);

        setTime(times);
        setSolution(solutions);

        // Reset selectedVars to show default variables in each plot after solving ODE
        setSelectedVars1([
            stateVariableNames.indexOf(plot1Variables[0]), // Default for Plot 1
            stateVariableNames.indexOf(plot2Variables[0]), // Default for Plot 2
            stateVariableNames.indexOf(plot3Variables[0])  // Default for Plot 3
        ]);

        setSelectedVars2([
            stateVariableNames.indexOf(plot4Variables[0]), // Default for second row Plot 1
            stateVariableNames.indexOf(plot5Variables[0]), // Default for second row Plot 2
            stateVariableNames.indexOf(plot6Variables[0])  // Default for second row Plot 3
        ]);
        
        setSelectedVars3([
            stateVariableNames.indexOf(plot7Variables[0]), // Default for second row Plot 1
            stateVariableNames.indexOf(plot8Variables[0]), // Default for second row Plot 2
            stateVariableNames.indexOf(plot9Variables[0])  // Default for second row Plot 3
        ]);

        //console.log(times); 
    };

    // Handler to update selected state variable for each dropdown (first row of plots)
    const handleSelectionChange1 = (index, event) => {
        const newSelectedVars1 = [...selectedVars1];
        newSelectedVars1[index] = event.target.value;
        setSelectedVars1(newSelectedVars1);
    };

    // Handler to update selected state variable for each dropdown (second row of plots)
    const handleSelectionChange2 = (index, event) => {
        const newSelectedVars2 = [...selectedVars2];
        newSelectedVars2[index] = event.target.value;
        setSelectedVars2(newSelectedVars2);
    };
    
    // Handler to update selected state variable for each dropdown (second row of plots)
    const handleSelectionChange3 = (index, event) => {
        const newSelectedVars3 = [...selectedVars3];
        newSelectedVars3[index] = event.target.value;
        setSelectedVars3(newSelectedVars3);
    };
    
    const interpolateColor = (color1, color2, factor) => {
        if (factor < 0) factor = 0;
        if (factor > 1) factor = 1;

        let result = color1.slice();
        for (let i = 0; i < 3; i++) {
            result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
        }
        return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
    };

    // Colors as arrays
    const vibrantBlue = [30, 144, 255]; // Start color
    const darkBlue = [25, 50, 100]; // End color

    // Prepare data for each plot based on the selected variable
    const getPlotData = (varIndex) => ({
        labels: time.map(t => Math.round(t)),
        datasets: [{
            label: stateVariableNames[varIndex], // Use state variable names here
            data: solution.map(sol => sol[varIndex]),  // Extract the selected state variable over time
            fill: false,
            borderColor: interpolateColor(vibrantBlue, darkBlue, 0.5),
            borderWidth: 1, 
            tension: 0.1
        }]
    });

    // Define options for each plot
    const getPlotOptions = (varIndex) => ({
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time (Hours)',  // Replace 'Time (units)' with your preferred label
                },
            },
            y: {
                title: {
                    display: true,
                    text: stateVariableNames[varIndex],  // Use state variable names here
                },
            },
        },
    });

    
    const plotContainerStyle = {
        display: 'flex',
        justifyContent: 'space-around', // This spreads out the children more evenly
        marginBottom: '20px' // Adds vertical space between rows of plots
    };
    
    const labelStyle = {
        fontWeight: 'bold',       // Makes text bold
        color: '#007BFF',         // Sets text color, choose a color that fits your app's theme
        backgroundColor: '#E8F0FE', // Light blue background, change as needed
        padding: '5px 10px',     // Adds padding around the text
        borderRadius: '5px',     // Rounds the corners of the background
        display: 'inline-block', // Ensures padding and background enclose the text
        marginBottom: '10px'     // Adds space below the label
    };

    return (
        <div>
            <Box textAlign="center">
                <Button variant="contained" color="primary" onClick={solveODE}>
                    Solve ODE
                </Button>
            </Box>

            {/* First row of plots */}
            <div style={plotContainerStyle}>
                {selectedVars1.map((selectedVar, index) => {
                    const optionsList = index === 0 ? plot1Variables
                                    : index === 1 ? plot2Variables
                                    : plot3Variables;
                    return (
                        <div key={index} style={{ width: '30%' }}>
                            <label style={labelStyle}>{plotsNames1[index]}: </label>
                            <select 
                                value={selectedVar} 
                                onChange={(e) => handleSelectionChange1(index, e)}
                                style={{ marginBottom: '10px', display: 'block' }}
                            >
                                {optionsList.map((variable, i) => (
                                    <option key={i} value={stateVariableNames.indexOf(variable)}>
                                    {variable + ' - ' + (variableDescriptions[variable] || 'No description available')}
                                    </option>
                                ))}
                            </select>
                            <Line data={getPlotData(selectedVar)} options={getPlotOptions(selectedVar)} />
                        </div>
                    );
                })}
            </div>

            {/* Second row of plots */}
            <div style={plotContainerStyle}>
                {selectedVars2.map((selectedVar, index) => {
                    const optionsList = index === 0 ? plot4Variables
                                    : index === 1 ? plot5Variables
                                    : plot6Variables;
                    return (
                        <div key={index} style={{ width: '30%' }}>
                            <label style={labelStyle}>{plotsNames2[index]}: </label>
                            <select 
                                value={selectedVar} 
                                onChange={(e) => handleSelectionChange2(index, e)}
                                style={{ marginBottom: '10px', display: 'block' }}
                            >
                                {optionsList.map((variable, i) => (
                                    <option key={i} value={stateVariableNames.indexOf(variable)}>
                                        {variable + ' - ' + (variableDescriptions[variable] || 'No description available')}
                                    </option>
                                ))}
                            </select>
                            <Line data={getPlotData(selectedVar)} options={getPlotOptions(selectedVar)} />
                        </div>
                    );
                })}
            </div>

            {/* Third row of plots */}
            <div style={plotContainerStyle}>
                {selectedVars3.map((selectedVar, index) => {
                    const optionsList = index === 0 ? plot7Variables
                                    : index === 1 ? plot8Variables
                                    : plot9Variables;
                    return (
                        <div key={index} style={{ width: '30%' }}>
                            <label style={labelStyle}>{plotsNames3[index]}: </label>
                            <select 
                                value={selectedVar} 
                                onChange={(e) => handleSelectionChange3(index, e)}
                                style={{ marginBottom: '10px', display: 'block' }}
                            >
                                {optionsList.map((variable, i) => (
                                    <option key={i} value={stateVariableNames.indexOf(variable)}>
                                        {variable + ' - ' + (variableDescriptions[variable] || 'No description available')}
                                    </option>
                                ))}
                            </select>
                            <Line data={getPlotData(selectedVar)} options={getPlotOptions(selectedVar)} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default OdeSolver;
