# Inline Checkout

## To run
 1. Include the script in your code
 
 ```js
<script src="https://atlas-checkout-inline.herokuapp.com/atlas-pay-inline.js">
```

2. Initialize the charge
Invoke the script using the Transaction ID
```js
var atlasPay = new AtlasPay({transactionId: "123456"}); // TransactionId
    atlasPay.charge().then(console.log).catch(console.log);
```
