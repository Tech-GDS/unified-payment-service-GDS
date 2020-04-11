import React from "react";
import "./App.css";
import { Row } from "antd";
import { Col } from "antd";
import { Form, Button, Input, message, Select, Checkbox } from "antd";
import axios from "axios";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { PaperClipOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

class GeneratePaymentForm extends React.Component {
  state = {
    copied: false,
    includeGST: false,
    payableAmount: 0.0,
    baseAmount: 0.0,
    currency: "INR",
    paymentLinkRazorpay: "",
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values.hasOwnProperty("includeGST") && values["includeGST"]) {
          console.log("include " + values["includeGST"]);
          values["payable_amount"] = this.state.payableAmount;
          // this.createOrder(values);
        } else {
          console.log("include " + values["includeGST"]);
          values["payable_amount"] = this.state.baseAmount;
        }

        console.log(values);

        if (
          values.hasOwnProperty("payment_gateway") &&
          values["payment_gateway"] === "razorpay"
        ) {
          this.generatePaymentForRazorPay(values);
        }
      }
    });
  };

  generatePaymentForRazorPay(values) {
    values["payable_amount"] = this.state.payableAmount * 100;
    axios
      .post("http://localhost:3002/api/generate-payment-link/", values)
      .then((res) => {
        if (res && res.hasOwnProperty("data")) {
          this.setState({ paymentLinkRazorpay: res.data.payment_url }, () => {
            message.success("Payment link generated successfully!");
          });

          //   this.props.form.resetFields();
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
  }

  calculatePayableAmount(amount) {
    amount = parseFloat(amount);
    console.log("a", typeof amount);
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

  linkCopied = () => {
    this.setState({ copied: true });
    message.info("Link copied successfully");
  };

  gstIncluded = () => {
    this.setState({ includeGST: !this.state.includeGST });
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
      <div id="generate-payment-link-page">
        <Row
          type="flex"
          justify="center"
          align="middle"
          id="generate-payment-form-row"
        >
          <Col xs={18} sm={12} md={12} lg={7} xl={7} id="generate-payment-col">
            <Row type="flex" justify="center">
              <h3 align="middle" id="generate-payment-link-title">
                Generate Payment Link
              </h3>
            </Row>
            <Form onSubmit={this.handleSubmit} id="generate-payment-form">
              <Form.Item className="generate-form-input">
                {getFieldDecorator("name", {
                  rules: [
                    {
                      required: true,
                      message: "Please input your name !",
                    },
                  ],
                })(<Input placeholder="Full Name" />)}
              </Form.Item>
              <Form.Item className="generate-form-input">
                {getFieldDecorator("email", {
                  rules: [
                    {
                      required: true,
                      message: "Please input your email !",
                    },
                  ],
                })(<Input placeholder="Email" type="email" />)}
              </Form.Item>

              <Form.Item className="generate-form-input">
                {getFieldDecorator("phone", {
                  rules: [
                    {
                      required: true,
                      message: "Please input your phone !",
                    },
                  ],
                })(<Input placeholder="phone" />)}
              </Form.Item>

              <Form.Item className="generate-form-input">
                {getFieldDecorator("description", {
                  rules: [
                    {
                      required: true,
                      // message: "Please input your phone !"
                    },
                  ],
                })(<TextArea rows={4} placeholder="Description" />)}
              </Form.Item>

              <Form.Item className="generate-form-input">
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
                    type="number"
                    onChange={(e) =>
                      this.calculatePayableAmount(e.target.value)
                    }
                  />
                )}
              </Form.Item>

              <Form.Item className="generate-form-input">
                {getFieldDecorator("includeGST", {
                  valuePropName: "checked",
                  initialValue: false,
                  rules: [
                    {
                      required: false,
                    },
                  ],
                })(
                  <Checkbox onChange={this.gstIncluded}>Include GST</Checkbox>
                )}
              </Form.Item>

              <Form.Item>
                {getFieldDecorator("payment_gateway", {
                  rules: [
                    {
                      required: true,
                      message: "Please select valid payment gateway!",
                    },
                  ],
                })(
                  <Select
                    placeholder="Select payment gateway"
                    className="generate-form-input"
                  >
                    <Option value="razorpay">Razorpay</Option>
                  </Select>
                )}
              </Form.Item>

              <Row type="flex" justify="end">
                Payable amount :{" "}
                {this.state.includeGST ? (
                  <p>{this.state.payableAmount}</p>
                ) : (
                  <p>{this.state.baseAmount}</p>
                )}
              </Row>
              <br />
              <Form.Item className="generate-form-input">
                <Row type="flex" justify="center">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="payment-form-button"
                  >
                    Generate Payment Link
                  </Button>
                </Row>
              </Form.Item>
            </Form>
            <Row className="display-payment-links">
              <>
                {" "}
                {this.state.paymentLinkRazorpay ? (
                  <>
                    {" "}
                    Pay With Razorpay:{" "}
                    <CopyToClipboard
                      text={this.state.paymentLinkRazorpay}
                      onCopy={this.linkCopied}
                    >
                      <span>
                        <PaperClipOutlined
                          style={{ fontSize: "44px", cursor: "pointer" }}
                        />
                      </span>
                    </CopyToClipboard>
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        window.open(this.state.paymentLinkRazorpay, "_blank")
                      }
                    >
                      {this.state.paymentLinkRazorpay}{" "}
                    </div>
                  </>
                ) : null}
              </>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

const GeneratePayment = Form.create({ name: "payment" })(GeneratePaymentForm);

export default GeneratePayment;
