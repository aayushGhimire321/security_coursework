const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendOtp = require('../service/sendotp');
const User = require('../models/userModel');
const zxcvbn = require('zxcvbn');
const {
  sendLoginVerificationEmail,
  sendRegisterOtp,
  sendPasswordResetOtp,
} = require('../service/sendEmail');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const crypto = require('crypto-js');

const encrypt = (text) => {
  return crypto.AES.encrypt(text, process.env.ENCRYPTION_KEY).toString();
};

const decrypt = (text) => {
  return crypto.AES.decrypt(text, process.env.ENCRYPTION_KEY).toString(
    crypto.enc.Utf8
  );
};

const createUser = async (req, res) => {
  // Check incoming data
  // console.log(req.body);

  // Destructure the incoming data
  const { email, username, phoneNumber, password } = req.body;

  // Validate the data (if empty, stop the process and send response)
  if (!username || !phoneNumber || !email || !password) {
    // res.send("Please enter all fields!")
    return res.json({
      success: false,
      message: 'Please enter all fields!',
    });
  }

  // Error Handling (Try Catch)
  try {
    // Check if the user is already registered
    const existingUser = await userModel.findOne({ email: email });

    // if user found: Send response
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User Already Exists!',
      });
    }

    // Check password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be above 8 characters.',
      });
    }

    // Check if the password contains part of username
    if (password.includes(username)) {
      return res.status(400).json({
        success: false,
        message: 'Password cannot contain username.',
      });
    }

    const passwordStrength = zxcvbn(password);

    // Check if the password strength score is sufficient (e.g., 3 or higher)
    if (passwordStrength.score < 3) {
      return res.status(400).json({
        success: false,
        message: 'Password is not strong enough. Try adding more complexity.',
        suggestions: passwordStrength.feedback.suggestions, // Provide user-friendly suggestions
      });
    }

    // Hashing/Encryption of the password
    const randomSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, randomSalt);

    let passwordList = [];
    passwordList.push(hashedPassword);

    // Set password expires in 90 days
    const passwordExpiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

    // encrypt the username and phone
    const encryptedUsername = encrypt(username);
    const encryptedPhoneNumber = encrypt(phoneNumber);

    // 5.2 if user is new:
    const newUser = new userModel({
      username: encryptedUsername,
      phoneNumber: encryptedPhoneNumber,
      email: email,
      password: hashedPassword,
      oldPasswords: passwordList,
      isAdmin: false,
      passwordExpiresAt: passwordExpiresAt,
      isVerified: false,
    });

    // console.log(newUser);

    const randomOTP = Math.floor(100000 + Math.random() * 900000);
    // console.log(randomOTP);

    newUser.verifyOTP = randomOTP;
    newUser.verifyExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    // Send OTP to the user's email
    const sent = await sendRegisterOtp(email, randomOTP);

    if (!sent) {
      return res.status(500).json({
        success: false,
        message: 'OTP send failed',
      });
    }
    // Save to database
    await newUser.save();

    // send the response
    res.status(201).json({
      success: true,
      message: 'User Created Successfully!',
    });
  } catch (error) {
    console.error('Error in createUser:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error!',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

const loginUser = async (req, res) => {
  // console.log(req.body); // Log incoming data for debugging

  const { email, password, captchaToken } = req.body;
  const device = req.headers['user-agent']; // Identify the device using User-Agent

  if (!captchaToken) {
    return res.status(400).json({
      success: false,
      message: 'Please confirm that you are not a robot.',
    });
  }

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please enter all fields',
    });
  }

  try {
    // Validate the captcha token
    const captchaSuccess = await validateCaptcha(captchaToken);

    if (!captchaSuccess.success) {
      return res.status(400).json({
        success: false,
        message: captchaSuccess.message,
      });
    }

    const user = await userModel.findOne({ email: email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User does not exist!',
      });
    }

    if (user.isLocked) {
      return res.status(403).json({
        success: false,
        message: `Account is locked. Try again after ${new Date(
          user.accountLockUntil
        ).toLocaleString()}`,
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      await user.incrementLoginAttempts();
      const attemptsRemaining = 5 - user.loginAttempts;
      const lockMessage = user.isLocked
        ? `Your account is locked until ${new Date(
            user.accountLockUntil
          ).toLocaleString()}`
        : `Invalid password. ${attemptsRemaining} attempt(s) remaining.`;

      return res.status(400).json({
        success: false,
        message: lockMessage,
      });
    }

    // Check if the password has expired
    if (user.passwordExpiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Password has expired. Please reset your password.',
      });
    }

    // If login is successful, reset login attempts
    await user.resetLoginAttempts();

    if (!user.isVerified) {
      // Generate OTP for verification
      const randomOTP = Math.floor(100000 + Math.random() * 900000);
      // console.log(randomOTP);

      user.verifyOTP = randomOTP;
      user.verifyExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

      // Save the OTP in the database
      await user.save();

      // Send OTP to the user's email
      const sent = await sendRegisterOtp(email, randomOTP);

      if (!sent) {
        return res.status(500).json({
          success: false,
          message: 'Failed to send OTP',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'OTP sent to your email. Verify to continue.',
        registerOtpRequired: true,
      });
    }

    // Check if the device is new
    if (!user.rememberedDevices.includes(device)) {
      // Generate OTP for verification
      const randomOTP = Math.floor(100000 + Math.random() * 900000);
      // console.log(randomOTP);

      user.verifyOTP = randomOTP;
      user.verifyExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

      // Save the OTP in the database
      await user.save();

      // Send OTP to the user's email
      const sent = await sendLoginVerificationEmail(email, randomOTP);

      if (!sent) {
        return res.status(500).json({
          success: false,
          message: 'Failed to send OTP',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'OTP sent to your email. Verify to continue.',
        otpRequired: true,
      });
    }

    // If device is recognized, issue token

    user.loginDevices.push(device);
    await user.save();

    // Set the session
    req.session.regenerate((err) => {
      if (err) {
        console.error('Failed to regenerate session:', err);
        return res
          .status(500)
          .json({ success: false, message: 'Internal server error' });
      }

      req.session.user = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
      };

      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY }
      );

      // console.log(token);

      // Send the response with both session and token
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        user: { id: user._id, email: user.email, isAdmin: user.isAdmin },
        token, // Include the token in the response
      });
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

