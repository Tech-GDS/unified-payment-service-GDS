/**
 * Each method is an exportable, which is being used as a serializer to validate request payload of 
 * the specific API with custom error messages and validations. 
 * These method cannot be written as async, as they need to be run sequentially with the APIs controller.
 * If there is any error/exception in these methods, the APIs controllers should not be executed.
 */


exports.ordersRequestvalidator = (req, res, next) => {
    let errors = {};
  
    if (!req.body.hasOwnProperty("payable_amount")) {
      errors["payable_amount"] = "This field may not be blank !";
    }
    if (!req.body.hasOwnProperty("currency")) {
      errors["currency"] = "This field may not be blank !";
    }
  
    if (Object.keys(errors).length > 0) {
      return res.status(400).send(errors);
    } else {
      next();
    }
  };

  

  exports.capturePaymentvalidator = (req, res, next) => {
    let errors = {};
  
    if (!req.body.hasOwnProperty("payment_id")) {
      errors["payment_id"] = "This field may not be blank !";
    }
    if (!req.body.hasOwnProperty("amount")) {
      errors["amount"] = "This field may not be blank !";
    }
    if (!req.body.hasOwnProperty("currency")) {
      errors["currency"] = "This field may not be blank !";
    }
  
    if (Object.keys(errors).length > 0) {
      return res.status(400).send(errors);
    } else {
      next();
    }
  };








exports.refundValidator = (req, res, next) => {
  let errors = {};

  if (!req.body.hasOwnProperty("payment_id")) {
    errors["payment_id"] = "This field may not be blank !";
  }
  if (!req.body.hasOwnProperty("amount")) {
    errors["amount"] = "This field may not be blank !";
  }
  if (!req.body.hasOwnProperty("notes")) {
    errors["notes"] = "This field may not be blank !";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).send(errors);
  } else {
    next();
  }
};


exports.generatePaymentlinkValidator = async (req, res, next) => {
  let errors = {};

  if (!req.body.hasOwnProperty("description")) {
    errors["description"] = "This field may not be blank !";
  }
  // if (!req.body.hasOwnProperty("amount")) {
  //   errors["amount"] = "This field may not be blank !";
  // }
  if (!req.body.hasOwnProperty("email")) {
    errors["email"] = "This field may not be blank !";
  }
  if (!req.body.hasOwnProperty("phone")) {
    errors["phone"] = "This field may not be blank !";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).send(errors);
  } else {
    next();
  }
};

