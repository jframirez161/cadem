// src/components/Register.js
import React from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

const Register = () => (
  <Container>
    <Box mt={5}>
      <Typography variant="h4">Register</Typography>
      <form>
        <TextField label="Name" fullWidth margin="normal" />
        <TextField label="Email" type="email" fullWidth margin="normal" />
        <TextField label="Password" type="password" fullWidth margin="normal" />
        <Button variant="contained" color="primary" type="submit">Register</Button>
      </form>
    </Box>
  </Container>
);

export default Register;
