import React from "react";
import "./App.css";
import { Row } from "antd";
import { Col } from "antd";
import { Form, Button, Input, message, Select } from "antd";
import axios from "axios";

const { TextArea } = Input;
const { Option } = Select;

class AppForm extends React.Component {
  componentDidMount() {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }

  state = {
    payableAmount: 0.0,
    currency: "INR",
    paymentRes: {},
  };

  paymentOptions = (data) => {
    const Paymentoptions = {
      key: "rzp_test_bv7ofpERB0pZ97",
      amount: data.amount, //  = INR 1
      name: data.name,
      callback_url: "http://localhost:3002/api/payment-status/",
      redirect: true,
      description: "some description",
      image: "https://cdn.razorpay.com/logos/7K3b6d18wHwKzL_medium.png",
      handler: function (response) {
        console.log("Response: ", response);
        // alert(response.razorpay_payment_id);
        // razorpay.on('payment_success',function (resp) {
        //   alert(resp.razorpay_order_id);
        //   alert(resp.razorpay_signature)});
      },
      prefill: {
        name: data.name,
        contact: data.phone,
        email: data.email,
      },
      notes: {
        address: "some address",
      },
      theme: {
        color: "blue",
        hide_topbar: false,
      },
    };
    return Paymentoptions;
  };
  openPayModal = (paymentOptions) => {
    var rzp1 = new window.Razorpay(paymentOptions);
    rzp1.open();
  };

  handleSubmit = (e) => {
    e.preventDefault();
  };

  createOrder = (values) => {
    axios
      .post("http://localhost:3002/api/orders/", values)
      .then((res) => {
        if (res && res.hasOwnProperty("data")) {
          console.log("data recieved successs !!!", res);
          this.setState({ paymentRes: res.data });

          //  this.payOrderAmount(res);
          const paymentOptions = this.paymentOptions(res.data);
          this.openPayModal(paymentOptions);
          localStorage.setItem("orderDetails", JSON.stringify(res.data));
          this.props.form.resetFields();
        } else {
          message.error(res.data.message);
        }
        return res;
      })
      .catch((error) => {
        console.log(error);
        message.error("Unexpected error. Please try again");
        return error;
      });
  };

  payWithRazorPay = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        values["payable_amount"] = this.state.payableAmount * 100;
        this.createOrder(values);
      }
    });
  };

  calculatePayableAmount(amount) {
    amount = parseFloat(amount);
    // console.log("a", typeof amount);
    if (typeof amount != "string") {
      this.setState({ baseAmount: amount });
      if (this.state.currency === "INR") {
        let payabmleAmount =
          Math.round((amount + amount * 0.18 + Number.EPSILON) * 100) / 100;
        this.setState({ payableAmount: payabmleAmount });
      } else {
        this.setState({ payableAmount: amount });
      }
    } else {
      this.setState({ payableAmount: 0.0 });
    }
  }
  handleCurrencyChange = (value) => {
    this.setState({ currency: value });
    if (value === "INR") {
      let payabmleAmount =
        Math.round(
          (this.state.baseAmount +
            this.state.baseAmount * 0.18 +
            Number.EPSILON) *
            100
        ) / 100;
      this.setState({ payableAmount: payabmleAmount });
    } else {
      this.setState({ payableAmount: this.state.baseAmount });
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const prefixSelector = getFieldDecorator("currency", {
      initialValue: "INR",
    })(
      <Select style={{ width: 70 }} onChange={this.handleCurrencyChange}>
        <Option value="INR">INR</Option>
        <Option value="EUR">EUR</Option>
        <Option value="USD">USD</Option>
      </Select>
    );
    return (
      <div id="payments-page" style={{ paddingTop: "160px" }}>
        <Row type="flex" justify="center" align="middle" id="payment-form-row">
          <Col xs={12} sm={8} md={8} lg={8} xl={7}>
            <Form onSubmit={this.handleSubmit}>
              <Form.Item>
                {getFieldDecorator("name", {
                  rules: [
                    {
                      required: true,
                      message: "Please input your name !",
                    },
                  ],
                })(<Input placeholder="Full Name" />)}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator("email", {
                  rules: [
                    {
                      required: true,
                      message: "Please input your email !",
                    },
                  ],
                })(<Input placeholder="Email" />)}
              </Form.Item>

              <Form.Item>
                {getFieldDecorator("phone", {
                  rules: [
                    {
                      required: true,
                      message: "Please input your phone !",
                    },
                  ],
                })(<Input placeholder="phone" />)}
              </Form.Item>

              <Form.Item>
                {getFieldDecorator("description", {
                  rules: [
                    {
                      required: false,
                      // message: "Please input your phone !"
                    },
                  ],
                })(<TextArea rows={4} placeholder="Description" />)}
              </Form.Item>

              <Form.Item>
                {getFieldDecorator("base_price", {
                  rules: [
                    {
                      required: true,
                      message: "Please enter base price  !",
                    },
                  ],
                })(
                  <Input
                    addonBefore={prefixSelector}
                    placeholder="Base Price"
                    onChange={(e) =>
                      this.calculatePayableAmount(e.target.value)
                    }
                  />
                )}
              </Form.Item>

              <Row type="flex" justify="end">
                Payable amount :{" "}
                {this.state.payableAmount ? (
                  <p>{this.state.payableAmount}</p>
                ) : (
                  0.0
                )}
              </Row>
              <br />
              <Form.Item>
                <Row type="flex" justify="space-around">
                  <Col span={12} gutter={10}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="payment-form-button"
                    onClick={this.payWithRazorPay}
                  >
                    Pay With Razorpay
                  </Button>
                  </Col>
                  <Col span={12}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="payment-form-button-iam"
                    onClick={()=>console.log('Other payment gateway not integrated yet !')}
                  >
                    Other Gateway
                  </Button>
                  </Col>
                  

                  
                </Row>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}
const App = Form.create({ name: "payment" })(AppForm);

export default App;
