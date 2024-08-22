import React, { useState, useEffect } from 'react';
import { useDiets } from './DietContext'; // Import the context
import {
  Container,
  Typography,
  Button,
  Select,
  MenuItem,
  TextField,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';

const DietBuilder = () => {
  const { diets, setDiets } = useDiets();
  const [feedData, setFeedData] = useState([]);
  const [currentDietIndex, setCurrentDietIndex] = useState(0);
  const [openNameDialog, setOpenNameDialog] = useState(false);
  const [newDietName, setNewDietName] = useState('');
  const [isFileUploaded, setIsFileUploaded] = useState(false);


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

        setFeedData(json);
      } catch (error) {
        console.error('Error fetching and parsing Excel file:', error);
      }
    };

    fetchFeedData();
  }, [feedData]);
    
    
const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
              
      setFeedData(json); 
      const dietMap = new Map();

      json.forEach(row => {
            const dietName = row['Diet Name'];
            if (!dietMap.has(dietName)) {
                dietMap.set(dietName, {
                    id: uuidv4(),
                    name: dietName,
                    composition: []
                });
            }
            const diet = dietMap.get(dietName);
            diet.composition.push({
                Category: row['Category'] || '',
                'Feed Name': row['Feed Name'] || '',
                percentage: row['Percentage (%)'] || 0,
                'DM (%AF)': row['DM (%AF)'] || 0,
                'DE (Mcal/kg)': row['DE (Mcal/kg)'] || 0,
                'TDN (%DM)': row['TDN (%DM)'] || 0,
                'NDF (%DM)': row['NDF (%DM)'] || 0,
                'CP (%DM)': row['CP (%DM)'] || 0,
                'Fat (%DM)': row['Fat (%DM)'] || 0,
            });
        });

        const newDiets = Array.from(dietMap.values());
        setDiets(newDiets);
        setCurrentDietIndex(0);
        setIsFileUploaded(true); 
    };

    reader.readAsArrayBuffer(file);
  };
    
 const handleDownloadTemplate = () => {
    window.location.href = '/Diets.xlsx'; // Assuming the template file is named 'Diets.xlsx' and stored in the public folder
  };
    

  const defaultFeed = {
    Category: '',
    'Feed Name': '',
    percentage: '',
    'DM (%AF)': '',
    'DE (Mcal/kg)': '',
    'TDN (%DM)': '',
    'NDF (%DM)': '',
    'CP (%DM)': '',
    'Fat (%DM)': ''
  };

  const handleAddFeed = () => {
    const newFeed = { ...defaultFeed };
    const updatedDiets = [...diets];
    updatedDiets[currentDietIndex].composition.push(newFeed);
    setDiets(updatedDiets);
  };

  const handleCategoryChange = (index, newCategory) => {
    const updatedDiets = [...diets];
    const selectedFeed = feedData.find(feed => feed.Category === newCategory);
    if (selectedFeed) {
      updatedDiets[currentDietIndex].composition[index] = {
        ...selectedFeed,
        'DM (%AF)': parseFloat(selectedFeed['DM (%AF)']).toFixed(1),
        'DE (Mcal/kg)': parseFloat(selectedFeed['DE (Mcal/kg)']).toFixed(1),
        'TDN (%DM)': parseFloat(selectedFeed['TDN (%DM)']).toFixed(1),
        'NDF (%DM)': parseFloat(selectedFeed['NDF (%DM)']).toFixed(1),
        'CP (%DM)': parseFloat(selectedFeed['CP (%DM)']).toFixed(1),
        'Fat (%DM)': parseFloat(selectedFeed['Fat (%DM)']).toFixed(1),
        percentage: updatedDiets[currentDietIndex].composition[index].percentage
      };
      setDiets(updatedDiets);
    }
  };

  const handleFeedChange = (index, newFeedName) => {
    const updatedDiets = [...diets];
    const selectedFeed = feedData.find(feed => feed['Feed Name'] === newFeedName);
    if (selectedFeed) {
      updatedDiets[currentDietIndex].composition[index] = {
        ...selectedFeed,
        'DM (%AF)': parseFloat(selectedFeed['DM (%AF)']).toFixed(1),
        'DE (Mcal/kg)': parseFloat(selectedFeed['DE (Mcal/kg)']).toFixed(1),
        'TDN (%DM)': parseFloat(selectedFeed['TDN (%DM)']).toFixed(1),
        'NDF (%DM)': parseFloat(selectedFeed['NDF (%DM)']).toFixed(1),
        'CP (%DM)': parseFloat(selectedFeed['CP (%DM)']).toFixed(1),
        'Fat (%DM)': parseFloat(selectedFeed['Fat (%DM)']).toFixed(1),
        percentage: updatedDiets[currentDietIndex].composition[index].percentage
      };
      setDiets(updatedDiets);
    }
  };

  const handlePercentageChange = (index, newPercentage) => {
    const updatedDiets = [...diets];
    updatedDiets[currentDietIndex].composition[index].percentage = parseFloat(newPercentage).toFixed(1);
    setDiets(updatedDiets);
  };

  const handleNewDiet = () => {
    const newDiet = { id: uuidv4(), name: `Diet ${diets.length + 1}`, composition: [] };
    setDiets([...diets, newDiet]);
    setCurrentDietIndex(diets.length);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentDietIndex(newValue);
  };

  const handleDeleteFeed = (index) => {
    const updatedDiets = [...diets];
    updatedDiets[currentDietIndex].composition.splice(index, 1);
    setDiets(updatedDiets);
  };

  useEffect(() => {
    console.log('Diets List:', diets); // Log entire diets list
    diets.forEach(diet => {
        console.log(`Diet Name: ${diet.name}`);
    });
  }, [diets]);

  const calculateFinalDietComposition = (composition) => {
    if (composition.length === 0) return { totalPercentage: 0 };

    const totalPercentage = composition.reduce((sum, feed) => sum + parseFloat(feed.percentage), 0);

    const finalComposition = composition.reduce((acc, feed) => {
      acc['DM (%AF)'] = (acc['DM (%AF)'] || 0) + parseFloat(feed['DM (%AF)']) * (feed.percentage / totalPercentage);
      acc['DE (Mcal/kg)'] = (acc['DE (Mcal/kg)'] || 0) + parseFloat(feed['DE (Mcal/kg)']) * (feed.percentage / totalPercentage);
      acc['TDN (%DM)'] = (acc['TDN (%DM)'] || 0) + parseFloat(feed['TDN (%DM)']) * (feed.percentage / totalPercentage);
      acc['NDF (%DM)'] = (acc['NDF (%DM)'] || 0) + parseFloat(feed['NDF (%DM)']) * (feed.percentage / totalPercentage);
      acc['CP (%DM)'] = (acc['CP (%DM)'] || 0) + parseFloat(feed['CP (%DM)']) * (feed.percentage / totalPercentage);
      acc['Fat (%DM)'] = (acc['Fat (%DM)'] || 0) + parseFloat(feed['Fat (%DM)']) * (feed.percentage / totalPercentage);
      return acc;
    }, {});

    for (const key in finalComposition) {
      finalComposition[key] = finalComposition[key].toFixed(1);
    }

    return { ...finalComposition, totalPercentage: totalPercentage.toFixed(1) };
  };

  const currentDiet = diets[currentDietIndex] || { composition: [] };
  const finalDietComposition = calculateFinalDietComposition(currentDiet.composition);

  const handleDeleteDiet = () => {
    if (diets.length > 1) {
      const updatedDiets = [...diets];
      updatedDiets.splice(currentDietIndex, 1);
      setDiets(updatedDiets);
      setCurrentDietIndex(prevIndex => Math.max(0, prevIndex - 1));
    } else {
      setDiets([{ id: uuidv4(), name: 'Diet 1', composition: [] }]);
      setCurrentDietIndex(0);
    }
  };

  const handleDietNameChange = (event) => {
    setNewDietName(event.target.value);
  };

  const handleSaveDietName = () => {
    const updatedDiets = [...diets];
    updatedDiets[currentDietIndex].name = newDietName;
    setDiets(updatedDiets);
    setOpenNameDialog(false);
  };

  const openNameDialogHandler = (index) => {
    setCurrentDietIndex(index);
    setNewDietName(diets[index]?.name || '');
    setOpenNameDialog(true);
  };

  return (
    <Container>
                   
                   
      <Box>
        <Typography variant="h4" gutterBottom>
          Diets
        </Typography>
      </Box>
                   
    <Box mt={2}>
        <Typography variant="body1">
          You can upload an Excel file containing diets using the format provided in our template.
          Download the template <Button onClick={handleDownloadTemplate}>here</Button>.
        </Typography>
      </Box>

      <Box mt={2}>
        <Input
          type="file"
          inputProps={{ accept: '.xlsx, .xls' }}
          onChange={handleFileUpload}
        />
      </Box>        
                   
    
                   
      <Box mt={5}>
                   
        <Typography variant="body1">
      Below is the table of feeds for the selected or loaded diets. You can add a new feed by clicking "Add Feed" 
      and modify existing feeds using the dropdowns and text fields. The final composition of the diet 
      is calculated at the bottom of the table. To add a new diet, click "Add New Diet" above.
        </Typography>
                   
                   
                   
        <Tabs
          value={currentDietIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
                    {diets.map((diet, index) => (
            <Tab
              key={diet.name}
              label={diet.name || `Diet ${index + 1}`}
              onDoubleClick={() => openNameDialogHandler(index)}
            />
          ))}
          <IconButton color="primary" onClick={handleDeleteDiet} sx={{ ml: 2 }}>
            <DeleteIcon />
          </IconButton>
        </Tabs>
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleNewDiet}>
            Add New Diet
          </Button>
        </Box>
      </Box>

      <Dialog open={openNameDialog} onClose={() => setOpenNameDialog(false)}>
        <DialogTitle>Update Diet Name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Diet Name"
            type="text"
            fullWidth
            value={newDietName}
            onChange={handleDietNameChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNameDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveDietName}>Save</Button>
        </DialogActions>
      </Dialog>

      <Box mt={5}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Feed Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Percentage (%)</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>DM (%AF)</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>DE (Mcal/kg)</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>TDN (%DM)</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>NDF (%DM)</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>CP (%DM)</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Fat (%DM)</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Actions</TableCell>
              </TableRow>
            </TableHead>

<TableBody>
  {currentDiet.composition.map((feed, index) => (
    <TableRow key={index}>
      <TableCell>
        {isFileUploaded ? (
          <TextField
            value={feed.Category}
            onChange={(e) => handleCategoryChange(index, e.target.value)}
            fullWidth
          />
        ) : (
          <Select
            value={feed.Category}
            onChange={(e) => handleCategoryChange(index, e.target.value)}
            fullWidth
          >
            {[...new Set(feedData.map(feed => feed.Category))].map(category => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        )}
      </TableCell>
      <TableCell>
        {isFileUploaded ? (
          <TextField
            value={feed['Feed Name']}
            onChange={(e) => handleFeedChange(index, e.target.value)}
            fullWidth
          />
        ) : (
          <Select
            value={feed['Feed Name']}
            onChange={(e) => handleFeedChange(index, e.target.value)}
            fullWidth
          >
            {feedData.filter(f => f.Category === feed.Category).map(f => (
              <MenuItem key={f['Feed Name']} value={f['Feed Name']}>{f['Feed Name']}</MenuItem>
            ))}
          </Select>
        )}
      </TableCell>
      <TableCell>
        <TextField
          value={feed.percentage}
          onChange={(e) => handlePercentageChange(index, e.target.value)}
          type="number"
          inputProps={{ min: 0, max: 100 }}
          fullWidth
        />
      </TableCell>
      <TableCell>{feed['DM (%AF)']}</TableCell>
      <TableCell>{feed['DE (Mcal/kg)']}</TableCell>
      <TableCell>{feed['TDN (%DM)']}</TableCell>
      <TableCell>{feed['NDF (%DM)']}</TableCell>
      <TableCell>{feed['CP (%DM)']}</TableCell>
      <TableCell>{feed['Fat (%DM)']}</TableCell>
      <TableCell>
        <IconButton color="primary" onClick={() => handleDeleteFeed(index)}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  ))}
  {currentDiet.composition.length > 0 && (
    <TableRow>
      <TableCell><strong>Final Diet</strong></TableCell>
      <TableCell></TableCell>
      <TableCell>{finalDietComposition.totalPercentage}</TableCell>
      <TableCell>{finalDietComposition['DM (%AF)']}</TableCell>
      <TableCell>{finalDietComposition['DE (Mcal/kg)']}</TableCell>
      <TableCell>{finalDietComposition['TDN (%DM)']}</TableCell>
      <TableCell>{finalDietComposition['NDF (%DM)']}</TableCell>
      <TableCell>{finalDietComposition['CP (%DM)']}</TableCell>
      <TableCell>{finalDietComposition['Fat (%DM)']}</TableCell>
      <TableCell></TableCell>
    </TableRow>
  )}
</TableBody>



          </Table>
        </TableContainer>
        {currentDiet.composition.length === 0 && (
          <Typography>No feeds added yet.</Typography>
        )}
      </Box>

      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleAddFeed}>
          Add Feed
        </Button>
      </Box>
    </Container>
  );
};

export default DietBuilder;

           
