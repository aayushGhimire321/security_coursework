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
import UpdateShow from './pages/admin/update_show/UpdateShow';
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
import AdminLayout from './pages/admin/AdminLayout.jsx';

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
          <Route path='/homepage' element={<Homepage />} />
          <Route path='/movies' element={<Homepage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/aboutUs' element={<AboutUs />} />
          <Route path='/about' element={<AboutUs />} />
          <Route path='/contactUs' element={<ContactUs />} />
          <Route path='/contact' element={<ContactUs />} />
          <Route path='/coming-soon' element={<ComingSoon />} />
          
          {/* Payment Success Routes - Must be accessible without /user prefix for Khalti redirects */}
          <Route path='/payment/success' element={<ProtectedRoute allowedRoles={['user', 'admin']}><PaymentSuccess /></ProtectedRoute>} />
          <Route path='/payment-success' element={<ProtectedRoute allowedRoles={['user', 'admin']}><PaymentSuccess /></ProtectedRoute>} />

          {/* Protected User Routes */}
          <Route path='/user/*' element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
            <Route path='profile' element={<Profile />} />
            <Route path='tickets' element={<Tickets />} />
            <Route path='my-tickets' element={<Tickets />} />
            <Route path='bookings' element={<Tickets />} />
            <Route path='movie/buyTickets/:id' element={<BuyTickets />} />
            <Route path='movie/buy-tickets/:id' element={<BuyTickets />} />
            <Route path='movie/book/:id' element={<BuyTickets />} />
            <Route path='buyTickets/:id' element={<BuyTickets />} />
            <Route path='buy-tickets/:id' element={<BuyTickets />} />
            <Route path='book-tickets/:id' element={<BuyTickets />} />
            <Route path='book/:id' element={<BuyTickets />} />
          </Route>

          {/* Additional Public Buy Tickets Routes for easier access */}
          <Route path='/buyTickets/:id' element={<ProtectedRoute allowedRoles={['user', 'admin']}><BuyTickets /></ProtectedRoute>} />
          <Route path='/buy-tickets/:id' element={<ProtectedRoute allowedRoles={['user', 'admin']}><BuyTickets /></ProtectedRoute>} />
          <Route path='/book-tickets/:id' element={<ProtectedRoute allowedRoles={['user', 'admin']}><BuyTickets /></ProtectedRoute>} />
          <Route path='/book/:id' element={<ProtectedRoute allowedRoles={['user', 'admin']}><BuyTickets /></ProtectedRoute>} />
          <Route path='/movie/:id/buy' element={<ProtectedRoute allowedRoles={['user', 'admin']}><BuyTickets /></ProtectedRoute>} />
          <Route path='/movie/:id/book' element={<ProtectedRoute allowedRoles={['user', 'admin']}><BuyTickets /></ProtectedRoute>} />
          <Route path='/movie/:id/tickets' element={<ProtectedRoute allowedRoles={['user', 'admin']}><BuyTickets /></ProtectedRoute>} />

          {/* Protected Admin Routes with Layout */}
          <Route path='/admin' element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
            <Route path='' element={<AdminDashboard />} />
            <Route path='dashboard' element={<AdminDashboard />} />
            <Route path='movieManagement' element={<MovieManagement />} />
            <Route path='movie-management' element={<MovieManagement />} />
            <Route path='movies' element={<MovieManagement />} />
            <Route path='showManagement' element={<ShowManagement />} />
            <Route path='show-management' element={<ShowManagement />} />
            <Route path='shows' element={<ShowManagement />} />
            <Route path='shows/edit/:id' element={<UpdateShow />} />
            <Route path='shows/update/:id' element={<UpdateShow />} />
            <Route path='userFeedbacks' element={<UserFeedbacks />} />
            <Route path='user-feedbacks' element={<UserFeedbacks />} />
            <Route path='feedbacks' element={<UserFeedbacks />} />
            <Route path='customerManagement' element={<CustomerManagement />} />
            <Route path='customer-management' element={<CustomerManagement />} />
            <Route path='customers' element={<CustomerManagement />} />
            <Route path='users' element={<CustomerManagement />} />
            <Route path='bookingManagement' element={<BookingManagement />} />
            <Route path='booking-management' element={<BookingManagement />} />
            <Route path='bookingsManagement' element={<BookingManagement />} />
            <Route path='bookings' element={<BookingManagement />} />
            <Route path='logManagement' element={<LogManagement />} />
            <Route path='log-management' element={<LogManagement />} />
            <Route path='activityLogs' element={<LogManagement />} />
            <Route path='activity-logs' element={<LogManagement />} />
            <Route path='logs' element={<LogManagement />} />
            <Route path='movies/update/:id' element={<UpdateMovie />} />
            <Route path='movies/edit/:id' element={<UpdateMovie />} />
            <Route path='analytics' element={<BarChart />} />
            <Route path='reports' element={<BarChart />} />
            <Route path='stats' element={<BarChart />} />
          </Route>

          {/* Default Route */}
          <Route path='/' element={<Navigate to='/homepage' replace />} />

          {/* Catch-all route */}
          <Route path='*' element={<Navigate to='/homepage' replace />} />
        </Routes>
        <FooterB />
      </Router>
    </ThemeProvider>
  );
}

export default App;
