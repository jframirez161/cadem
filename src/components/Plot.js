import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { 
    Chart as ChartJS, 
    LineElement, 
    BarElement,
    CategoryScale, 
    LinearScale, 
    PointElement, 
    Title, 
    Tooltip, 
    Legend 
} from 'chart.js';
import DataSelector from './DataSelector'; // Import the DataSelector component

// Register the components required for line and bar charts
ChartJS.register(
    LineElement, 
    BarElement,
    CategoryScale, 
    LinearScale, 
    PointElement, 
    Title, 
    Tooltip, 
    Legend
);

const Plot = ({ results, scenarios }) => {
    const [selectedDataIndex, setSelectedDataIndex] = useState(32); // Default to 32 for the original plot
    const [lineChartData, setLineChartData] = useState({
        labels: [],
        datasets: []
    });

    const [barChartData, setBarChartData] = useState({
        labels: [],
        datasets: []
    });

    const [selectableLineChartData, setSelectableLineChartData] = useState({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        if (results && results.length > 0 && scenarios && scenarios.length > 0) {
            const labels = results[0].data[0];
            
            // Original Plot Data
            const originalLineDatasets = results.map((result, index) => {
                const data = result.data[1][0][32]; // Original fixed index
                const multipliedData = data.map(value => value * 16.04);

                return {
                    label: result.name,
                    data: multipliedData,
                    borderColor: `hsl(${index * 360 / results.length}, 100%, 50%)`,
                    backgroundColor: `hsl(${index * 360 / results.length}, 50%, 75%)`,
                    fill: false,
                    tension: 0.4,
                };
            });

            const scenarioMethaneProduction = scenarios.map((scenario, scenarioIndex) => {
                let totalMethane = 0;

                scenario.data.forEach((animalGroup) => {
                    const dietResult = results.find(result => result.name === animalGroup.dietName);
                    if (dietResult) {
                        const lastValue = dietResult.data[1][0][32][dietResult.data[1][0][32].length - 1];
                        const methanePerDay = lastValue * 16.04;
                        const numAnimals = animalGroup.percentage;
                        const dmiAnimals = animalGroup.DMI;
                        totalMethane += methanePerDay * numAnimals * (dmiAnimals/20) ;
                    }
                });

                return totalMethane;
            });

            const originalBarDatasets = [{
                label: 'Methane production (g/day)',
                data: scenarioMethaneProduction,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }];
            
            
            const dataOptions = [
                { label: "Intake Rate", value: "dintakedt" },
                { label: "Water Flow Rate", value: "dQH2Odt" },
                { label: "Phosphorus Flow Rate", value: "dQPidt" },
                { label: "Ammonia Flow Rate", value: "dQAmdt" },
                { label: "Bacterial Flow Rate", value: "dQBadt" },
                { label: "Fatty Acid Flow Rate", value: "dQBfdt" },
                { label: "Nitrogen Flow Rate", value: "dQFndt" },
                { label: "Organic Phosphorus Flow Rate", value: "dQPoFldt" },
                { label: "Soluble Phosphorus Flow Rate", value: "dQSpFldt" },
                { label: "Triglyceride Flow Rate", value: "dQTgdt" },
                { label: "Fumarate Flow Rate", value: "dQFudt" },
                { label: "Formate Flow Rate", value: "dQFddt" },
                { label: "Silage Flow Rate", value: "dQSidt" },
                { label: "Starch Flow Rate", value: "dQSfdt" },
                { label: "Lactate Flow Rate", value: "dQLadt" },
                { label: "Soluble Sugar Flow Rate", value: "dQSadt" },
                { label: "Fermentable Nitrogen Flow Rate", value: "dQSfndt" },
                { label: "Lactate Production Rate", value: "dQLactatedt" },
                { label: "Acetate Production Rate", value: "dQAcdt" },
                { label: "Acetate Flow Rate", value: "dQAcetatedt" },
                { label: "Butyrate Production Rate", value: "dQBudt" },
                { label: "Butyrate Flow Rate", value: "dQButyratedt" },
                { label: "Propionate Production Rate", value: "dQPrdt" },
                { label: "Propionate Flow Rate", value: "dQPropionatedt" },
                { label: "Bromide Production Rate", value: "dQBrdt" },
                { label: "NOP Production Rate", value: "dQNOPdt" },
                { label: "Nitrate Flow Rate", value: "dQNO3dt" },
                { label: "Nitrite Flow Rate", value: "dQNO2dt" },
                { label: "Nitrous Oxide Flow Rate", value: "dQN2Odt" },
                { label: "NADH Flow Rate", value: "dQNADHdt" },
                { label: "Hydrogen Flow Rate", value: "dQH2dt" },
                { label: "Methane Production Rate", value: "dQMedt" },
                { label: "Methane Flow Rate", value: "dQCH4dt" },
                { label: "Carbon Dioxide Flow Rate", value: "dQCO2dt" },
                { label: "Bicarbonate Flow Rate", value: "dQBicarbdt" },
                { label: "Hydrogen Ion Flow Rate", value: "dQHplusdt" },
                { label: "Maximum Hydrogen Ion Flow Rate", value: "dQmaxHplusdt" },
                { label: "Insoluble Fiber Flow Rate", value: "dQInsolFSGdt" },
                { label: "Organic Matter Flow Rate to Hindgut", value: "dQOMHinddt" },
                { label: "Fecal Organic Matter Flow Rate", value: "dQOMFecaldt" },
                { label: "Hindgut Methane Production Rate", value: "dQCH4_hinddt" },
                { label: "Fecal Water Flow Rate", value: "dQfecalH2Odt" },
                { label: "Fecal Nitrogen Flow Rate", value: "dQfecalNdt" },
                { label: "Fecal Carbon Flow Rate", value: "dQfecalCdt" },
                { label: "Digestible Protein Flow Rate", value: "dQDpdt" },
                { label: "Indigestible Protein Flow Rate", value: "dQIpdt" },
                { label: "Ruminal Microbial Protein Flow Rate", value: "dQRMpdt" },
                { label: "Gastrointestinal Protein Flow Rate", value: "dQGpdt" },
                { label: "Nitrogen Production Rate", value: "dQNpdt" },
                { label: "Bacterial Amino Acid Flow Rate", value: "dQLBadt" },
                { label: "Fatty Acid Amino Acid Flow Rate", value: "dQLBfdt" },
                { label: "Lipid Flow Rate", value: "dQLpdt" },
                { label: "Monounsaturated Fatty Acid Flow Rate", value: "dQLMpdt" },
                { label: "Triglyceride Flow Rate", value: "dQTpdt" },
                { label: "Ethanol Production Rate", value: "dQEpdt" },
                { label: "Fermentation Product Flow Rate", value: "dQFpdt" },
                { label: "Urea Production Rate", value: "dQUpdt" },
                { label: "Organic Phosphate Flow Rate", value: "dQPodt" },
                { label: "Soluble Phosphate Flow Rate", value: "dQSpdt" },
                { label: "Soluble Sugar Flow Rate", value: "dQPsdt" },
                { label: "Water-Soluble Sugar Flow Rate", value: "dQWsdt" },
                { label: "Unsaturated Fatty Acid Flow Rate", value: "dQFaUdt" },
                { label: "Saturated Fatty Acid Flow Rate", value: "dQFaSdt" }
            ];


            
            // Selectable Plot Data
            const selectableLineDatasets = results.map((result, index) => {
                const dataIndex = dataOptions.find(option => option.value === selectedDataIndex)?.value || 32;
                const data = result.data[1][0][dataIndex]; // Use selected data index
                const multipliedData = data.map(value => value * 16.04);

                return {
                    label: result.name,
                    data: multipliedData,
                    borderColor: `hsl(${index * 360 / results.length}, 100%, 50%)`,
                    backgroundColor: `hsl(${index * 360 / results.length}, 50%, 75%)`,
                    fill: false,
                    tension: 0.4,
                };
            });

            setLineChartData({
                labels,
                datasets: originalLineDatasets
            });

            setBarChartData({
                labels: scenarios.map(scenario => scenario.name),
                datasets: originalBarDatasets
            });

            setSelectableLineChartData({
                labels,
                datasets: selectableLineDatasets
            });
        }
    }, [results, scenarios, selectedDataIndex]);  // Re-run the effect when selectedDataIndex changes

    return (
        <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem', width: '100%' }}>
                <div style={{ flex: 1, height: '400px' }}>
                    <Line 
                        data={lineChartData} 
                        options={{ 
                            responsive: true, 
                            maintainAspectRatio: false,
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Time (Hours)'
                                    }
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Methane production (g/day)'
                                    }
                                }
                            },
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'top',
                                    labels: {
                                        font: {
                                            size: 14
                                        }
                                    }
                                }
                            }
                        }} 
                    />
                </div>
                <div style={{ flex: 1, height: '400px' }}>
                    <Bar 
                        data={barChartData} 
                        options={{ 
                            responsive: true, 
                            maintainAspectRatio: false,
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Scenarios'
                                    }
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Total Methane production (g/day)'
                                    }
                                }
                            },
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'top',
                                }
                            }
                        }} 
                    />
                </div>
            </div>

            {/* Selectable Data Plot */}
            <div style={{ marginTop: '2rem' }}>
                <h4>Select Data to Plot</h4>
                <DataSelector onSelectionChange={setSelectedDataIndex} />
                <div style={{ height: '400px', marginTop: '1rem' }}>
                    <Line 
                        data={selectableLineChartData} 
                        options={{ 
                            responsive: true, 
                            maintainAspectRatio: false,
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Time (Hours)'
                                    }
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: `Selected Data (Index: ${selectedDataIndex})`
                                    }
                                }
                            },
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'top',
                                    labels: {
                                        font: {
                                            size: 14
                                        }
                                    }
                                }
                            }
                        }} 
                    />
                </div>
            </div>
        </div>
    );
};

export default Plot;
