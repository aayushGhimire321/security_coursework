import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
  useTheme,
  IconButton,
  Paper,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from '@mui/material';
import {
  PlayCircle,
  Star,
  CalendarToday,
  AccessTime,
  MovieCreation,
  Close,
  Info,
} from '@mui/icons-material';
import React, { useState } from 'react';
import './ComingSoon.css';

const movieData = [
  {
    id: 1,
    title: "Superman",
    poster: "https://upload.wikimedia.org/wikipedia/en/3/32/Superman_%282025_film%29_poster.jpg",
    genre: "Action, Adventure, Sci-Fi",
    rating: "PG-13",
    duration: "TBA",
    details: "The new Superman film directed by James Gunn, starring David Corenswet as the Man of Steel. This reboot promises to bring a fresh take on the iconic superhero.",
    releaseDate: "July 11, 2025",
    trailerUrl: "https://youtu.be/Ox8ZLF6cGM0?si=zB7T1b2MpLgVVg3M"
  },
  {
    id: 2,
    title: "Fantastic Four: First Steps",
    poster: "https://lumiere-a.akamaihd.net/v1/images/12_blue_teaser2_4x5_ig_2609a9ad.jpeg?region=0,0,1080,1350",
    genre: "Action, Adventure, Sci-Fi",
    rating: "PG-13",
    duration: "TBA",
    details: "Marvel's First Family returns to the big screen in this highly anticipated MCU debut. The film will introduce the Fantastic Four to the Marvel Cinematic Universe.",
    releaseDate: "July 25, 2025",
    trailerUrl: "https://youtu.be/18QQWa5MEcs?si=KX4dqLKZCOvyNjvn"
  },
  {
    id: 3,
    title: "Captain America: Brave New World",
    poster: "https://lh3.googleusercontent.com/proxy/RaEAQUG9nUSxi9HvDolDpljFGC0uxbd_YtXGmw8m1XNyurCd0MLew9zLT-N_d23bljQj82KdRCR6_5m3W24HMWgLXMI8OHW1Hl3mFvSr3df6h5iWK2O541wftfqFkIxeDKA",
    genre: "Action, Adventure, Thriller",
    rating: "PG-13",
    duration: "118 min",
    details: "Sam Wilson officially takes up the mantle of Captain America and finds himself in the middle of an international incident. Anthony Mackie stars as the new Captain America.",
    releaseDate: "February 14, 2025",
    trailerUrl: "hhttps://youtu.be/1pHDWnXmK7Y?si=QRF5aQEp1J8YG_pd"
  },
  {
    id: 4,
    title: "Thunderbolts",
    poster: "https://upload.wikimedia.org/wikipedia/en/thumb/9/90/Thunderbolts%2A_poster.jpg/250px-Thunderbolts%2A_poster.jpg",
    genre: "Action, Adventure, Comedy",
    rating: "PG-13",
    duration: "TBA",
    details: "A group of supervillains are recruited to go on missions for the government. The team includes Bucky Barnes, Yelena Belova, Red Guardian, and more.",
    releaseDate: "May 2, 2025",
    trailerUrl: "https://youtu.be/-sAOWhvheK8?si=-jBqOsLpPbo2o2Tn"
  },
  {
    id: 5,
    title: "Avatar: Fire and Ash",
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRivV67R9p_D1Zf6gU_DnIwO7dwUtavdeoVjA&s",
    genre: "Action, Adventure, Fantasy",
    rating: "PG-13",
    duration: "TBA",
    details: "The third installment in James Cameron's Avatar saga. Jake and Neytiri's story continues as they face new threats and explore new regions of Pandora.",
    releaseDate: "December 19, 2025",
    trailerUrl: "hhttps://youtu.be/v6QgmSOBzkk?si=ak-VPWmjVVOgx17h"
  },
  {
    id: 6,
    title: "The Batman Part II",
    poster: "https://i.pinimg.com/736x/b8/a1/ef/b8a1efaa69f188061934253d3b2104ac.jpg",
    genre: "Action, Crime, Drama",
    rating: "PG-13",
    duration: "TBA",
    details: "Robert Pattinson returns as the Dark Knight in this highly anticipated sequel. The film will continue exploring Batman's early years in Gotham City.",
    releaseDate: "October 3, 2025",
    trailerUrl: "https://youtu.be/E0xsm36brHY?si=1aLFgcLIBwDbkBDo"
  },
  {
    id: 7,
    title: "Mission: Impossible - The Final Reckoning",
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSafalx_eWYqtyL60gkiDE61XXeEmyeuRBf8g&s",
    genre: "Action, Adventure, Thriller",
    rating: "PG-13",
    duration: "TBA",
    details: "Tom Cruise returns as Ethan Hunt in what promises to be the final Mission: Impossible film. High-octane action and incredible stunts await.",
    releaseDate: "May 23, 2025",
    trailerUrl: "https://youtu.be/fsQgc9pCyDU?si=dSU2WykIwNSVcXNR"
  },
  {
    id: 8,
    title: "Jurassic World Rebirth",
    poster: "data:image/jpeg;base64,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",
    genre: "Action, Adventure, Sci-Fi",
    rating: "PG-13",
    duration: "TBA",
    details: "The dinosaur franchise continues with a new story set in the Jurassic World universe. Featuring new characters and prehistoric adventures.",
    releaseDate: "July 2, 2025",
    trailerUrl: "https://youtu.be/jan5CFWs9ic?si=lJCNau90GZdyKMVz"
  },
  {
    id: 9,
    title: "Blade",
    poster: "https://m.media-amazon.com/images/M/MV5BNzAzMmY3OWMtNDgyMS00Y2U4LTlmM2UtY2YwMmM0MDI5ODJmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    genre: "Action, Horror, Thriller",
    rating: "R",
    duration: "TBA",
    details: "Mahershala Ali takes on the role of the vampire hunter Blade in this upcoming MCU film. A darker, more mature entry into the Marvel Cinematic Universe.",
    releaseDate: "November 7, 2025",
    trailerUrl: "https://youtu.be/x-N2zE-d6YA?si=v-aKN5xQdNfm9Mcp"
  }
];

