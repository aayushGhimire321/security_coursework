
# 🎬 FilmSathi - Movie Ticketing System

A comprehensive **Movie Ticketing System** built with the **MERN Stack (MongoDB, Express.js, React, Node.js)**. This security-focused project provides a secure, scalable, and responsive platform for users to browse movies, book tickets, and make payments online. It includes robust admin controls, analytics, comprehensive security features, and a seamless booking experience.

## 📑 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Frontend Overview](#frontend-overview)
- [Backend Overview](#backend-overview)
- [Security Features](#security-features)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Notes](#notes)

## ✅ Features

### 🔐 **Authentication & Security**
- **Multi-Factor Authentication (MFA)** with OTP verification
- **Device Recognition & Management** 
- **Password Strength Validation** using zxcvbn
- **Account Lockout Protection** against brute force attacks
- **JWT Token-based Authentication** with secure session management
- **Google reCAPTCHA Integration** for bot protection
- **Password History Tracking** (prevents reuse of last 5 passwords)
- **Password Expiration** (90-day rotation policy)

### 👥 **User Management**
- **Role-Based Access Control** (User & Admin)
- **User Profile Management** with encrypted data storage
- **Profile Picture Upload** with file validation
- **Password Reset** via email OTP
- **Account Deletion** functionality

### 🎞️ **Movie & Show Management**
- **Movie CRUD Operations** (Create, Read, Update, Delete)
- **Show Scheduling** with date and time management
- **Movie Ratings & Reviews** system
- **Coming Soon** movies section
- **Dynamic Movie Categories** and filtering

### 🪑 **Booking System**
- **Interactive Seat Selection** interface
- **Real-time Seat Availability** updates
- **Booking Management** for users and admins
- **Ticket Generation** with QR codes
- **Booking History** tracking

### 💳 **Payment Integration**
- **Khalti Payment Gateway** integration
- **Secure Payment Processing** with verification
- **Payment History** and receipts
- **Payment Status Tracking** (pending, success, failed)

### 📊 **Admin Dashboard**
- **Real-time System Analytics** with interactive charts and live data
- **Comprehensive Log Management** with database-connected activity monitoring
- **Advanced Search & Filtering** - Filter logs by level, user, time, and content
- **User Management** (view, delete users with activity tracking)
- **Booking Management** (view all bookings with detailed analytics)
- **Movie Management** (add, edit, delete movies with logging)
- **Show Management** (schedule shows with conflict detection)
- **Security Monitoring** - Complete audit trail with authentication events
- **System Health Dashboard** - Resource monitoring and performance metrics
- **User Feedback Management** with categorization and response tracking
- **Data Visualization** - Charts, graphs, and statistical representations
- **Export Functionality** - Download reports and logs in various formats

### 🔒 **Security Features**
- **HTTPS/SSL** encryption for all communications
- **Input Sanitization** to prevent XSS and injection attacks
- **MongoDB Sanitization** to prevent NoSQL injection
- **Rate Limiting** to prevent abuse
- **Security Headers** (Helmet.js integration)
- **CORS Protection** with whitelist configuration
- **Session Security** with secure cookies
- **Comprehensive Logging** for security auditing

### 📱 **User Experience**
- **Fully Responsive Design** (mobile, tablet, desktop)
- **Material-UI Components** for modern interface
- **Real-time Notifications** using React Toastify
- **Loading States** and error handling
- **Accessibility Features** with ARIA compliance
- **Blue Theme Consistency** across all pages and components
- **Interactive Trailer Integration** - YouTube trailer buttons with clean design
- **Enhanced Navigation** - Context-aware navbar with role-based features
- **Form Validation** - Real-time feedback with visual indicators
- **Error Recovery** - User-friendly error messages with retry options

## 🛠 Technology Stack

### Frontend
- **React 18.3.1** - Modern UI library with concurrent features
- **Material-UI (MUI) 6.4.0** - Component library and design system
- **React Router Dom 6.23.1** - Client-side routing with nested routes
- **Axios 1.7.9** - HTTP client for API requests with interceptors
- **React Toastify 10.0.5** - Toast notifications and user feedback
- **Khalti Checkout Web 2.2.0** - Payment gateway integration
- **React Google reCAPTCHA 3.1.0** - Bot protection with visual feedback
- **zxcvbn 4.4.2** - Password strength validation with scoring
- **DOMPurify 3.2.3** - XSS protection and content sanitization
- **Recharts 2.12.7** - Data visualization for admin dashboard
- **React Icons 5.2.1** - Comprehensive icon library
- **JWT Decode 4.0.0** - Token handling and validation
- **Crypto-JS 4.2.0** - Client-side encryption utilities

### Backend
- **Node.js** with **Express.js 4.19.2** - Server framework
- **MongoDB** with **Mongoose 8.9.5** - Database and ODM
- **JWT (jsonwebtoken 9.0.2)** - Authentication tokens
- **bcrypt 5.1.1** - Password hashing
- **Helmet 8.0.0** - Security headers
- **CORS 2.8.5** - Cross-origin resource sharing
- **Express Rate Limit 7.5.0** - Rate limiting
- **Morgan 1.10.0** - HTTP request logging
- **Nodemailer 6.10.0** - Email service
- **crypto-js 4.2.0** - Data encryption
- **zxcvbn 4.4.2** - Password strength validation
- **express-mongo-sanitize 2.2.0** - NoSQL injection prevention
- **xss-clean 0.1.4** - XSS protection

### Security & Development Tools
- **HTTPS/SSL** certificates for secure communication
- **Jest 29.7.0** - Testing framework
- **Supertest 7.0.0** - API testing
- **ESLint 9.19.0** - Code quality
- **Snyk** - Security vulnerability scanning
- **Nodemon 3.1.0** - Development server

## 🛠 Installation

### � Prerequisites

- [Node.js (v14 or higher)](https://nodejs.org/)
- [MongoDB (local or MongoDB Atlas)](https://www.mongodb.com/)
- [Khalti API Credentials](https://khalti.com/)
- [Google reCAPTCHA Keys](https://www.google.com/recaptcha/)
- A modern web browser

### 📁 Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database
   MONGODB_LOCAL=mongodb://localhost:27017/filmsathi
   MONGODB_CLOUD=your_cloud_mongodb_connection_string
   
   # JWT Configuration
   JWT_SECRET=your_super_secure_jwt_secret_key
   JWT_EXPIRY=1d
   SESSION_SECRET=your_session_secret_key
   
   # Payment Gateway
   KHALTI_SECRET_KEY=your_khalti_secret_key
   KHALTI_GATEWAY_URL=https://khalti.com
   
   # Email Service
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_app_password
   
   # Security
   ALLOWED_ORIGINS=https://localhost:3000,http://localhost:3000
   ENCRYPTION_KEY=your_32_character_encryption_key
   RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
   ```

4. Start the backend server:
   ```bash
   npm start
   ```
   The backend will run on: `https://localhost:5000`

### 🌐 Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```env
   # Frontend Configuration
   REACT_APP_API_URL=https://localhost:5000
   REACT_APP_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
   GENERATE_SOURCEMAP=false
   ```

4. Start the development server:
   ```bash
   npm start
   ```
   The frontend will run on: `https://localhost:3000`



## 💻 Frontend Overview

The frontend is built with **React 18** and provides a modern, responsive user interface with comprehensive security features.

### 🎨 **UI Components & Styling**
- **Material-UI (MUI)** - Modern design system with consistent blue theming
- **Responsive Design** - Mobile-first approach with breakpoint-based layouts
- **Custom Components** - Reusable MovieCard, AdminNavbar, Footer components
- **Loading States** - Skeleton loaders and progress indicators with user feedback
- **Error Boundaries** - Graceful error handling throughout the application
- **Glassmorphism Effects** - Modern visual design with gradient backgrounds
- **Interactive Elements** - Hover states, smooth transitions, and animations
- **Accessibility Features** - ARIA labels, keyboard navigation, screen reader support

### 🛣️ **Routing & Navigation**
- **React Router v6** - Client-side routing with nested and protected routes
- **Protected Routes** - Role-based route protection (User/Admin) with authentication
- **Dynamic Navigation** - Context-aware navbar based on user role and authentication
- **Route Guards** - Authentication verification and permission checking
- **Breadcrumb Navigation** - Clear navigation paths for complex admin workflows

### 🔐 **Frontend Security Features**
- **Input Sanitization** - DOMPurify integration for comprehensive XSS prevention
- **Token Management** - Secure JWT storage with automatic renewal and validation
- **Password Strength** - Real-time password validation with zxcvbn scoring
- **reCAPTCHA Integration** - Google reCAPTCHA v2 with visual feedback and error handling
- **HTTPS Enforcement** - SSL certificate configuration for secure communication
- **Content Security Policy** - Implementation of CSP headers for enhanced security

### 🎭 **Enhanced User Experience**
- **Real-time Notifications** - Toast messages with contextual feedback and actions
- **Form Validation** - Client-side validation with real-time error states and guidance
- **Progressive Loading** - Lazy loading and code splitting for optimal performance
- **Offline Support** - Service worker implementation for offline functionality
- **Animation Framework** - Smooth transitions and micro-interactions for better UX

### 📂 **Key Frontend Structure**
```
src/
├── components/          # Reusable UI components
│   ├── AdminNavbar.jsx  # Admin navigation
│   ├── Navbar.jsx       # User navigation  
│   ├── MovieCard.jsx    # Movie display component
│   ├── Footer.jsx       # Application footer
│   └── VerificationModel.jsx  # OTP verification modal
├── pages/              # Application pages
│   ├── homepage/       # Landing page with hero section and featured content
│   ├── login/          # Authentication with CAPTCHA integration
│   ├── register/       # User registration with email verification
│   ├── profile/        # User profile management with picture upload
│   ├── movie/          # Movie browsing and ticket booking interface
│   ├── admin/          # Admin dashboard and management tools
│   │   ├── admin_dashboard/    # Real-time analytics and statistics
│   │   ├── LogManagement/      # System activity logs with filtering
│   │   ├── movie_management/   # Movie CRUD operations
│   │   ├── booking_management/ # Booking oversight and analytics
│   │   └── customer_management/ # User account management
│   ├── about_us/       # About page with modern design
│   ├── contact_us/     # Contact form with validation
│   └── coming_soon/    # Movie previews with trailer integration
├── protected_routes/   # Route protection logic
├── apis/              # API integration layer
└── assets/            # Static assets and images
```

## 🧪 Backend Overview

The backend is built with **Express.js** and implements enterprise-level security practices and scalable architecture.

### 🗄️ **Database Architecture**
- **MongoDB** with Mongoose ODM for flexible document storage
- **Data Encryption** - Sensitive data encrypted using crypto-js
- **Schema Validation** - Mongoose schemas with built-in validation
- **Indexing** - Optimized database queries with proper indexing

### 🔒 **Security Implementation**
- **Multi-Layer Authentication** - JWT + Session-based auth
- **Password Security** - bcrypt hashing with salt rounds
- **Input Validation** - express-validator for request validation
- **Rate Limiting** - Protection against brute force attacks
- **Security Headers** - Helmet.js for various security headers
- **CORS Configuration** - Whitelist-based cross-origin protection
- **MongoDB Sanitization** - Prevention of NoSQL injection attacks
- **XSS Protection** - Content sanitization middleware

### 📊 **API Features**
- **RESTful Design** - Standard HTTP methods and status codes
- **Error Handling** - Comprehensive error handling with logging
- **Request Logging** - Morgan middleware for request tracking
- **File Upload** - Secure file handling with validation
- **Email Services** - Nodemailer for OTP and notifications

### 🏗️ **Backend Architecture**
```
backend/
├── controllers/        # Business logic
│   ├── userController.js     # User management
│   ├── movieController.js    # Movie operations
│   ├── bookingController.js  # Booking system
│   ├── paymentController.js  # Payment processing
│   └── adminController.js    # Admin operations
├── models/            # Database schemas
│   ├── userModel.js          # User schema with security fields
│   ├── movieModel.js         # Movie information
│   ├── bookingModel.js       # Booking details
│   ├── logModel.js           # System logging
│   └── paymentModel.js       # Payment records
├── routes/            # API endpoints
├── middleware/        # Custom middleware
│   └── authGuard.js          # Authentication & authorization
├── service/           # External services
│   ├── sendEmail.js          # Email service
│   ├── khaltiService.js      # Payment gateway
│   └── purify.js             # Data sanitization
├── database/          # Database connection
└── certificate/       # SSL certificates
```

### 📌 **API Endpoints Overview**

#### **Authentication APIs**
- `POST /api/user/create` - User registration with OTP
- `POST /api/user/login` - Multi-factor login
- `POST /api/user/forgot-password` - Password reset initiation
- `PUT /api/user/verify_register_otp` - Email verification
- `PUT /api/user/verify_login_otp` - Device verification

#### **User Management APIs**
- `GET /api/user/get_single_profile` - User profile
- `PUT /api/user/update_profile` - Profile updates
- `POST /api/user/upload_profile_picture` - Avatar upload
- `DELETE /api/user/delete` - Account deletion

#### **Movie & Show APIs**
- `GET /api/movie/get_all_movies` - Movie listings
- `GET /api/movie/get_single_movie/:id` - Movie details
- `GET /api/shows/get_all` - Show schedules
- `GET /api/shows/get_by_movie/:id` - Movie showtimes

#### **Booking APIs**
- `POST /api/booking/create` - Create booking
- `GET /api/booking/get_bookings_by_user` - User bookings
- `GET /api/seat/get_seats_by_show/:id` - Seat availability

#### **Payment APIs**
- `POST /api/payment/initialize_khalti` - Payment initiation
- `POST /api/payment/complete-khalti-payment` - Payment verification

#### **Admin APIs**
- `GET /api/admin/dashboard_stats` - System statistics
- `GET /api/admin/get_all_logs` - System logs
- `GET /api/user/get_all_users` - User management

## 🔐 Security Features

This project implements comprehensive security measures following industry best practices and OWASP guidelines.

### 🔑 **Authentication & Authorization**
- **JWT-based Token Management** with secure expiration policies
- **Multi-Factor Authentication (MFA)** using email OTP verification
- **Device Recognition** - Track and manage user devices
- **Session Security** - Secure HTTP-only cookies with CSRF protection
- **Role-Based Access Control (RBAC)** - User and Admin role separation
- **Account Lockout** - Protection against brute force attacks

### 🛡️ **Password Security**
- **Password Strength Validation** using zxcvbn algorithm
- **bcrypt Hashing** with configurable salt rounds
- **Password History** - Prevents reuse of last 5 passwords
- **Password Expiration** - 90-day rotation policy
- **Secure Password Reset** with time-limited OTP tokens

### 🧹 **Input Validation & Sanitization**
- **MongoDB Sanitization** - Prevention of NoSQL injection attacks
- **XSS Protection** - Input sanitization using xss-clean middleware
- **DOMPurify Integration** - Client-side XSS prevention
- **Express Validator** - Server-side input validation
- **File Upload Security** - Type validation and size limits

### 🎨 **Modern UI/UX Implementation**
- **Material-UI 6.4.0** - Complete design system with consistent theming
- **Blue Theme Consistency** - Unified color scheme (#1976d2, #1565c0, #0d47a1) across all components
- **Glassmorphism Effects** - Modern visual effects with gradient backgrounds
- **Google reCAPTCHA v2** - Visual CAPTCHA integration with status feedback
- **Responsive Design** - Mobile-first approach with breakpoint-based layouts
- **Interactive Components** - Hover states, smooth transitions, and animations

### 📊 **Enhanced Admin Dashboard**
- **Real-time System Analytics** - Live statistics with Recharts visualization
- **Comprehensive Log Management** - Database-connected activity monitoring
- **Advanced Filtering** - Search and filter logs by level, user, and time
- **User Activity Tracking** - Complete audit trail for security monitoring
- **System Health Monitoring** - Dashboard stats with refresh functionality
- **Error Handling & Recovery** - Graceful error states with retry mechanisms

### 🔄 **Complete Page Redesigns**
- **Homepage Modernization** - Hero sections with cinema branding and featured content
- **About Us Page** - Professional layout matching Contact page aesthetics
- **Contact Us Enhancement** - Modern form design with interactive validation
- **Coming Soon Section** - Movie preview cards with integrated trailer functionality
- **Authentication Pages** - Enhanced forms with real-time validation and security features

### 🌐 **Network Security**
- **HTTPS/SSL Encryption** - All communications secured with TLS
- **CORS Configuration** - Whitelist-based cross-origin protection
- **Security Headers** - Comprehensive header protection via Helmet.js
  - X-Frame-Options (Clickjacking protection)
  - X-Content-Type-Options (MIME sniffing protection)
  - Content-Security-Policy (XSS protection)
  - Strict-Transport-Security (HTTPS enforcement)

### 🚦 **Rate Limiting & Abuse Prevention**
- **Global Rate Limiting** - 100 requests per 15 minutes per IP
- **Login Rate Limiting** - 5 login attempts per 10 minutes per IP
- **Google reCAPTCHA** - Bot protection on forms
- **Request Throttling** - Prevents API abuse

### 📊 **Monitoring & Logging**
- **Comprehensive Security Logging** - All authentication events and user activities tracked
- **Real-time Activity Monitoring** - Admin dashboard for live security event monitoring
- **Database-Connected Logging** - Persistent log storage with advanced filtering capabilities
- **Error Logging** - Secure error handling without sensitive data leakage
- **Request Logging** - Morgan middleware for detailed HTTP request tracking
- **Log Management System** - Frontend interface for viewing, searching, and filtering logs
- **Audit Trail** - Complete user activity tracking for compliance and security analysis

### � **Data Protection**
- **Data Encryption** - Sensitive user data encrypted using crypto-js
- **Secure Session Management** - Express sessions with secure configuration
- **Token Security** - JWT tokens with appropriate expiration
- **Database Security** - MongoDB with authentication and encryption

### 🧪 **Security Testing**
- **Snyk Integration** - Automated vulnerability scanning
- **Security Headers Testing** - Validation of security headers
- **Authentication Testing** - Comprehensive auth flow testing
- **Input Validation Testing** - XSS and injection protection tests

## 📋 API Documentation

### Authentication Flow
```
1. User Registration → Email OTP → Account Verification
2. User Login → Device Check → Email OTP (if new device) → JWT Token
3. Password Reset → Email OTP → New Password → Account Unlock
```

### Security Headers
```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Content-Security-Policy: frame-ancestors 'self'
Strict-Transport-Security: max-age=31536000
```

### Rate Limiting Configuration
```
Global: 100 requests / 15 minutes / IP
Login: 5 attempts / 10 minutes / IP
Account Lockout: 5 failed attempts → 30 minute lock
```

## 🧪 Testing

The project includes comprehensive testing suites for both frontend and backend components.

### 🔬 **Backend Testing**
- **API Testing** - Complete API endpoint testing with Jest and Supertest
- **Authentication Testing** - Login, registration, and token validation
- **Security Testing** - Input validation and injection protection
- **Database Testing** - CRUD operations and data integrity

**Run Backend Tests:**
```bash
cd backend
npm test
```

**Test Coverage:**
- User authentication and authorization
- Movie and show management
- Booking system functionality
- Payment processing
- Admin operations
- Security middleware validation

### 🎨 **Frontend Testing**
- **Component Testing** - React component functionality with React Testing Library
- **Integration Testing** - API integration and user flows
- **Security Testing** - Input sanitization and XSS protection
- **Accessibility Testing** - ARIA compliance and keyboard navigation

**Run Frontend Tests:**
```bash
cd frontend
npm test
```

**Test Coverage:**
- User registration and login flows
- Movie browsing and ticket booking
- Profile management
- Payment integration
- Admin dashboard functionality

### 🔍 **Security Testing**
- **Vulnerability Scanning** - Snyk integration for dependency scanning
- **Penetration Testing** - Manual security testing procedures
- **Code Quality** - ESLint with security plugin integration

**Run Security Tests:**
```bash
# Backend security scan
cd backend
npm run snyk-test

# Frontend security scan  
cd frontend
npm run snyk-test
```

## 🚀 Usage

### 🔧 **Development Setup**
1. Ensure MongoDB is running (locally or through MongoDB Atlas)
2. Start the backend server: `cd backend && npm start`
3. Start the frontend server: `cd frontend && npm start`
4. Visit `https://localhost:3000` to access the application

### 👤 **User Journey**
1. **Registration** - Create account with email verification
2. **Login** - Multi-factor authentication with device recognition
3. **Browse Movies** - View current and upcoming movies
4. **Book Tickets** - Select showtimes, choose seats, make payment
5. **Manage Profile** - Update information, view booking history

### 👨‍💼 **Admin Operations**
1. **Dashboard** - View real-time system statistics and analytics with interactive charts
2. **Movie Management** - Add, edit, delete movies with comprehensive logging
3. **User Management** - Monitor user accounts, activities, and authentication events
4. **Booking Management** - View and manage all bookings with detailed analytics
5. **System Monitoring** - Access comprehensive logs with advanced filtering and search
6. **Security Oversight** - Monitor authentication events and system security status

### 🔐 **Security Best Practices**
- Use strong passwords (enforced by zxcvbn validation)
- Enable two-factor authentication via email OTP
- Regular password updates (90-day expiration)
- Monitor account activity in profile settings
- Report suspicious activities to administrators

## 📁 Project Structure

```
FilmSathi/
├── backend/                 # Express.js backend server
│   ├── controllers/         # Business logic layer
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API route definitions
│   ├── middleware/         # Custom middleware (auth, security)
│   ├── service/            # External services (email, payment)
│   ├── database/           # Database connection
│   ├── certificate/        # SSL certificates
│   ├── test/              # Backend test suites
│   └── package.json       # Backend dependencies
├── frontend/               # React.js frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── apis/          # API integration layer
│   │   ├── protected_routes/ # Route protection logic
│   │   └── assets/        # Static assets
│   ├── public/            # Public static files
│   ├── certificate/       # Frontend SSL certificates
│   └── package.json       # Frontend dependencies
├── certificate/           # Root SSL certificates
└── README.MD              # Project documentation
```

## 📌 Notes

### 🚀 **Deployment Considerations**
- Update `.env` files with production credentials before deployment
- Use services like **MongoDB Atlas**, **Render**, **Vercel**, or **Netlify** for deployment
- Ensure SSL certificates are properly configured for production
- Configure proper CORS origins for production domains
- Set up monitoring and logging in production environment

### 🔒 **Security Recommendations**
- Regularly update dependencies using `npm audit` and Snyk
- Monitor system logs for suspicious activities
- Implement regular security audits and penetration testing
- Keep SSL certificates updated
- Backup database regularly with encryption

### ⚡ **Performance Optimization**
- Use CDN for static assets in production
- Implement caching strategies (Redis for session storage)
- Optimize database queries with proper indexing
- Use compression middleware for API responses
- Implement lazy loading for large components

### 🌐 **Browser Compatibility**
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design tested on various devices
- Progressive Web App (PWA) capabilities
- Offline functionality for critical features

### 📱 **Mobile Application**
- Responsive design works on all mobile devices
- Touch-friendly interface with appropriate button sizes
- Mobile-optimized navigation and forms
- Fast loading times on mobile networks

---

## 📧 Contact

For any queries, contributions, or security concerns, please contact:

**Aayush Ghimire**  
📧 [aghimire491@gmail.com](mailto:aghimire491@gmail.com)  
📍 Kathmandu, Nepal  
🔗 [GitHub Profile](https://github.com/aayushghimire321)

---

## ⭐️ Show Your Support

If you found this project helpful:
- Give it a ⭐ on GitHub
- Share it with other developers
- Contribute to the codebase
- Report bugs and suggest improvements

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality and basic security
- **v1.1.0** - Enhanced security features and comprehensive testing suite
- **v1.2.0** - Admin dashboard with real-time analytics and data visualization
- **v1.3.0** - Payment integration and advanced booking system
- **v1.4.0** - Complete UI modernization with Material-UI 6.4.0
- **v1.5.0** - CAPTCHA integration and multi-factor authentication
- **Current v1.6.0** - Comprehensive logging system and enhanced admin dashboard

---

*Built with ❤️ using the MERN Stack for secure and scalable movie ticket booking*
