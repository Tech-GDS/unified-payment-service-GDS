import React from "react";
import axios from "axios";
import queryString from "query-string";
import { message } from "antd";
import { Row, Col } from "antd";
import { Button } from "antd";

export default class PaymentConfirmSuccessComponent extends React.Component {
  state = {
    payment_status: "",
  };

  componentDidMount() {
    /**
     * Component to handle Callback of success payment
     * & make sucessive call to capture payment
     */
    const payment_info = queryString.parse(this.props.location.search);
    if (!payment_info.payment_id) {
      this.setState({ payment_status: "Payment Failed" });
    } else {
      let params = {};
      localStorage.setItem("payment_id", JSON.stringify(payment_info));
      const orderDetails = JSON.parse(localStorage.getItem("orderDetails"));
      params["order_id"] = orderDetails["order_id"];
      params["amount"] = orderDetails["amount"];
      params["currency"] = orderDetails["currency"];
      const payment_id = JSON.parse(localStorage.getItem("payment_id"));
      console.log("payment-id=---------", payment_id);

      params["payment_id"] = payment_id["payment_id"];

      axios
        .post("http://localhost:3002/api/payment-confirm/", params)
        .then((res) => {
          this.setState({ payment_status: "Payment Successfull" });
          console.log(res);
        //   this.successRedirect();
          message.success("Payment Successfull!");
          return res;
        })
        .catch((error) => {
            if(error.hasOwnProperty('response') && error.response.hasOwnProperty('data')){
                this.setState({payment_status:error.response.data.message})
            } else {
                console.log('Error',error);
                
            }
          
          //   message.error("Unexpected error. Please try again");
          return error;
        });
    }
  }
  refund = () => {
    const orderDetails = JSON.parse(localStorage.getItem("orderDetails"));
    let params = {};
    params["amount"] = orderDetails["amount"];
    params["payment_id"] = orderDetails["payment_id"];
    params["notes"] = orderDetails["notes"];
    const payment_id = JSON.parse(localStorage.getItem("payment_id"));
    console.log("payment-id=---------", payment_id);

    params["payment_id"] = payment_id["payment_id"];
    console.log("params", params);

    axios
      .post("http://localhost:3002/api/refunds/", params)
      .then((res) => {
        console.log('Refund successfull',res);
        message.success("Refund Successfull!");
        return res;
      })
      .catch(function (error) {
        message.error(error.response.data.message);
      });
  };
  render() {
    return (
      <Row
        type="flex"
        justify="center"
        align="middle"
        style={{ paddingTop: "200px" }}
      >
        <Col>
          <Row>
            <p>{this.state.payment_status}</p>
          </Row>
          <Row type="flex" justify="center" align="middle">
            {this.state.payment_status === "Payment Successfull" ? (
              <Button onClick={this.refund}>Refund</Button>
            ) : null}
          </Row>
        </Col>
      </Row>
    );
  }
}
