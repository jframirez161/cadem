// src/components/ViewDiets.js
import React from 'react';
import { useDiets } from './DietContext';
import { useScenarios } from './ScenarioContext';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableRow, Box } from '@mui/material';

const ViewDiets = () => {
  const { diets } = useDiets();
  const { scenarios } = useScenarios();

  return (
    <Box mt={5}>
      <Typography variant="h4" gutterBottom>View Diets and Scenarios</Typography>
      
      <Box mt={3}>
        <Typography variant="h5" gutterBottom>Diets</Typography>
        {diets.map((diet) => (
          <Card key={diet.id} variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" component="div">{diet.name}</Typography>
              <Table>
                <TableBody>
                  {diet.composition.map((feed, index) => (
                    <TableRow key={index}>
                      <TableCell>{feed.Category}</TableCell>
                      <TableCell>{feed['Feed Name']}</TableCell>
                      <TableCell>{feed.percentage}</TableCell>
                      <TableCell>{feed['DM (%AF)']}</TableCell>
                      <TableCell>{feed['DE (Mcal/kg)']}</TableCell>
                      <TableCell>{feed['TDN (%DM)']}</TableCell>
                      <TableCell>{feed['NDF (%DM)']}</TableCell>
                      <TableCell>{feed['CP (%DM)']}</TableCell>
                      <TableCell>{feed['Fat (%DM)']}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box mt={3}>
        <Typography variant="h5" gutterBottom>Scenarios</Typography>
        {scenarios.map((scenario) => (
          <Card key={scenario.id} variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" component="div">{scenario.name}</Typography>
              <Table>
                <TableBody>
                  {scenario.data.map((animal, index) => (
                    <TableRow key={index}>
                      <TableCell>{animal.name}</TableCell>
                      <TableCell>{animal.percentage}</TableCell>
                      <TableCell>{animal.dietId}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default ViewDiets;
