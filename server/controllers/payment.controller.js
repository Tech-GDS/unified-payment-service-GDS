require("dotenv").config();

const paymentGatewayService = require("../services/payment_gateway.service");
const razorPayInstance = paymentGatewayService.getPaymentGatewayInstance(
  "razorPay"
);
const Orders = require("../models/orders.model");

exports.capturePayment = (request, response) => {
  /**
   * POST API to capture the payment done previously, by using payment_id & order_id from the payload.
   */
  const payment_id = request.body["payment_id"];
  const amount = request.body["amount"];
  const currency = request.body["currency"];
  const order_id = request.body["order_id"];

  razorPayInstance.payments
    .capture(payment_id, amount, currency)
    .then((data) => {
      // update payment_info received after successfull capture into the order's document
      const paymentInfo = { paymentInfo: data };
      Orders.findOneAndUpdate({ order_id: order_id }, paymentInfo)
        .then((result) => {
          response.status(200).send({ message: "Payment captured" });
        })
        .catch((error) => {
          // send error response
          response.status(400).send({ message: error });
        });
    })
    .catch((error) => {
      //   logger.error(
      //     // logs error with complete stack trace
      //     `${error.statusCode} - ${error} - ${request.url} - ${request.method}`
      //   );
      response
        .status(error.statusCode)
        .send({ message: error.error.description });
    });
};

exports.paymentSuccess = (request, response) => {
  /**
   * POST webhook to receieve post callback from Razor after processing payment
   */

  try {
    
    const payment_id = encodeURIComponent(request.body["razorpay_payment_id"]);
    console.log('Payment id', payment_id);
    console.log('type', typeof payment_id);
    
    if (payment_id && typeof payment_id === "string") {
      // passing dummy user info to create sample invoice
      var user = {
        firstName: "Test",
        date: "31/01/2020",
        time: "11 AM",
        activation_link: "https://www.geekeedatascience.com",
      };
      // helpers.createAndUploadInvoice(user);
    } else {
      return response.status(400).send({ message: "invalid payment_id" });
    }
    // redirect to the respective client along with the payment_id after payment-success
    response.redirect(process.env.PAYMENT_CALLBACK_URL + payment_id);
  } catch (error) {
    response.status(500).send({ "message": "Something Bad happened" })
  }
};
