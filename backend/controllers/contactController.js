// contact Us controller

const contactModel = require('../models/contactModel');
const User = require('../models/userModel');
const path = require('path');

const addContact = async (req, res) => {
  const { name, subject, message } = req.body;
  if (!name || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }
  try {
    const contact = new contactModel({
      name: name,
      user: req.user.id,
      subject: subject,
      message: message,
    });
    await contact.save();
    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      id: contact._id,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error,
    });
  }
};

// get all contact us message
const getContact = async (req, res) => {
  try {
    const contacts = await contactModel.find();
    res.status(200).json({
      success: true,
      message: 'Messages fetched successfully',
      contacts: contacts,
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

module.exports = { addContact, getContact };
