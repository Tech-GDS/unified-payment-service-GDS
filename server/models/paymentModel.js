const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// creating schema for the payments collection
const PaymentModelSchema = new Schema({}, { 'strict': false });

// creating model using the above schema and collection name.
const paymentModel = mongoose.model(
    "payments",
    PaymentModelSchema
);

module.exports = paymentModel;


// Not using Schema based strict collections

// const PaymentModelSchema = new Schema({
//     orderId: { type: String, required: true },
//     created_at: { type: Date, required: true },
// });