// verify otp
const verifyRegisterOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    // Just take the device info not the time
    const device = req.headers['user-agent'];
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.verifyExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired',
      });
    }

    if (user.verifyOTP !== parseInt(otp)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    user.isVerified = true;

    // If the account is verified, generate a token
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );

    user.loginDevices.push(device);
    user.verifyOTP = null;
    user.verifyExpires = null;
    await user.save();

    // Set the session
    req.session.regenerate((err) => {
      if (err) {
        console.error('Failed to regenerate session:', err);
        return res
          .status(500)
          .json({ success: false, message: 'Internal server error' });
      }

      req.session.user = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
      };

      // Send the response with both session and token
      res.status(200).json({
        success: true,
        message: 'Login successful',
        user: { id: user._id, email: user.email, isAdmin: user.isAdmin },
        token, // Include the token in the response
      });
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error,
    });
  }
};

const verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const device = req.headers['user-agent'];
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }
    if (user.verifyExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired',
      });
    }
    if (user.verifyOTP !== parseInt(otp)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    user.loginDevices.push(device);
    user.verifyOTP = null;
    user.verifyExpires = null;

    await user.save();

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );

    // Set the session
    req.session.regenerate((err) => {
      if (err) {
        console.error('Failed to regenerate session:', err);
        return res
          .status(500)
          .json({ success: false, message: 'Internal server error' });
      }

      req.session.user = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
      };

      // Send the response with both session and token
      res.status(200).json({
        success: true,
        message: 'Login successful',
        user: { id: user._id, email: user.email, isAdmin: user.isAdmin },
        token, // Include the token in the response
      });
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error,
    });
  }
};

