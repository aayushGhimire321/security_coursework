import {
  Box,
  Container,
  Divider,
  Link,
  Stack,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const StyledLink = styled(RouterLink)(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: 'none',
  '&:hover': {
    color: theme.palette.primary.dark,
    textDecoration: 'none',
  },
}));

const Footer = () => {
  const theme = useTheme();
  const user = JSON.parse(localStorage.getItem('user'));

  if (user?.isAdmin) {
    return null;
  }

  return (
    <Box
      component='footer'
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        mt: 'auto',
      }}>
      <Container maxWidth='lg'>
        <Stack
          spacing={4}
          alignItems='center'>
          {/* Navigation Links */}
          <Stack
            direction='row'
            spacing={4}
            justifyContent='center'
            divider={
              <Divider
                orientation='vertical'
                flexItem
                sx={{ bgcolor: 'grey.300' }}
              />
            }>
            <Link
              component={StyledLink}
              to='/aboutUs'
              variant='subtitle1'>
              About Us
            </Link>
            <Link
              component={StyledLink}
              to='/contactUs'
              variant='subtitle1'>
              Contact Us
            </Link>
          </Stack>

          {/* Logo and Company Name */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant='h4'
              component='h1'
              sx={{
                background: theme.palette.primary.main,
                backgroundImage: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontWeight: 'bold',
                mb: 2,
              }}>
              FilmSathi 
            </Typography>
          </Box>

          {/* Tagline */}
          <Typography
            variant='subtitle1'
            color='text.secondary'
            align='center'
            sx={{ maxWidth: 'sm', mx: 'auto' }}>
            Bringing the magic of movies to life.
            <br />
            Enjoy the ultimate cinematic experience with us.
          </Typography>

          {/* Copyright */}
          <Typography
            variant='body2'
            color='text.secondary'
            align='center'
            sx={{ mt: 2 }}>
            © {new Date().getFullYear()} Copyright: FilmSathi 
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
