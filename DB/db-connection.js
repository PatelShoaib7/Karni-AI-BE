require('dotenv').config(); 
const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    return connection;
  } catch (error) {
    return error
  }
};

const connection =connectToDatabase()

module.exports = {
  connection,
};
