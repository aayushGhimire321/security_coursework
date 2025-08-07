import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import AdminNavbar from '../../components/AdminNavbar';

const AdminLayout = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Admin Navigation */}
      <AdminNavbar />
      
      {/* Main Content Area */}
      <Container 
        maxWidth="xl" 
        sx={{ 
          py: 2,
          mt: 2
        }}
      >
        {/* This will render the matched admin route component */}
        <Outlet />
      </Container>
    </Box>
  );
};

export default AdminLayout;
