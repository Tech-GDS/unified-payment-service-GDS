import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import PaymentSuccessComponent from "./paymentConfirmComponent"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import GeneratePayment from './GeneratePayment'
import PaymentConfirmSuccessComponent from "./PaymentLinkSuccess"
ReactDOM.render(
  <Router>
        <Switch>
            <Route exact path="/" component={App} />
            <Route exact path="/payment-status/" component={PaymentSuccessComponent} />
            <Route exact path="/generate-payment-link" component={GeneratePayment} />
            <Route exact path="/payment-link-success/" component={PaymentConfirmSuccessComponent} />
        </Switch>
    </Router>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
