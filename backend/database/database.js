const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Configuring dotenv
dotenv.config();

const connectDatabase = () => {
  mongoose.connect(process.env.MONGODB_LOCAL).then(() => {
    // console.log('Database Connected!');
  });
};

// Exporting the function
module.exports = connectDatabase;
