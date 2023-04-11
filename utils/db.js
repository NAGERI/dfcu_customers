const mongoose = require("mongoose");

const connectDB = async (url) => {
  await mongoose.connect(url, {
    useNewUrlParser: true,
  });
  console.log("MongoDB Connected");
};

module.exports = connectDB;
