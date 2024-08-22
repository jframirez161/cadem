// src/components/Continue.js
import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Continue = () => (
  <Container>
    <Box mt={5} textAlign="center">
      <Typography variant="h4">Welcome</Typography>
      <Typography variant="h6">Continue without Registration</Typography>
      <Button variant="contained" color="primary" component={Link} to="/">Go to Home</Button>
    </Box>
  </Container>
);

export default Continue;
