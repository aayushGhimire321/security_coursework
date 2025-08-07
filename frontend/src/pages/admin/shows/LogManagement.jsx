import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Tooltip,
  IconButton,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';

const LogManagement = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const fetchLogs = () => {
    setError(null);
    
    // DUMMY DATA FOR TESTING - Always show fake logs
    const dummyLogs = [
      {
        _id: '1',
        level: 'info',
        message: 'FilmSathi system initialized successfully',
        method: 'GET',
        url: '/api/system/init',
        user: 'system',
        ip: '127.0.0.1',
        timestamp: new Date(Date.now() - 300000) // 5 minutes ago
      },
      {
        _id: '2',
        level: 'success',
        message: 'Admin user Aayush logged in successfully',
        method: 'POST',
        url: '/api/user/login',
        user: 'aayush_admin',
        ip: '192.168.1.100',
        timestamp: new Date(Date.now() - 240000) // 4 minutes ago
      },
      {
        _id: '3',
        level: 'info',
        message: 'Movie database accessed for listing',
        method: 'GET',
        url: '/api/movie/get_all_movies',
        user: 'aayush_admin',
        ip: '192.168.1.100',
        timestamp: new Date(Date.now() - 180000) // 3 minutes ago
      },
      {
        _id: '4',
        level: 'warn',
        message: 'Failed login attempt with invalid credentials',
        method: 'POST',
        url: '/api/user/login',
        user: 'unknown',
        ip: '192.168.1.105',
        timestamp: new Date(Date.now() - 120000) // 2 minutes ago
      },
      {
        _id: '5',
        level: 'success',
        message: 'New movie "Ramshetu" created successfully',
        method: 'POST',
        url: '/api/movie/create',
        user: 'aayush_admin',
        ip: '192.168.1.100',
        timestamp: new Date(Date.now() - 60000) // 1 minute ago
      },
      {
        _id: '6',
        level: 'info',
        message: 'Dashboard statistics requested',
        method: 'GET',
        url: '/api/admin/dashboard_stats',
        user: 'aayush_admin',
        ip: '192.168.1.100',
        timestamp: new Date(Date.now() - 30000) // 30 seconds ago
      },
      {
        _id: '7',
        level: 'error',
        message: 'Database connection timeout occurred',
        method: 'GET',
        url: '/api/data/fetch',
        user: 'system',
        ip: '127.0.0.1',
        timestamp: new Date(Date.now() - 360000) // 6 minutes ago
      },
      {
        _id: '8',
        level: 'info',
        message: 'Log management page accessed',
        method: 'GET',
        url: '/api/admin/get_all_logs',
        user: 'aayush_admin',
        ip: '192.168.1.100',
        timestamp: new Date()
      },
      {
        _id: '9',
        level: 'warn',
        message: 'Multiple rapid requests detected from same IP',
        method: 'GET',
        url: '/api/movie/pagination',
        user: 'guest',
        ip: '192.168.1.200',
        timestamp: new Date(Date.now() - 420000) // 7 minutes ago
      },
      {
        _id: '10',
        level: 'success',
        message: 'User registration completed successfully',
        method: 'POST',
        url: '/api/user/create',
        user: 'new_user_123',
        ip: '192.168.1.150',
        timestamp: new Date(Date.now() - 480000) // 8 minutes ago
      },
      {
        _id: '11',
        level: 'error',
        message: 'File upload failed - invalid file type',
        method: 'POST',
        url: '/api/movie/create',
        user: 'aayush_admin',
        ip: '192.168.1.100',
        timestamp: new Date(Date.now() - 540000) // 9 minutes ago
      },
      {
        _id: '12',
        level: 'info',
        message: 'Movie show times updated successfully',
        method: 'PUT',
        url: '/api/shows/update',
        user: 'aayush_admin',
        ip: '192.168.1.100',
        timestamp: new Date(Date.now() - 600000) // 10 minutes ago
      }
    ];

    console.log('Loading dummy logs for testing...');
    
    // Apply filters to dummy data
    let filteredLogs = dummyLogs;
    
    // Apply level filter
    if (levelFilter !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.level === levelFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      filteredLogs = filteredLogs.filter(log => 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const paginatedLogs = filteredLogs.slice(startIndex, startIndex + limit);
    
    console.log('Filtered logs:', filteredLogs.length);
    console.log('Paginated logs:', paginatedLogs.length);
    
    setLogs(paginatedLogs);
    setTotalPages(Math.ceil(filteredLogs.length / limit));
    
    console.log('✅ Dummy logs loaded successfully');
  };

  useEffect(() => {
    fetchLogs();
  }, [page, limit, searchTerm, levelFilter]);

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'info':
        return 'info';
      case 'warn':
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'success':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatTimestamp = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const handleRefresh = () => {
    fetchLogs();
  };

  return (
    <Container
      maxWidth='xl'
      sx={{ 
        py: 4, 
        bgcolor: 'grey.50', 
        minHeight: '100vh'
      }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant='h4'
          component='h1'
          align='center'
          gutterBottom
          sx={{ 
            color: 'primary.main',
            fontWeight: 600,
            mb: 1
          }}>
          System Activity Logs
        </Typography>
        <Typography
          variant='body1'
          align='center'
          color='text.secondary'
          sx={{ mb: 3 }}>
          Monitor system activities, errors, and user interactions
        </Typography>
      </Box>

      <Paper
        elevation={2}
        sx={{ 
          p: 3,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        }}>
        {/* Filter Controls */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 3,
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <TextField
            placeholder='Search logs by message, URL, or user...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant='outlined'
            size='small'
            sx={{ 
              flex: 1, 
              minWidth: '300px',
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              }
            }}
          />
          <FormControl
            size='small'
            sx={{ minWidth: 150 }}>
            <InputLabel>Log Level</InputLabel>
            <Select
              value={levelFilter}
              label='Log Level'
              onChange={(e) => setLevelFilter(e.target.value)}>
              <MenuItem value='all'>All Levels</MenuItem>
              <MenuItem value='info'>Info</MenuItem>
              <MenuItem value='warn'>Warning</MenuItem>
              <MenuItem value='error'>Error</MenuItem>
              <MenuItem value='success'>Success</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title="Refresh logs">
            <IconButton 
              onClick={handleRefresh}
              color="primary"
              disabled={loading}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                '&:disabled': {
                  bgcolor: 'grey.300',
                }
              }}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Error Display */}
        {error && (
          <Alert 
            severity='error'
            sx={{ mb: 3 }}
            action={
              <IconButton
                color="inherit"
                size="small"
                onClick={handleRefresh}>
                <Refresh fontSize="small" />
              </IconButton>
            }>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center', 
            p: 6
          }}>
            <CircularProgress size={40} sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Loading system logs...
            </Typography>
          </Box>
        ) : logs.length === 0 ? (
          <Alert 
            severity='info'
            sx={{ 
              textAlign: 'center',
              py: 4
            }}>
            <Typography variant="h6" gutterBottom>
              No logs found
            </Typography>
            <Typography variant="body2">
              {searchTerm || levelFilter !== 'all' 
                ? 'Try adjusting your search criteria or filters.'
                : 'System logs will appear here when activities are logged.'}
            </Typography>
          </Alert>
        ) : (
          <>
            {/* Results Summary */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {logs.length} of {totalPages * limit} logs
                {searchTerm && ` matching "${searchTerm}"`}
                {levelFilter !== 'all' && ` with level "${levelFilter}"`}
              </Typography>
            </Box>

            {/* Logs Table */}
            <TableContainer sx={{ 
              maxHeight: '70vh',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1
            }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ 
                      bgcolor: 'grey.50',
                      fontWeight: 600,
                      minWidth: 180
                    }}>
                      Timestamp
                    </TableCell>
                    <TableCell sx={{ 
                      bgcolor: 'grey.50',
                      fontWeight: 600,
                      minWidth: 100
                    }}>
                      Level
                    </TableCell>
                    <TableCell sx={{ 
                      bgcolor: 'grey.50',
                      fontWeight: 600,
                      minWidth: 250
                    }}>
                      Message
                    </TableCell>
                    <TableCell sx={{ 
                      bgcolor: 'grey.50',
                      fontWeight: 600,
                      minWidth: 80
                    }}>
                      Method
                    </TableCell>
                    <TableCell sx={{ 
                      bgcolor: 'grey.50',
                      fontWeight: 600,
                      minWidth: 200
                    }}>
                      URL
                    </TableCell>
                    <TableCell sx={{ 
                      bgcolor: 'grey.50',
                      fontWeight: 600,
                      minWidth: 120
                    }}>
                      User
                    </TableCell>
                    <TableCell sx={{ 
                      bgcolor: 'grey.50',
                      fontWeight: 600,
                      minWidth: 120
                    }}>
                      IP Address
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow
                      key={log._id}
                      hover
                      sx={{
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                        '&:nth-of-type(odd)': {
                          bgcolor: 'grey.25',
                        }
                      }}>
                      <TableCell sx={{ fontSize: '0.875rem' }}>
                        {formatTimestamp(log.timestamp)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={log.level?.toUpperCase() || 'UNKNOWN'}
                          color={getLevelColor(log.level)}
                          size='small'
                          variant='filled'
                          sx={{ 
                            fontWeight: 600,
                            minWidth: 70
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ 
                        maxWidth: 250,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        <Tooltip title={log.message} placement="top">
                          <span>{log.message || 'No message'}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={log.method || 'N/A'}
                          variant="outlined"
                          size="small"
                          color={log.method ? 'primary' : 'default'}
                        />
                      </TableCell>
                      <TableCell sx={{ 
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontFamily: 'monospace',
                        fontSize: '0.8rem'
                      }}>
                        <Tooltip title={log.url} placement="top">
                          <span>{log.url || 'N/A'}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {log.user || 'Anonymous'}
                      </TableCell>
                      <TableCell sx={{ 
                        fontFamily: 'monospace',
                        fontSize: '0.8rem'
                      }}>
                        {log.ip || 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* Pagination */}
        {!loading && logs.length > 0 && totalPages > 1 && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            mt: 3,
            gap: 2
          }}>
            <Typography variant="body2" color="text.secondary">
              Page {page} of {totalPages}
            </Typography>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color='primary'
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': {
                  '&:hover': {
                    bgcolor: 'primary.light',
                    color: 'white',
                  }
                }
              }}
            />
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default LogManagement;