const forgotPassword = async (req, res) => {
  // console.log(req.body);

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Please enter your phone number',
    });
  }
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    // Generate OTP
    const randomOTP = Math.floor(100000 + Math.random() * 900000);
    // console.log(randomOTP);

    user.resetPasswordOTP = randomOTP;
    user.resetPasswordExpires = Date.now() + 600000; // 10 minutes
    await user.save();

    // Send OTP to user phone number
    const isSent = await sendPasswordResetOtp(email, randomOTP);

    if (!isSent) {
      return res.status(400).json({
        success: false,
        message: 'Error in sending OTP',
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email',
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const resetPassword = async (req, res) => {
  // console.log(req.body);

  const { email, otp, password } = req.body;

  if (!email || !otp || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please enter all fields',
    });
  }

  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }
    // Otp to integer
    const otpToInteger = parseInt(otp);

    if (user.resetPasswordOTP !== otpToInteger) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired',
      });
    }

    // Check password length
    if (password.length < 8 || password.length > 16) {
      return res.status(400).json({
        success: false,
        message: 'Password must be between 8 and 16 characters.',
      });
    }

    const passwordStrength = zxcvbn(password);

    // Check if the password strength score is sufficient (e.g., 3 or higher)
    if (passwordStrength.score < 3) {
      return res.status(400).json({
        success: false,
        message: 'Password is not strong enough. Try adding more complexity.',
        suggestions: passwordStrength.feedback.suggestions, // Provide user-friendly suggestions
      });
    }

    // Check if the password is already in the passwordList
    for (let i = 0; i < user.oldPasswords.length; i++) {
      if (await bcrypt.compare(password, user.oldPasswords[i])) {
        return res.status(400).json({
          success: false,
          message: 'Password is already in use',
        });
      }
    }

    const randomSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, randomSalt);

    user.password = hashedPassword;
    user.resetPasswordOTP = null;
    user.resetPasswordExpires = null;
    //  if old passwords have five or more, remove the oldest one
    if (user.oldPasswords.length >= 5) {
      user.oldPasswords.shift();
    }
    user.oldPasswords.push(hashedPassword);
    user.passwordExpiresAt = Date.now() + 1000 * 60 * 60 * 24 * 90;
    await user.save();
    await user.resetAccountLock();
    await user.resetLoginAttempts();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Fetch all users
const getAllUsers = async (req, res) => {
  try {
    const allUsers = await userModel.find({});
    res.status(200).json({
      success: true,
      message: 'users fetched successfully',
      users: allUsers,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error,
    });
  }
};

// Fetch single user profile
const getSingleProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'No User Found',
      });
    }

    // check if user is rememberDevice
    const device = req.headers['user-agent'];
    const rememberDevice = user.rememberedDevices.includes(device);

    const username = await decrypt(user.username);
    const phoneNumber = await decrypt(user.phoneNumber);
    const address = user.address && (await decrypt(user.address));

    res.status(200).json({
      success: true,
      message: 'User fetched',
      user: {
        username: username,
        phoneNumber: phoneNumber,
        address: address,
        email: user.email,
        _id: user._id,
        isAdmin: user.isAdmin,
        rememberDevice: rememberDevice,
        loginDevices: user.loginDevices,
        rememberedDevices: user.rememberedDevices,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error,
    });
  }
};

// Upload Profile Picture
const uploadProfilePicture = async (req, res) => {
  const id = req.user.id;
  const { avatar } = req.files;

  // Check if a file was uploaded
  if (!avatar) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded',
    });
  }

  // Check if the file is in allowed types
  const allowedTypes = ['image/jpeg', 'image/png'];
  if (!allowedTypes.includes(avatar.mimetype)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid file type',
    });
  }

  // Check if the file size is less than 5MB
  if (avatar.size > process.env.MAX_FILE_SIZE) {
    return res.status(400).json({
      success: false,
      message: 'File size is too large',
    });
  }

  // Check the allowed extensions
  const allowedExtensions = ['jpg', 'jpeg', 'png'];
  const fileExtension = avatar.name.split('.').pop().toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid file extension',
    });
  }

  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    const username = await decrypt(user.username);
    const imageName = `${Date.now()}-${username}-${avatar.name}`;
    const imageUploadPath = path.join(
      __dirname,
      `../public/avatar/${imageName}`
    );

    // Create the directory if it doesn't exist
    if (!fs.existsSync(path.dirname(imageUploadPath))) {
      fs.mkdirSync(path.dirname(imageUploadPath), { recursive: true });
    }

    await avatar.mv(imageUploadPath);
    res.status(200).json({
      success: true,
      message: 'Profile picture updated successfully',
      avatar: imageName,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error,
    });
  }
};

