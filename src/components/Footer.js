import React from 'react';
import { Typography, Container, Box } from '@mui/material';

const Footer = () => (
  <Box
    sx={{
      backgroundColor: '#f9f9f9', // Light background for the footer
      padding: '16px 0', // Some padding for better spacing
      marginTop: 'auto', // Push the footer to the bottom of the page if the content is less
    }}
  >
    <Container maxWidth="lg">
      <Typography variant="body2" color="textSecondary" align="center">
        {'© 2024 The University of California, Davis. All rights reserved.'}
      </Typography>
      <Typography variant="body2" color="textSecondary" align="center" sx={{ marginTop: '4px' }}>
        {'Created by John F. Ramirez and Ermias Kebreab'}
      </Typography>
    </Container>
  </Box>
);

export default Footer;

