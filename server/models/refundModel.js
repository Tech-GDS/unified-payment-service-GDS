const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// creating schema for the payments collection
const RefundModelSchema = new Schema({}, { 'strict': false });

// creating model using the above schema and collection name.
const refundModel = mongoose.model(
    "refunds",
    RefundModelSchema
);

module.exports = refundModel;