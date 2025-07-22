
# 🎬 Movie Ticketing System

A full-stack **Movie Ticketing System** built with the **MERN Stack (MongoDB, Express.js, React, Node.js)**. This project provides a secure, scalable, and responsive platform for users to browse movies, book tickets, and make payments online. It includes robust admin controls, analytics, and a seamless booking experience.



## 📑 Table of Contents

- [Features](#features)
- [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Frontend Overview](#frontend-overview)
- [Backend Overview](#backend-overview)
- [Security Design Principles](#security-design-principles)
- [Usage](#usage)
- [Notes](#notes)


## ✅ Features

- 🔐 **User Authentication & Authorization**
- 👥 **Role-Based Access Control (User & Admin)**
- 🎞️ **Movie and Show Management**
- 🪑 **Interactive Seat Selection & Ticket Booking**
- 💳 **Khalti Payment Gateway Integration**
- 📊 **Admin Dashboard with Analytics and Logs**
- 📱 **Fully Responsive Design**
- ⚠️ **Error Handling & Toast Notifications**

---

## 🛠 Installation

### 🔧 Prerequisites

- [Node.js & npm](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Khalti API Credentials](https://khalti.com/)
- A modern web browser


### 📁 Backend Setup

1. Navigate to the backend directory:

   bash
   cd backend


2. Install dependencies:

   bash
   npm install
   

3. Create a `.env` file and configure the following variables:

   env
   REACT_APP_API_URL=http://localhost:3000
   PORT=5000
   MONGODB_CLOUD=your_cloud_mongodb_connection_string
   MONGODB_LOCAL=your_local_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRY=1d
   KHALTI_SECRET_KEY=your_khalti_secret_key
   KHALTI_GATEWAY_URL=https://khalti.com/api/v2/payment/verify/
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5000
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_app_password


4. Start the backend server:

   bash
   npm start
   



### 🌐 Frontend Setup

1. Navigate to the frontend directory:

   bash
   cd frontend


2. Install dependencies:

   bash
   npm install


3. Start the development server:

   bash
   npm start


4. The frontend will run on: `http://localhost:3000`



## 💻 Frontend Overview

The frontend is built with **React** and includes:

* **Material-UI (MUI)** for elegant UI components and theming.
* **React Router** for client-side routing.
* **Axios** for API requests.
* **React Toastify** for real-time notifications.
* **Protected Routes** with role-based access.

### 📂 File Structure Highlights

* `App.js`: Defines public and protected routes.
* `components/`: Reusable UI elements (Navbar, Footer, Charts, etc.)
* `pages/`: Divided into `Public`, `User`, and `Admin` pages.
* `ProtectedRoute.jsx`: Implements role-based route protection.

---

## 🧪 Backend Overview

The backend is powered by **Express.js**, with:

* **MongoDB** for data storage.
* **JWT** for secure session management.
* **bcrypt.js** for password hashing.
* **Express Validator** for request validation.

### 📌 API Highlights

* **User API**: Registration, Login, OTP Verification, Password Reset.
* **Movie API**: CRUD operations for movie listings.
* **Booking API**: Manage ticket bookings, seat availability, and payments.
* **Analytics API**: Admin dashboard with user logs and system stats.

Refer to `api.js` for a complete list of API calls and routes.

---

## 🔐 Security Design Principles

### 🔑 Authentication & Authorization

* JWT-based token management
* Role-based access control (RBAC)

### 🧹 Input Validation

* All incoming requests validated using express-validator
* Sanitization to prevent NoSQL injection and XSS attacks

### 🛡️ Secure Communication

* Enable **HTTPS** in production
* `withCredentials` enabled for cross-origin secure cookies

### 🔐 Password Handling

* Passwords hashed using **bcrypt** before storing in the database

### 🚨 Error Handling

* Detailed yet secure error messages during development
* Suppressed sensitive data in production

### 🧱 Rate Limiting & Logging

* Rate limiting to mitigate brute-force attacks
* Admin activity logging for security audits

---

## 🚀 Usage

1. Ensure MongoDB is running (locally or through a remote cluster).
2. Start the backend server on **port 5000**.
3. Start the frontend server on **port 3000**.
4. Visit `http://localhost:3000` to access the application.
5. Register or log in as a **User** or **Admin** to explore functionalities.

---

## 📌 Notes

* Update the `.env` file with production credentials before deployment.
* Use services like **MongoDB Atlas**, **Render**, or **Vercel** for deployment.
* This project is compatible with modern browsers and responsive across all devices.

---

## 📧 Contact

For any queries or contributions, feel free to contact the project maintainer:

**Aayush Ghimire**
📧 [aghimire781@gmail.com](mailto:aghimire781@gmail.com)
📍 Kathmandu, Nepal

---

## ⭐️ Show your support

If you found this project helpful, give it a ⭐ on GitHub and share it with others!

```

---

Let me know if you'd like me to include:
- GitHub badges
- Deployment instructions for Vercel/Render
- Screenshots or demo links

Would you like this in a downloadable `.md` file too?
```
