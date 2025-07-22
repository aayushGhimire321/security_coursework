import {
  EventSeat as EventSeatIcon,
  Movie as MovieIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import {
  Alert,
  AlertTitle,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getDashboardStatsApi } from '../../../apis/Api';

// StatCard Component
const StatCard = ({ title, value, icon: Icon, color }) => {
  const theme = useTheme();

  return (
    <Card sx={{ height: '100%', borderRadius: 2 }}>
      <CardContent>
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'>
          <Box>
            <Typography
              color='textSecondary'
              variant='subtitle2'
              gutterBottom>
              {title}
            </Typography>
            <Typography
              variant='h4'
              component='div'>
              {value.toLocaleString()}
            </Typography>
          </Box>
          <Icon
            sx={{ fontSize: 40, color: color || theme.palette.primary.main }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUserLogins: 0,
    totalMoviesAdded: 0,
    totalBookings: 0,
  });
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    getDashboardStatsApi()
      .then((res) => {
        if (res.status === 200) {
          setStats(res.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching dashboard statistics:', error);
        setLoading(false);
      });
  }, []);

  const chartData = [
    { name: 'User Logins', value: stats.totalUserLogins },
    { name: 'Movies Added', value: stats.totalMoviesAdded },
    { name: 'Total Bookings', value: stats.totalBookings },
  ];

  if (loading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='100vh'
        bgcolor={theme.palette.background.default}>
        <Box textAlign='center'>
          <CircularProgress size={60} />
          <Typography
            variant='h6'
            color='textSecondary'
            sx={{ mt: 2 }}>
            Loading...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.default,
        minHeight: '100vh',
        py: 3,
      }}
      className='ml-16'>
      <Container
        maxWidth='lg'
        className='ml-16'>
        <Grid
          container
          spacing={3}>
          {/* Header */}
          <Grid
            item
            xs={12}>
            <Typography
              variant='h3'
              component='h1'
              gutterBottom
              align='center'>
              Admin Dashboard
            </Typography>
            <Alert
              severity='info'
              sx={{ mb: 4 }}>
              <AlertTitle>Welcome back!</AlertTitle>
              Here's an overview of your latest statistics.
            </Alert>
          </Grid>

          {/* Stat Cards */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}>
            <StatCard
              title='Total Users'
              value={stats.totalUserLogins}
              icon={PeopleIcon}
              color={theme.palette.primary.main}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}>
            <StatCard
              title='Total Movies'
              value={stats.totalMoviesAdded}
              icon={MovieIcon}
              color={theme.palette.success.main}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}>
            <StatCard
              title='Total Bookings'
              value={stats.totalBookings}
              icon={EventSeatIcon}
              color={theme.palette.info.main}
            />
          </Grid>

          {/* Chart */}
          <Grid
            item
            xs={12}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: theme.shadows[2],
              }}>
              <Typography
                variant='h6'
                gutterBottom>
                Statistics Overview
              </Typography>
              <Box sx={{ height: 400, mt: 3 }}>
                <ResponsiveContainer
                  width='100%'
                  height='100%'>
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 30,
                    }}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='name' />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey='value'
                      fill={theme.palette.primary.main}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
