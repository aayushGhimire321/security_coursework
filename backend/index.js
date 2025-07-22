// Importing the packages (express)
const express = require('express');
const connectDatabase = require('./database/database');
const dotenv = require('dotenv');
const https = require('https');
const cors = require('cors');
const fs = require('fs');
const accessFormData = require('express-fileupload');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const session = require('express-session');
const morgan = require('morgan');

// Load environment variables from .env file
dotenv.config();

// Creating an express app
const app = express();

// morgan middleware
app.use(morgan('dev'));

// Configure CORS policy
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Block the request
    }
  },
  credentials: true, // Allow cookies and authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Restrict allowed methods
  optionsSuccessStatus: 200, // For older browsers
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Express JSON Config
app.use(express.json());

// Define a rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: {
    status: 'fail',
    message:
      'Too many requests from this IP, please try again after 15 minutes.',
  },
  headers: true, // Include rate limit info in headers
});

// Apply the rate limit to all routes
app.use(limiter);

// Middleware to set security headers for clickjacking protection
app.use((req, res, next) => {
  // X-Frame-Options prevents the page from being embedded in an iframe
  res.setHeader('X-Frame-Options', 'SAMEORIGIN'); // or 'DENY'

  // Content-Security-Policy's frame-ancestors directive to control who can embed your app
  res.setHeader('Content-Security-Policy', "frame-ancestors 'self'");

  next();
});

// Use Helmet middleware
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

// apply cookie parser
app.use(cookieParser()); // Enable cookie parsing

// Enable file upload
// Enable file upload
app.use(
  accessFormData({
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 2MB
    abortOnLimit: true, // Abort upload if file exceeds size limit
    safeFileNames: true, // Sanitize filenames automatically
    preserveExtension: true, // Preserve file extensions
    allowedTypes: ['image/jpeg', 'image/png'],
  })
);

// apply mongo sanitize
app.use(mongoSanitize());

// apply xss clean
app.use(xss());

// Connecting to database
connectDatabase();

// File public
app.use(express.static('./public'));

// Configuring session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    cookie: {
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      httpOnly: false, // Prevents JavaScript access to cookies
      sameSite: 'strict', // Protects against CSRF
      maxAge: 1000 * 60 * 60 * 24 * 10, // 10 days
    },
  })
);

// Defining the port
const PORT = process.env.PORT || 5000;

// Test route
app.get('/test', (req, res) => {
  res.send('Test API is working!.....');
});

// Configuring routes for User and Movie
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/movie', require('./routes/movieRoutes'));
app.use('/api/shows', require('./routes/showsRoutes'));
app.use('/api/seat', require('./routes/seatRoutes'));
app.use('/api/booking', require('./routes/bookingRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/payment', require('./routes/khaltiRoutes'));

// Configuring routes for Contact Us
app.use('/api/contact', require('./routes/contactRoutes'));

// SSL/TLS options for HTTPS
const options = {
  key: fs.readFileSync('./certificate/server.key'), // Path to your private key
  cert: fs.readFileSync('./certificate/server.crt'), // Path to your certificate
};

// Starting the HTTPS server
https.createServer(options, app).listen(PORT, () => {
  console.log(`Secure server is running on https://localhost:${PORT}`);
});

module.exports = app;
