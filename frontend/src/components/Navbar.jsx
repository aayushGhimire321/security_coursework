import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getSingleProfileApi, logoutApi } from '../apis/Api';

const Navbar = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const handleLogout = () => {
    logoutApi()
      .then(() => {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
      })
      .catch((error) => {
        // console.log(error)
      });
  };

  useEffect(() => {
    getSingleProfileApi()
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((err) => {
        // console.log(err);
      });
  }, []);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/homepage', label: 'Home' },
    { path: '/coming-soon', label: 'Coming Soon' },
    { path: '/user/tickets', label: 'Tickets' },
    { path: '/aboutUs', label: 'About Us' },
    { path: '/contactUs', label: 'Contact Us' },
  ];

  if (user?.isAdmin) {
    return <></>;
  }

  const renderMobileMenu = (
    <Drawer
      anchor='right'
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}>
      <Box
        sx={{ width: 250 }}
        role='presentation'>
        <List>
          {navItems.map((item) => (
            <ListItem
              key={item.path}
              component={Link}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              sx={{
                bgcolor: isActive(item.path)
                  ? 'action.selected'
                  : 'transparent',
              }}>
              <ListItemText
                primary={item.label}
                sx={{
                  '& .MuiTypography-root': {
                    color: isActive(item.path) ? '#1976d2' : '#333333',
                    fontWeight: 500
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <AppBar
      position='fixed'
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        borderBottom: 1,
        borderColor: 'divider',
      }}>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <Typography
            variant='h6'
            component={Link}
            to='/homepage'
            sx={{
              mr: 2,
              fontWeight: 700,
              fontSize: { xs: '1.5rem', md: '1.75rem' },
              textDecoration: 'none',
              color: '#1976d2',
              flexGrow: { xs: 1, md: 0 },
            }}>
            FilmSathi 
          </Typography>

          {isMobile ? (
            <IconButton
              color='inherit'
              aria-label='open drawer'
              edge='start'
              onClick={() => setMobileMenuOpen(true)}>
              <MenuIcon />
            </IconButton>
          ) : (
            <>
              <Box
                sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    sx={{
                      mx: 1,
                      color: isActive(item.path)
                        ? '#1976d2'
                        : '#333333',
                      fontSize: '1rem',
                      fontWeight: isActive(item.path) ? 700 : 500,
                      '&:hover': {
                        color: '#1976d2',
                        backgroundColor: 'transparent',
                      },
                    }}>
                    {item.label}
                  </Button>
                ))}
              </Box>

              <Box sx={{ flexShrink: 0 }}>
                {user ? (
                  <>
                    <Button
                      onClick={handleProfileMenuOpen}
                      sx={{
                        textTransform: 'none',
                        minWidth: 150,
                        borderRadius: '20px',
                        color: '#333333',
                        borderColor: '#333333',
                        '&:hover': {
                          borderColor: '#1976d2',
                          color: '#1976d2',
                        }
                      }}
                      variant='outlined'>
                      Welcome, {user.username}!
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleProfileMenuClose}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}>
                      <MenuItem
                        component={Link}
                        to='/user/profile'
                        onClick={handleProfileMenuClose}>
                        Profile
                      </MenuItem>
                      <MenuItem
                        onClick={handleLogout}
                        sx={{ color: '#d32f2f' }}>
                        Logout
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      component={Link}
                      to='/login'
                      variant='outlined'
                      sx={{
                        borderRadius: '20px',
                        color: '#333333',
                        borderColor: '#333333',
                        '&:hover': {
                          borderColor: '#1976d2',
                          color: '#1976d2',
                        }
                      }}>
                      Login
                    </Button>
                    <Button
                      component={Link}
                      to='/register'
                      variant='contained'
                      sx={{
                        borderRadius: '20px',
                        backgroundColor: '#1976d2',
                        '&:hover': {
                          backgroundColor: '#115293',
                        }
                      }}>
                      Register
                    </Button>
                  </Box>
                )}
              </Box>
            </>
          )}
        </Toolbar>
      </Container>
      {renderMobileMenu}
    </AppBar>
  );
};

export default Navbar;
