const Razorpay = require("razorpay");
require("dotenv").config();

module.exports = {
    getPaymentGatewayInstance(paymentGateway = "razorPay") {
    /**
     * Factory method to export the instance of the given payment gateway.
     * Input: name of the payment gateway in string
     */
    switch (paymentGateway) {
      case "razorPay":
        return new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    }
  },
};
