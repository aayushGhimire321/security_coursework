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
import { getAllLogsApi } from '../../../apis/Api';

const LogManagement = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching logs with params:', { page, limit, searchTerm, levelFilter });
      const response = await getAllLogsApi(
        page,
        limit,
        searchTerm,
        levelFilter
      );
      console.log('Raw API response:', response);
      console.log('Logs received:', response.data.logs);
      console.log('Total pages:', response.data.totalPages);
      
      setLogs(response.data.logs || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      console.error('Error fetching logs:', err);
      console.error('Error details:', err.response?.data);
      setError('Failed to fetch logs. Please try again.');
    } finally {
      setLoading(false);
    }
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
