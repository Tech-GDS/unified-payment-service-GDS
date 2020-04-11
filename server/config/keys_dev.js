require("dotenv").config();


module.exports = {
    MONGO_URI: process.env.MONGO_URL,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET
  };
