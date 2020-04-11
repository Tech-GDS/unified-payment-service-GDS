# Unified Payment Service 

A microservice to accept and process payments.
 
Tech stack: Node, Express Js, Front-end dummy App React Js,MongoDB, [Razorpay](https://github.com/razorpay/razorpay-node) as payment gateway

## Features
Accept payments using front-end payment modal (Popup)
Accept payment via unique payment link
Refund particular payment


## Requirements

For development, you will only need Node.js and a node global package, Yarn or npm, installed in your environment.



## Backend Installation

```bash
git clone https://github.com/nikhillad01/unified-payment-service-GDS.git
cd server/
yarn install
```
## Run Backend Server 
```bash
node server.js
```
The server will start on port 3002 


## Front-End Installation 
```bash
cd client/payment-front-end
yarn install
```
This will install all front-end dependencies
```bash
yarn start
``` 
To run the front-end app. The app will start on port 3000 by default 

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.


