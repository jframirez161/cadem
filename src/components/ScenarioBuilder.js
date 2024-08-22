import React, { useState, useEffect } from 'react';
import { useDiets } from './DietContext';
import { useScenarios } from './ScenarioContext';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  Tabs,
  Tab,
  Button,
  IconButton,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';

const animalTypes = [
  { name: 'Milk Cows – Lactating', percentage: 0, dietName: '', DMI: 0 },
  { name: 'Dry Cows', percentage: 0, dietName: '', DMI: 0 },
  { name: 'Bred heifers – 15-24 months old', percentage: 0, dietName: '', DMI: 0 },
  { name: 'Heifers - 7-14 months old', percentage: 0, dietName: '', DMI: 0 },
  { name: 'Calves – 4-6 months old', percentage: 0, dietName: '', DMI: 0 },
  { name: 'Calves – 0-3 months old', percentage: 0, dietName: '', DMI: 0 }
];

const ScenarioBuilder = () => {
  const { diets } = useDiets();
  const { scenarios, setScenarios } = useScenarios();
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [openNameDialog, setOpenNameDialog] = useState(false);
  const [newScenarioName, setNewScenarioName] = useState('');

  useEffect(() => {
    if (scenarios.length === 0 && diets.length > 0) {
      const validDietName = diets[0]?.name || '';
      const initialScenarios = [
        {
          id: uuidv4(),
          name: 'Scenario 1',
          data: [
            { ...animalTypes.find(animal => animal.name === 'Milk Cows – Lactating'), percentage: 100, DMI:20, dietName: validDietName }
          ]
        },
        {
          id: uuidv4(),
          name: 'Scenario 2',
          data: [
            { ...animalTypes.find(animal => animal.name === 'Milk Cows – Lactating'), percentage: 50, DMI:20, dietName: validDietName },
            { ...animalTypes.find(animal => animal.name === 'Dry Cows'), percentage: 50, DMI:10, dietName: diets[1]?.name || validDietName }
          ]
        }
      ];
      setScenarios(initialScenarios);
    }
  }, [diets, scenarios.length, setScenarios]);

  useEffect(() => {
    console.log('Scenarios:', scenarios); // Log entire scenarios list
    scenarios.forEach(scenario => {
      scenario.data.forEach(animalType => {
        console.log(`Scenario Name: ${scenario.name}, Animal Type: ${animalType.name}, Diet Name: ${animalType.dietName}`);
      });
    });
  }, [scenarios]);

  const handleInputChange = (scenarioIndex, animalIndex, field, value) => {
    const newScenarios = [...scenarios];
    newScenarios[scenarioIndex].data[animalIndex][field] = field === 'percentage' || field === 'DMI' ? parseFloat(value) : value;
    setScenarios(newScenarios);
  };

  const handleAnimalTypeChange = (scenarioIndex, animalIndex, newType) => {
    const newScenarios = [...scenarios];
    const selectedType = animalTypes.find(animal => animal.name === newType);
    if (selectedType) {
      newScenarios[scenarioIndex].data[animalIndex] = {
        ...selectedType,
        percentage: newScenarios[scenarioIndex].data[animalIndex].percentage,
        dietName: newScenarios[scenarioIndex].data[animalIndex].dietName,
        DMI: newScenarios[scenarioIndex].data[animalIndex].DMI
      };
      setScenarios(newScenarios);
    }
  };

  const handleDietChange = (scenarioIndex, animalIndex, dietName) => {
    const matchingDiet = diets.find(diet => diet.name === dietName);
    if (!matchingDiet) {
      console.error(`No matching diet found for Diet Name: ${dietName}`);
      return; // Optionally handle this case differently
    }
    const newScenarios = [...scenarios];
    newScenarios[scenarioIndex].data[animalIndex].dietName = dietName;
    setScenarios(newScenarios);
  };

  const handleAddScenario = () => {
    const newScenario = {
      id: uuidv4(),
      name: `Scenario ${scenarios.length + 1}`,
      data: animalTypes.map(animal => ({ ...animal, dietName: diets[0]?.name || '' }))
    };
    setScenarios(prevScenarios => [...prevScenarios, newScenario]);
    setCurrentScenarioIndex(scenarios.length);
  };

  const handleDeleteScenario = (index) => {
    const newScenarios = scenarios.filter((_, i) => i !== index);
    setScenarios(newScenarios);
    setCurrentScenarioIndex(0);
  };

  const handleAddNewLine = () => {
    const newScenarios = [...scenarios];
    newScenarios[currentScenarioIndex].data.push({
      name: '',
      percentage: 0,
      dietName: diets[0]?.name || '',
      DMI: 0
    });
    setScenarios(newScenarios);
  };

  const handleDeleteLine = (scenarioIndex, animalIndex) => {
    const newScenarios = [...scenarios];
    newScenarios[scenarioIndex].data.splice(animalIndex, 1);
    setScenarios(newScenarios);
  };

  const handleScenarioNameChange = (event) => {
    setNewScenarioName(event.target.value);
  };

  const handleSaveScenarioName = () => {
    const updatedScenarios = [...scenarios];
    updatedScenarios[currentScenarioIndex].name = newScenarioName;
    setScenarios(updatedScenarios);
    setOpenNameDialog(false);
  };

  const openNameDialogHandler = (index) => {
    setCurrentScenarioIndex(index);
    setNewScenarioName(scenarios[index]?.name || '');
    setOpenNameDialog(true);
  };

  return (
    <Container>
      <Box>
        <Typography variant="h4" gutterBottom>
          Scenarios
        </Typography>
      </Box>

      <Box mt={5}>
        <Typography variant="body1">
          Below is a table of scenarios. You can add a new animal type by clicking "Add New Animal Type" and modify existing total of animals per animal category and diets using the dropdowns and text fields. To create a new scenario, click "Add New Scenario" above.
        </Typography>

        <Box display="flex" alignItems="center">
          <Tabs
            value={currentScenarioIndex}
            onChange={(e, newValue) => setCurrentScenarioIndex(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {scenarios.map((scenario, index) => (
              <Tab
                key={scenario.id}
                label={scenario.name || `Scenario ${index + 1}`}
                onDoubleClick={() => openNameDialogHandler(index)}
              />
            ))}
          </Tabs>
          {scenarios.length > 1 && (
            <IconButton
              color="primary"
              onClick={() => handleDeleteScenario(currentScenarioIndex)}
              sx={{ ml: 1 }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleAddScenario}>
            Add New Scenario
          </Button>
        </Box>
        <Box mt={3}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Animal Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Number of Animals</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Diet Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>DMI (kg/day)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Actions</TableCell>
                                </TableRow>
              </TableHead>
              <TableBody>
                {scenarios[currentScenarioIndex]?.data?.map((row, animalIndex) => (
                  <TableRow key={animalIndex}>
                    <TableCell>
                      <Select
                        value={row.name}
                        onChange={(e) => handleAnimalTypeChange(currentScenarioIndex, animalIndex, e.target.value)}
                        fullWidth
                      >
                        {animalTypes.map((animal) => (
                          <MenuItem key={animal.name} value={animal.name}>
                            {animal.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={row.percentage}
                        onChange={(e) => handleInputChange(currentScenarioIndex, animalIndex, 'percentage', e.target.value)}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={row.dietName}
                        onChange={(e) => handleDietChange(currentScenarioIndex, animalIndex, e.target.value)}
                        fullWidth
                      >
                        {diets.map((diet) => (
                          <MenuItem key={diet.name} value={diet.name}>
                            {diet.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={row.DMI}
                        onChange={(e) => handleInputChange(currentScenarioIndex, animalIndex, 'DMI', e.target.value)}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleDeleteLine(currentScenarioIndex, animalIndex)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={handleAddNewLine}>
              Add New Animal Type
            </Button>
          </Box>
        </Box>
      </Box>

      <Dialog open={openNameDialog} onClose={() => setOpenNameDialog(false)}>
        <DialogTitle>Update Scenario Name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Scenario Name"
            type="text"
            fullWidth
            value={newScenarioName}
            onChange={handleScenarioNameChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNameDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveScenarioName}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ScenarioBuilder;

