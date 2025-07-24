// App.js
import { ThemeProvider, createTheme } from '@mui/material';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BarChart from './components/Barchart';
import FooterB from './components/Footer';
import Navbar from './components/Navbar';
import AboutUs from './pages/about_us/AboutUs';
import AdminDashboard from './pages/admin/admin_dashboard/AdminDashboard';
import BookingManagement from './pages/admin/booking_management/BookingManagement';
import CustomerManagement from './pages/admin/customer_management/CustomerManagament';
import LogManagement from './pages/admin/LogManagement/LogManagement';
import MovieManagement from './pages/admin/movie_managment/MovieManagement';
import ShowManagement from './pages/admin/shows/ShowManagement';
import UpdateMovie from './pages/admin/update_movie/UpdateMovie';
import UserFeedbacks from './pages/admin/users_feedbacks/UserFeedbacks';
import ComingSoon from './pages/coming_soon/ComingSoon';
import ContactUs from './pages/contact_us/ContactUs';
import Homepage from './pages/homepage/Homepage';
import Login from './pages/login/Login';
import BuyTickets from './pages/movie/buy_movie_tickets/BuyTickets';
import PaymentSuccess from './pages/payment_success/PaymentSuccess';
import Profile from './pages/profile/Profile';
import Register from './pages/register/Register';
import Tickets from './pages/tickets/Tickets';
import ProtectedRoute from './protected_routes/ProtectedRoute';

const theme = createTheme({
  palette: {
    primary: {
      main: '#007bff',
    },
    secondary: {
      main: '#ffffff',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <ToastContainer />
        <Routes>
          {/* Public Routes */}
          <Route
            path='/homepage'
            element={<Homepage />}
          />
          <Route
            path='/login'
            element={<Login />}
          />
          <Route
            path='/register'
            element={<Register />}
          />
          <Route
            path='/aboutUs'
            element={<AboutUs />}
          />
          <Route
            path='/contactUs'
            element={<ContactUs />}
          />
          <Route
            path='/coming-soon'
            element={<ComingSoon />}
          />

          {/* Protected User Routes */}
          <Route
            path='/user/*'
            element={
              <ProtectedRoute allowedRoles={['user', 'admin']}>
                <Routes>
                  <Route
                    path='profile'
                    element={<Profile />}
                  />
                  <Route
                    path='tickets'
                    element={<Tickets />}
                  />
                  <Route
                    path='payment/success'
                    element={<PaymentSuccess />}
                  />
                  <Route
                    path='movie/buyTickets/:id'
                    element={<BuyTickets />}
                  />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Movie Routes */}
          <Route
            path='/movie/buyTickets/:id'
            element={
              <ProtectedRoute allowedRoles={['user', 'admin']}>
                <BuyTickets />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path='/admin/*'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Routes>
                  <Route
                    path='dashboard'
                    element={<AdminDashboard />}
                  />
                  <Route
                    path='movieManagement'
                    element={<MovieManagement />}
                  />
                  <Route
                    path='showManagement'
                    element={<ShowManagement />}
                  />
                  <Route
                    path='userFeedbacks'
                    element={<UserFeedbacks />}
                  />
                  <Route
                    path='customerManagement'
                    element={<CustomerManagement />}
                  />
                  <Route
                    path='bookingManagement'
                    element={<BookingManagement />}
                  />
                  <Route
                    path='logManagement'
                    element={<LogManagement />}
                  />
                  <Route
                    path='movies/update/:id'
                    element={<UpdateMovie />}
                  />
                  <Route
                    path='analytics'
                    element={<BarChart />}
                  />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route
            path='/'
            element={
              <Navigate
                to='/homepage'
                replace
              />
            }
          />

          {/* Catch-all route for 404 */}
          <Route
            path='*'
            element={
              <Navigate
                to='/homepage'
                replace
              />
            }
          />
        </Routes>
        <FooterB />
      </Router>
    </ThemeProvider>
  );
}

export default App;
