import {
  ConfirmationNumber,
  Dashboard,
  ExitToApp,
  Feedback,
  LocalActivity,
  Movie,
  People,
  TheaterComedy,
} from '@mui/icons-material';
import {
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSingleProfileApi, logoutApi } from '../apis/Api';

const DRAWER_WIDTH = 280;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
  {
    text: 'Movies Management',
    icon: <Movie />,
    path: '/admin/movieManagement',
  },
  {
    text: 'Shows Management',
    icon: <TheaterComedy />,
    path: '/admin/showManagement',
  },
  {
    text: 'Bookings Management',
    icon: <ConfirmationNumber />,
    path: '/admin/bookingsManagement',
  },
  {
    text: 'Customers Management',
    icon: <People />,
    path: '/admin/customerManagement',
  },
  { text: 'User Feedbacks', icon: <Feedback />, path: '/admin/userFeedbacks' },
  // activityLogs
  {
    text: 'Log Management',
    icon: <LocalActivity />,
    path: '/admin/activityLogs',
  },
];

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await getSingleProfileApi();
        setAdmin(response.data.user);
      } catch (error) {
        // console.log(error);
      }
    };
    fetchAdmin();
  }, []);

  const handleLogout = () => {
    logoutApi()
      .then(() => {
        localStorage.removeItem('token');
        navigate('/login', { replace: true, state: { from: location } });
      })
      .catch((error) => {});
  };

  return (
    <Drawer
      variant='permanent'
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: 1,
          borderColor: 'divider',
        },
      }}>
      <Stack sx={{ height: '100%' }}>
        <Stack sx={{ p: 3, gap: 1 }}>
          <Typography
            variant='h6'
            fontWeight='bold'>
            Admin Panel
          </Typography>
          <Typography
            variant='body2'
            color='text.secondary'>
            Welcome, {admin?.username}
          </Typography>
        </Stack>

        <Divider />

        <List sx={{ flexGrow: 1, px: 2 }}>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                my: 0.5,
                borderRadius: 1,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'inherit',
                  },
                },
              }}>
              <ListItemIcon
                sx={{
                  color:
                    location.pathname === item.path
                      ? 'inherit'
                      : 'text.primary',
                }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>

        <Divider />

        <List sx={{ px: 2, pb: 2 }}>
          <ListItemButton
            onClick={handleLogout}
            sx={{ borderRadius: 1 }}>
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary='Logout' />
          </ListItemButton>
        </List>
      </Stack>
    </Drawer>
  );
};

export default AdminNavbar;
