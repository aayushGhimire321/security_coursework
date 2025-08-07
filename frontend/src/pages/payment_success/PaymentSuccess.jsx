import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Error, Receipt } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Typography,
  Chip,
  Divider
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { completeKhaltiPaymentApi } from '../../apis/Api';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Get payment parameters from URL
        const pidx = queryParams.get('pidx');
        const status = queryParams.get('status');
        const transactionId = queryParams.get('transaction_id');
        const amount = queryParams.get('total_amount');
        const productId = queryParams.get('purchase_order_id');

        console.log('🔄 Processing Khalti payment return:', {
          pidx, status, transactionId, amount, productId
        });
        console.log('🔑 Payment processed via Khalti Portal: Movie Ticketing system');

        // Get pending payment details from localStorage
        const pendingPayment = localStorage.getItem('pendingPayment');
        const paymentInfo = pendingPayment ? JSON.parse(pendingPayment) : null;

        if (!pidx || !status) {
          throw new Error('Missing payment parameters from Khalti');
        }

        if (status !== 'Completed') {
          setPaymentStatus('failed');
          setError(`Payment ${status.toLowerCase()}. Please try again.`);
          setLoading(false);
          return;
        }

        // Complete the payment verification
        const verificationData = {
          pidx,
          amount: parseInt(amount),
          productId,
          transactionId
        };

        console.log('📡 Verifying payment with backend...', verificationData);
        const result = await completeKhaltiPaymentApi(verificationData);

        console.log('✅ Payment verification successful:', result.data);

        setPaymentStatus('success');
        setPaymentDetails({
          ...paymentInfo,
          transactionId,
          amount: parseInt(amount) / 100, // Convert from paisa to rupees
          verificationResult: result.data
        });

        // Clear pending payment
        localStorage.removeItem('pendingPayment');

      } catch (error) {
        console.error('❌ Payment processing error:', error);
        setPaymentStatus('failed');
        setError(error.response?.data?.message || error.message || 'Payment verification failed');
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [queryParams]);

  if (loading) {
    return (
      <Container sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h6" gutterBottom>
            Processing Payment...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please wait while we verify your Khalti payment
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Card elevation={5} sx={{ maxWidth: 600 }}>
        <CardContent sx={{ p: 4 }}>
          {paymentStatus === 'success' ? (
            <Box sx={{ textAlign: 'center' }}>
              <CheckCircleIcon color='success' sx={{ fontSize: 80, mb: 2 }} />
              <Typography variant="h4" gutterBottom color="success.main">
                Payment Successful!
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Your movie tickets have been booked successfully via Khalti.
              </Typography>

              {paymentDetails && (
                <Box sx={{ textAlign: 'left', mb: 3 }}>
                  <Divider sx={{ mb: 2 }}>
                    <Chip label="Booking Details" />
                  </Divider>
                  
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Movie:</strong> {paymentDetails.movie}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Show Date:</strong> {new Date(paymentDetails.show?.showDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Show Time:</strong> {paymentDetails.show?.showTime}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Seats:</strong> {paymentDetails.seats?.map(s => s.seatNo).join(', ')}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Total Amount:</strong> Rs. {paymentDetails.amount}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    <strong>Transaction ID:</strong> {paymentDetails.transactionId}
                  </Typography>

                  <Divider sx={{ mb: 2 }}>
                    <Chip label="Payment via Khalti" color="primary" />
                  </Divider>
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<Receipt />}
                  onClick={() => navigate('/user/tickets')}
                >
                  View My Tickets
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/homepage')}
                >
                  Back to Home
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <Error sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom color="error.main">
                Payment Failed
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                We couldn't process your Khalti payment. Please try again.
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
                  <Typography variant="body2">
                    <strong>Error:</strong> {error}
                  </Typography>
                </Alert>
              )}

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  onClick={() => navigate(-1)}
                >
                  Try Again
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/homepage')}
                >
                  Back to Home
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default PaymentSuccess;
