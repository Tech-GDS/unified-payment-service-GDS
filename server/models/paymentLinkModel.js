const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// creating schema for the payments collection
const PaymentLinkModelSchema = new Schema({}, { 'strict': false });

// creating model using the above schema and collection name.
const PaymentLinkModel = mongoose.model(
   "paymentlinks",
   PaymentLinkModelSchema
);

module.exports = PaymentLinkModel;