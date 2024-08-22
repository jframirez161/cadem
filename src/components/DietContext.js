// src/components/DietContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import * as XLSX from 'xlsx'; // Importar XLSX
import { v4 as uuidv4 } from 'uuid'; // Importar uuidv4

const DietContext = createContext();

export const DietProvider = ({ children }) => {
    const [diets, setDiets] = useState([]);

    useEffect(() => {
        const fetchFeedData = async () => {
            try {
                const response = await fetch('/Feed_Library.xlsx');
                const arrayBuffer = await response.arrayBuffer();
                const data = new Uint8Array(arrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);

                if (json.length > 0) {
                    const dummyDiets = [
                        {
                            id: uuidv4(),
                            name: 'Diet 1',
                            composition: [
                                {
                                    Category: json[57].Category,
                                    'Feed Name': json[57]['Feed Name'],
                                    percentage: '60.0',
                                    'DM (%AF)': parseFloat(json[57]['DM (%AF)']).toFixed(1),
                                    'DE (Mcal/kg)': parseFloat(json[57]['DE (Mcal/kg)']).toFixed(1),
                                    'TDN (%DM)': parseFloat(json[57]['TDN (%DM)']).toFixed(1),
                                    'NDF (%DM)': parseFloat(json[57]['NDF (%DM)']).toFixed(1),
                                    'CP (%DM)': parseFloat(json[57]['CP (%DM)']).toFixed(1),
                                    'Fat (%DM)': parseFloat(json[57]['Fat (%DM)']).toFixed(1)
                                },
                                {
                                    Category: json[36].Category,
                                    'Feed Name': json[36]['Feed Name'],
                                    percentage: '30.0',
                                    'DM (%AF)': parseFloat(json[36]['DM (%AF)']).toFixed(1),
                                    'DE (Mcal/kg)': parseFloat(json[36]['DE (Mcal/kg)']).toFixed(1),
                                    'TDN (%DM)': parseFloat(json[36]['TDN (%DM)']).toFixed(1),
                                    'NDF (%DM)': parseFloat(json[36]['NDF (%DM)']).toFixed(1),
                                    'CP (%DM)': parseFloat(json[36]['CP (%DM)']).toFixed(1),
                                    'Fat (%DM)': parseFloat(json[36]['Fat (%DM)']).toFixed(1)
                                },
                                {
                                    Category: json[113].Category,
                                    'Feed Name': json[113]['Feed Name'],
                                    percentage: '10.0',
                                    'DM (%AF)': parseFloat(json[113]['DM (%AF)']).toFixed(1),
                                    'DE (Mcal/kg)': parseFloat(json[113]['DE (Mcal/kg)']).toFixed(1),
                                    'TDN (%DM)': parseFloat(json[113]['TDN (%DM)']).toFixed(1),
                                    'NDF (%DM)': parseFloat(json[113]['NDF (%DM)']).toFixed(1),
                                    'CP (%DM)': parseFloat(json[113]['CP (%DM)']).toFixed(1),
                                    'Fat (%DM)': parseFloat(json[113]['Fat (%DM)']).toFixed(1)
                                }
                            ]
                        },
                        {
                            id: uuidv4(),
                            name: 'Diet 2',
                            composition: [
                                {
                                    Category: json[55].Category,
                                    'Feed Name': json[55]['Feed Name'],
                                    percentage: '100.0',
                                    'DM (%AF)': parseFloat(json[55]['DM (%AF)']).toFixed(1),
                                    'DE (Mcal/kg)': parseFloat(json[55]['DE (Mcal/kg)']).toFixed(1),
                                    'TDN (%DM)': parseFloat(json[55]['TDN (%DM)']).toFixed(1),
                                    'NDF (%DM)': parseFloat(json[55]['NDF (%DM)']).toFixed(1),
                                    'CP (%DM)': parseFloat(json[55]['CP (%DM)']).toFixed(1),
                                    'Fat (%DM)': parseFloat(json[55]['Fat (%DM)']).toFixed(1)
                                }
                            ]
                        }
                    ];
                    setDiets(dummyDiets);
                } else {
                    setDiets([{ id: uuidv4(), name: 'Diet 1', composition: [] }]);
                }
            } catch (error) {
                console.error('Error fetching and parsing Excel file:', error);
            }
        };

        fetchFeedData();
    }, []);

    return (
        <DietContext.Provider value={{ diets, setDiets }}>
            {children}
        </DietContext.Provider>
    );
};

export const useDiets = () => useContext(DietContext);
