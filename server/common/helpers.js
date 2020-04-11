const { isEmpty } = require("../common/validators");
const orderModel = require("../models/orders.model");
const refundModel = require("../models/refundModel")

exports.generateRandomKey = () => {
  return (
    Math.random().toString(36).substring(2, 8) +
    Math.random().toString(36).substring(2, 8)
  );
};

exports.addOrdersHandler = (record) => {
  if (!isEmpty(record)) {
    try {
      new orderModel(record).save();
      console.log("New order record saved");
      return true;
    } catch (error) {
      return false;
    }
  } else {
    console.log("Empty record");

    return false;
    // raise exception
  }
};


exports.addRefundAsync=(data)=> {
  /**
   * Async method to add refund data as a document in the refunds collection.
   * data: json containg the response data from the RazorPay API.
   */
  if (!isEmpty(record)) {
    try {
      new refundModel(record).save();
    } catch (error) {
      return;
    }
  } else {
    // raise exception
  }
}

exports.fetchRequestOrigin=(request)=> {
  if (request) {
    const requestOrigin =
      request.headers["x-forwarded-for"] || request.connection.remoteAddress;
    return requestOrigin;
  }
  return null;
}
exports.fetchRequestURL=(request)=> {
  if (request) {
    const requestFullUrl =
      request.protocol + "://" + request.get("host") + request.originalUrl;
    return requestFullUrl;
  }
  return null;
}



exports.addOrderAsync=(data, request) =>{
  // adding invoice_id field to be stored in the order's document
  data["inv_id"] = data.id;
  // adding request meta fields(origin and URL) to be stored in the order's document.
  data["request_origin"] = this.fetchRequestOrigin(request);
  data["request_url"] = this.fetchRequestURL(request);

  // saving the new order's data along with the generated payment url
  this.addOrdersHandler(data);
}