// Update User
const updateUser = async (req, res) => {
  const id = req.user.id;
  const { phoneNumber, username, rememberDevice, address, avatar } = req.body;
  try {
    // Check if rememberDevice is true

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    if (rememberDevice) {
      const device = req.headers['user-agent'];
      user.rememberedDevices.push(device);
    }
    if (!rememberDevice) {
      const device = req.headers['user-agent'];
      user.rememberedDevices = user.rememberedDevices.filter(
        (d) => d !== device
      );
    }

    const encryptedPhoneNumber = await encrypt(phoneNumber);
    const encryptedUsername = await encrypt(username);
    const encryptAddress = await encrypt(address);

    user.phoneNumber = encryptedPhoneNumber;
    user.username = encryptedUsername;
    user.address = encryptAddress;

    if (avatar) {
      user.avatar = avatar;
    }

    const updatedUser = await user.save();

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (err) {
    console.error('Error updating User:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to update',
      error: err.message,
    });
  }
};
// get token
const getToken = async (req, res) => {
  try {
    // console.log(req.body);
    const { id } = req.body;

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }
    const token = await jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET
    );

    return res.status(200).json({
      success: true,
      message: 'Token generated successfully!',
      token: token,
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error,
    });
  }
};

const validateCaptcha = async (recaptchaToken) => {
  try {
    console.log('Validating CAPTCHA token:', recaptchaToken ? 'Token received' : 'No token');
    console.log('RECAPTCHA_SECRET_KEY exists:', !!process.env.RECAPTCHA_SECRET_KEY);
    
    if (!recaptchaToken) {
      return {
        success: false,
        message: 'No CAPTCHA token provided',
      };
    }
    
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    
    console.log('Google reCAPTCHA response:', response.data);
    
    if (response.data.success) {
      return {
        success: true,
        message: 'Captcha Validated',
      };
    } else {
      const errorCodes = response.data['error-codes'] || [];
      console.log('CAPTCHA validation failed:', errorCodes);
      
      let errorMessage = 'Invalid Captcha';
      if (errorCodes.includes('invalid-input-response')) {
        errorMessage = 'Invalid CAPTCHA token. Please try again.';
      } else if (errorCodes.includes('timeout-or-duplicate')) {
        errorMessage = 'CAPTCHA has expired. Please complete it again.';
      } else if (errorCodes.includes('invalid-input-secret')) {
        errorMessage = 'CAPTCHA configuration error. Please contact support.';
      }
      
      return {
        success: false,
        message: errorMessage,
      };
    }
  } catch (error) {
    console.log('CAPTCHA validation error:', error.message);
    return {
      success: false,
      message: 'CAPTCHA validation failed - server error',
      error: error.message,
    };
  }
};

// delete user
const deleteUser = async (req, res) => {
  const id = req.user.id;
  try {
    const user = await userModel.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error,
    });
  }
};

// logoutUser
const logoutUser = async (req, res) => {
  try {
    res.clearCookie('token');
    // make the session expired
    req.session.destroy();

    // clear the session cookie
    res.clearCookie('connect.sid');

    // remove the device from the database
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    user.loginDevices = user.loginDevices.filter(
      (device) => device !== req.headers['user-agent']
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User logged out successfully',
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error,
    });
  }
};

// Exporting
module.exports = {
  createUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getAllUsers,
  getSingleProfile,
  updateUser,
  getToken,
  verifyRegisterOTP,
  verifyLoginOTP,
  uploadProfilePicture,
  deleteUser,
  logoutUser,
};