const ComingSoon = () => {
  const theme = useTheme();
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleDetailsClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const handleWatchTrailer = (trailerUrl) => {
    console.log('Opening trailer:', trailerUrl);
    if (trailerUrl) {
      window.open(trailerUrl, '_blank', 'noopener,noreferrer');
    } else {
      console.error('No trailer URL provided');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: { xs: 6, md: 8 },
          mt: 8,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.1,
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box textAlign="center">
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                mb: 2,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              Coming Soon
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                opacity: 0.9,
                maxWidth: '600px',
                mx: 'auto',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              Get ready for the most anticipated movies of the year. Don't miss out on these blockbusters!
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                icon={<MovieCreation />}
                label="Latest Releases"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              />
              <Chip
                icon={<PlayCircle />}
                label="Exclusive Previews"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Movies Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {movieData.map((movie) => (
            <Grid item xs={12} sm={6} md={4} key={movie.id}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                  border: `1px solid ${theme.palette.divider}`,
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.15)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="400"
                  image={movie.poster}
                  alt={movie.title}
                  sx={{
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease',
                    backgroundColor: '#f5f5f5',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x400/cccccc/666666?text=Movie+Poster';
                  }}
                />
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontWeight: 'bold',
                      color: 'text.primary',
                      mb: 2,
                    }}
                  >
                    {movie.title}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip
                      size="small"
                      label={movie.genre}
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        color: 'white',
                      }}
                    />
                    <Chip
                      size="small"
                      label={movie.rating}
                      sx={{
                        bgcolor: 'rgba(0,0,0,0.1)',
                        color: 'text.secondary',
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AccessTime sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {movie.duration}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {movie.releaseDate}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => handleDetailsClick(movie)}
                      startIcon={<Info />}
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        fontWeight: 'bold',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        '&:hover': {
                          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                          transform: 'translateY(-2px)',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Details
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => handleWatchTrailer(movie.trailerUrl)}
                      className="trailer-button"
                      sx={{
                        borderRadius: 3,
                        py: 1.5,
                        px: 3,
                        fontWeight: 'bold',
                        minWidth: '120px',
                        background: 'transparent',
                        color: '#64748b',
                        border: '2px solid #e2e8f0',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 50%, #0d47a1 100%)',
                          color: 'white',
                          borderColor: '#1976d2',
                          transform: 'translateY(-3px)',
                          boxShadow: '0 8px 25px rgba(25, 118, 210, 0.6)',
                        },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    >
                      Trailer
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Movie Details Modal */}
      <Dialog
        open={Boolean(selectedMovie)}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 3,
            overflow: 'hidden',
          },
        }}
      >
        {selectedMovie && (
          <>
            <DialogTitle
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 2,
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {selectedMovie.title}
              </Typography>
              <IconButton
                onClick={handleCloseModal}
                sx={{ color: 'white' }}
              >
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Paper
                    sx={{
                      borderRadius: 2,
                      overflow: 'hidden',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    }}
                  >
                    <img
                      src={selectedMovie.poster}
                      alt={selectedMovie.title}
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                      }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x400/cccccc/666666?text=Movie+Poster';
                      }}
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                      Movie Information
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                      <Chip
                        icon={<Star />}
                        label={`Rating: ${selectedMovie.rating}`}
                        sx={{
                          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                          color: 'white',
                        }}
                      />
                      <Chip
                        icon={<AccessTime />}
                        label={selectedMovie.duration}
                        sx={{ bgcolor: 'rgba(0,0,0,0.1)' }}
                      />
                      <Chip
                        icon={<CalendarToday />}
                        label={selectedMovie.releaseDate}
                        sx={{ bgcolor: 'rgba(0,0,0,0.1)' }}
                      />
                    </Box>

                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                      Genre:
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {selectedMovie.genre}
                    </Typography>

                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                      Synopsis:
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {selectedMovie.details}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 0 }}>
              <Button
                onClick={handleCloseModal}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                }}
              >
                Close
              </Button>
              <Button
                variant="outlined"
                onClick={() => handleWatchTrailer(selectedMovie.trailerUrl)}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontWeight: 'bold',
                  background: 'transparent',
                  color: '#64748b',
                  border: '2px solid #e2e8f0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 50%, #0d47a1 100%)',
                    color: 'white',
                    borderColor: '#1976d2',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(25, 118, 210, 0.6)',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                Watch Trailer
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};
  
  export default ComingSoon;