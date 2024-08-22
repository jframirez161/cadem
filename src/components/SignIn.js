// src/components/SignIn.js
import React from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

const SignIn = () => (
  <Container>
    <Box mt={5}>
      <Typography variant="h4">Sign In</Typography>
      <form>
        <TextField label="Email" type="email" fullWidth margin="normal" />
        <TextField label="Password" type="password" fullWidth margin="normal" />
        <Button variant="contained" color="primary" type="submit">Sign In</Button>
      </form>
    </Box>
  </Container>
);

export default SignIn;
