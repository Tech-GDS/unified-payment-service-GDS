const Orders = require("../models/orders.model");
const generateRandomKey = require("../common/helpers").generateRandomKey;
const addOrdersHandler = require("../common/helpers").addOrdersHandler;
const addOrderAsync = require("../common/helpers").addOrderAsync

const paymentGatewayService = require("../services/payment_gateway.service");
const razorPayInstance = paymentGatewayService.getPaymentGatewayInstance(
  "razorPay"
);

exports.fetchOrders = (request, response) => {
  /**
   * GET API: To fetch all the orders data that exists.
   * To-Do: Add pagination with 10 objects per page.
   *        And, add auth_middleware to restrict the usage only to admin.
   */
  Orders.find()
    .then((records) => response.json(records))
    .catch((error) =>
      response.status(400).json({ message: "No orders found" })
    );
};

exports.generateOrder = (request, response) => {
  /**
   * POST API: To generate any new order and send the response back to the client
   * to initiate the payment.
   */

  let formValues = request.body;

  const receipt = generateRandomKey();
  const payment_capture = "0";
  const amount = formValues["payable_amount"];
  const currency = formValues["currency"];
  const notes = {};

  razorPayInstance.orders
    .create({ amount, currency, receipt, payment_capture, notes })
    .then((order) => {
      console.log("order", order);

      order["order_id"] = order["id"];
      delete order["id"];
      dataToSave = Object.assign({}, formValues, order);
      if (addOrdersHandler(dataToSave)) {
        response.json(dataToSave);
      } else {
        response.status(500).json({ message: "Something bad happened" });
      }
    })
    .catch((error) => {
      response
        .status(error.statusCode)
        .send({ message: error.error.description });
    });
};

exports.generatepaymentlink = (request, response) => {
  /**
   * POST API: To generate any new order and a unique payment link to accept the payment through it.
   * Returns the payment url.
   */
  let formValues = request.body;

  // create a date object having date as of next 5 days from the current date.
  let expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  // converting date object into epoch datetime object
  const expiryDateEpoch = Math.floor(expiryDate.getTime() / 1000);

  let params = {};
  params["amount"] = parseInt(formValues["payable_amount"]);
  params["type"] = "link";
  params["description"] = formValues["description"];
  params["callback_url"] = process.env.GENERATE_PAYMENT_CALLBACK_URL;
  params["callback_method"] = "get";
  params["expire_by"] = expiryDateEpoch;
  params["customer"] = {
    name: formValues["name"].toUpperCase(),
    email: formValues["email"],
    contact: formValues["phone"],
    billing_address: formValues["billing_address"]
      ? formValues["billing_address"]
      : null,
  };

  // creating unique payment link via razorpay API
  razorPayInstance.invoices
    .create(params)
    .then((data) => {
      // calling async handler method save order & payment's data in mongo document.
      addOrderAsync(data, request);

      response.status(200).send({ payment_url: data.short_url });
    })
    .catch((error) => {
      response.status(400).send({ message: error.error.description });
    });
};

exports.capturePaymentViaLink = (request, response) => {
  const paymentViaLinkInfo = { payment_info: request.body };

  /**
   * once the callback url is hit by Razorpay, this endpoint is requested by our client to capture the payment.
   * POST API, requires payment_info as payload.
   */

  Orders.findOneAndUpdate(
    { inv_id: request.body.razorpay_invoice_id },
    paymentViaLinkInfo
  )
    .then((result) => {
      response.status(200).send({ message: "Payment" });
    })
    .catch((error) => {
      response.status(400).send({ message: error.error.desription });
    });
};
