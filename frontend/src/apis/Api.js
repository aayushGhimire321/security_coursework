import axios from 'axios';

// Create an Axios instance
const Api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://localhost:5000', // Use environment variable for base URL
  withCredentials: true, // Include cookies in requests
  timeout: 10000, // 10 second timeout
});

// Log the API base URL for debugging
console.log('API Base URL:', Api.defaults.baseURL);

Api.interceptors.request.use(
  async (config) => {
    // Example: Get the token from local storage or any secure storage
    const token = localStorage.getItem('token'); // Replace with your token retrieval logic

    if (token) {
      // Attach token to the Authorization header
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle errors before sending the request
    return Promise.reject(error);
  }
);

Api.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response;
  },
  (error) => {
    // Enhanced error logging
    console.error('API Error:', {
      message: error.message,
      code: error.code,
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });

    // Handle errors safely with optional chaining
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login page
      localStorage.removeItem('token');
      // Optional: You can add window.location = '/login' here if you want to force logout
    }
    
    // Add network error handling
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      error.message = 'Unable to connect to the server. Please check your connection and ensure the backend server is running.';
    }
    
    return Promise.reject(error);
  }
);

// API Endpoints

export const registerUserApi = (data) => Api.post('/api/user/create', data);
export const loginUserApi = (data) => Api.post('/api/user/login', data);
export const createMovieApi = (data) => Api.post('/api/movie/create', data);
export const getAllMoviesApi = () => Api.get('/api/movie/get_all_movies');
export const getSingleMovieApi = (id) =>
  Api.get(`/api/movie/get_single_movie/${id}`);
export const deleteMovieApi = (id) =>
  Api.delete(`/api/movie/delete_movie/${id}`);
export const updateMovieApi = (id, data) =>
  Api.put(`/api/movie/update_movie/${id}`, data);
export const pagination = (page, limit) =>
  Api.get(`/api/movie/pagination/?page=${page}&limit=${limit}`);
export const getMovieCount = () => Api.get('/api/movie/get_movies_count');
export const buyTicketsApi = (data) => Api.post(`/api/booking/create`, data);
export const addShowsApi = (data) => Api.post('/api/shows/create', data);
export const getAllShowsApi = () => Api.get('/api/shows/get_all');
export const getShowByMovieIdApi = (id) =>
  Api.get(`/api/shows/get_by_movie/${id}`);
export const getSeatsByShowIdApi = (id) =>
  Api.get(`/api/seat/get_seats_by_show/${id}`);
export const makeSeatUnavailableApi = (data) =>
  Api.put('/api/seat/setAvailable', data);
export const createBookingApi = (data) => Api.post('/api/booking/create', data);
export const getAllBookingsApi = () => Api.get('/api/booking/get_all_bookings');
export const getBookingsByUserApi = () =>
  Api.get('/api/booking/get_bookings_by_user');
export const forgotPasswordApi = (data) =>
  Api.post('/api/user/forgot-password', data);
export const resetPasswordApi = (data) =>
  Api.post('/api/user/reset-password', data);
export const getSingleProfileApi = () =>
  Api.get('/api/user/get_single_profile');
export const getAllProfilesApi = () => Api.get('/api/user/get_all_users');
export const deleteProfileApi = (id) =>
  Api.delete(`/api/user/delete_profile/${id}`);
export const updateProfileApi = (data) =>
  Api.put('/api/user/update_profile', data);
export const initializeKhaltiApi = (data) =>
  Api.post('/api/payment/initialize_khalti', data);
// complete-khalti-payment
export const completeKhaltiPaymentApi = (data) =>
  Api.post('/api/payment/complete-khalti-payment', data);
export const contactUsApi = (data) => Api.post('/api/contact/create', data);
export const getContactMessagesApi = () => Api.get('/api/contact/get_contact');
export const getDashboardStatsApi = () => Api.get('/api/admin/dashboard_stats');
export const getAllLogsApi = (page, limit, searchTerm, filter) =>
  Api.get(
    `/api/admin/get_all_logs?page=${page}&limit=${limit}&searchTerm=${searchTerm}&filter=${filter}`
  );

// verify_register_otp
export const verifyRegisterOtpApi = (data) =>
  Api.put('/api/user/verify_register_otp', data);

// verify_login_otp
export const verifyLoginOtpApi = (data) =>
  Api.put('/api/user/verify_login_otp', data);

// upload_profile_picture
export const uploadProfilePictureApi = (data) =>
  Api.post('/api/user/upload_profile_picture', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

// logout
export const logoutApi = () => Api.post('/api/user/logout');

// delete user
export const deleteUserApi = () => Api.delete(`/api/user/delete`);