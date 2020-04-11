const paymentGatewayService = require("../services/payment_gateway.service");
const razorPayInstance = paymentGatewayService.getPaymentGatewayInstance("razorPay");
const {addRefundAsync} = require("../common/helpers").addRefundAsync
const logger = require("../config/winston")

exports.createRefund = (request, response) => {
    /**
     * POST Api to handle refunds of an already existing order using the data(payment_id, amount)
     * from the payload. 
     * After successfull refund, it saves the refund response data in the refund collection and returns a 200 response.
     */

    const payment_id = request.body["payment_id"];
    const amount = request.body["amount"];
    const notes = request.body["notes"];

    // calling refund API of RazorPay to process the refund using the payload
    razorPayInstance.payments.refund(payment_id, { amount, notes }).then((data, error) => {

        // calling the async method to store refund order response data in the refunds collection
        addRefundAsync(data);
        response.status(200).send({ message: 'Refund processed' });

    }).catch(error=>{
        logger.error(
            // logs error with complete stack trace
            `${error.statusCode} - ${error.error.description}`
        );
        response.status(error.statusCode).send({ message: error.error.description });
    });
}
