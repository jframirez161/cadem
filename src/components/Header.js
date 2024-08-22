import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" style={{ flexGrow: 1 }}>
        California Dairy Emissions Platform
      </Typography>
      <Box>
        <Button color="inherit" component={Link} to="/signin">Sign In</Button>
        <Button color="inherit" component={Link} to="/register">Register</Button>
        <Button color="inherit" component={Link} to="/continue">Continue without Registration</Button>
        <Button color="inherit" component={Link} to="/">Home</Button>
      </Box>
    </Toolbar>
  </AppBar>
);

export default Header;

