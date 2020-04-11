const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// creating schema for the orders collection
const OrdersSchema = new Schema({}, { 'strict': false });

// creating model using the above schema and collection name.
const OrdersModel = mongoose.model('orders', OrdersSchema);

module.exports = OrdersModel;