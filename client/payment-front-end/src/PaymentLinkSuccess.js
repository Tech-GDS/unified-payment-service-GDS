import React from "react";
import axios from "axios";
import queryString from "query-string";
import { message } from "antd";
import { Row, Col, Typography } from "antd";
import PaymentSuccessImg from "./assets/paymentsuccess.png";

const { Title } = Typography;

export default class PaymentSuccessComponent extends React.Component {
  componentDidMount() {
    /**
     * Component to handle Callback of success payment
     * & make sucessive call to capture payment
     *
     */
    let params = queryString.parse(this.props.location.search)
    axios
        .post("http://localhost:3002/api/payment-link-confirm/", params)
        .then(res => {
            console.log(res);
            message.success("Payment Successful, Thank you!");
            setTimeout(function(){
                window.location = 'https://geekeedatascience.com';
             }, 5000);
            return res;
        })
        .catch(error => {
            console.log(error);
            //   message.error("Unexpected error. Please try again");
            return error;
        });
  }
  render() {
    return (
      <Row type="flex" justify="center" align="middle">
        <Col lg={16} style={{ marginTop: "12%" }} type="flex" align="middle">
          <Row>
            <img
              src={PaymentSuccessImg}
              alt="Payment Success Icon"
              style={{ width: "70%", height: "30%" }}
            />
          </Row>
          <Row style={{ marginTop: "5%" }}>
            <Title level={2}>Your Payment is Successful</Title>
            <Title level={4} style={{ fontWeight: "400", color: "#919191" }}>
              Thank you for your payment. An automated payment receipt will be
              sent to your registered email.
            </Title>
          </Row>
        </Col>
      </Row>
    );
  }
}
