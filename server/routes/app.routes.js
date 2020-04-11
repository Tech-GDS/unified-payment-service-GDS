const ordersController = require("../controllers/orders.controller");
const paymentsController = require("../controllers/payment.controller");
const refundController = require("../controllers/refund.controller");


const {ordersRequestvalidator,capturePaymentvalidator,refundValidator,generatePaymentlinkValidator} = require("../common/request_validator.middleware")


module.exports = (payments_app) => {
  payments_app.get("/api/orders", ordersController.fetchOrders);
  payments_app.post("/api/orders",ordersRequestvalidator,ordersController.generateOrder)

  payments_app.post("/api/payment-confirm/", capturePaymentvalidator, paymentsController.capturePayment);
  payments_app.post("/api/payment-status/", paymentsController.paymentSuccess);
  payments_app.post("/api/refunds/",refundValidator, refundController.createRefund);

  payments_app.post("/api/generate-payment-link/", generatePaymentlinkValidator, ordersController.generatepaymentlink);
  payments_app.post("/api/payment-link-confirm/", ordersController.capturePaymentViaLink);
};
