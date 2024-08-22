import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { odeSystem } from './odeFunctions'; // Importing the ODE function


const eulerMethod = (t0, t1, initialConditions, odeSystem, dt) => {
    const times = [t0];
    const solutions = [initialConditions];
    let currentTime = t0;
    let currentState = initialConditions;

    while (currentTime < t1) {
        const derivatives = odeSystem(currentTime, currentState);
        currentState = currentState.map((value, index) => value + dt * derivatives[index]);
        currentTime += dt;

        times.push(currentTime);
        solutions.push(currentState);
    }

    return { times, solutions };
};


function OdeSolver() {   
        
    const [time, setTime] = useState([]);
    const [solution, setSolution] = useState([]);
    
    // State to track selected variables for each plot
    const max = 62;
    const sequenceArray = [];

    for (let i = 0; i <= max; i++) {
        sequenceArray.push(i);
    }

    const [selectedVars, setSelectedVars] = useState([0, 1, 2]);

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

        // Solve ODE using numeric.dopri
        // numeric.dopri(t0, t1, x0, f, tol, maxit, h0)
        //t0: The initial time.
        //t1: The final time.
        //x0: The initial conditions (an array of initial values for the state variables).
        //f: The function that defines the system of ODEs.
        //tol (optional): The tolerance for the error estimate (usually a small number like 1e-6 or 1e-8).
        //maxit (optional): The maximum number of iterations (if you want to limit the iterations).
        //h0 (optional): The initial step size for the solver (if you want to control the step size manually).

        // Solve ODE using numeric.dopri
        //let sol = numeric.dopri(0, 24, initialConditions, odeSystem, 1e-6, 1000, 0.01);

        // Process solution to extract each state variable's evolution over time
        //const times = sol.x;
        //const solutions = sol.y; 

        //setTime(times);
        //setSolution(solutions);  
        
        
        const t0 = 0;
        const t1 = 24;
        const dt = 0.001; // Step size

        const { times, solutions } = eulerMethod(t0, t1, initialConditions, odeSystem, dt);

        setTime(times);
        setSolution(solutions);

        console.log(times); 

         

    };

    // Handler to update selected state variable for each dropdown
    const handleSelectionChange = (index, event) => {
        const newSelectedVars = [...selectedVars];
        newSelectedVars[index] = event.target.value;
        setSelectedVars(newSelectedVars);
    };

    // Prepare data for each plot based on the selected variable
    const getPlotData = (varIndex) => ({
        labels: time.map(t => Math.round(t)),
        datasets: [{
            label: `State Variable ${parseInt(varIndex) + 1}`,
            data: solution.map(sol => sol[varIndex]),  // Extract the selected state variable over time
            fill: false,
            borderColor: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
            tension: 0.1
        }]
    });

    // Define options for each plot
    const getPlotOptions = (varIndex) => ({
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time (units)',  // Replace 'Time (units)' with your preferred label
                },
            },
            y: {
                title: {
                    display: true,
                    text: `State Variable ${parseInt(varIndex) + 1}`,  // Replace with your preferred y-axis label
                },
            },
        },
    });

    return (
        <div>
            <button onClick={solveODE}>Solve ODE</button>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                {selectedVars.map((selectedVar, index) => (
                    <div key={index} style={{ width: '30%' }}>
                        <label>Select Variable for Plot {index + 1}: </label>
                        <select 
                            value={selectedVar} 
                            onChange={(e) => handleSelectionChange(index, e)}
                            style={{ marginBottom: '10px', display: 'block' }}
                        >
                            {solution.length > 0 && solution[0].map((_, i) => (
                                <option key={i} value={i}>
                                    State Variable {i + 1}
                                </option>
                            ))}
                        </select>
                        <Line data={getPlotData(selectedVar)} options={getPlotOptions(selectedVar)} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OdeSolver;