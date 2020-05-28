// Import the depencies
const express = require('express');
const bodyParser = require('body-parser');
const NanoClient = require('nano-node-rpc');

const app = express();
const PORT = 7091;

// Applies parsing to requests.
app.use(bodyParser.urlencoded({
  extended: true
}));

// Testing endpoint
app.get('/', (req, res, next) => {
  res.send("This is a test");
});

// Create endpoint
app.get('/create', (req, res) => {

  const client = new NanoClient({
    url: 'http://localhost:7076'
  });

  async function queryDemo() {

    client._send('account_create',{
      wallet: "CD5FEF7334AA15BAA9A1835E0D5DBE1E302E3F703E44E16B2670A249EB50CCE2"
    }).then((response)=> {

      console.log(response);
      res.send("account created successfully");

    }).catch((error) => {

      console.log("create errror: " + error.message);
    })
  }

  queryDemo();

});

// End point to check balance
app.post('/balance', (req, res) => {

  const client = new NanoClient({
    url: 'http://localhost:7076'
  });

  async function queryDemo() {

    try {
      // query the account balance
      var account = await client.account_balance(req.body.account);

      // query the current block count
      var count = await client.block_count();

    } catch (error) {

      console.error("\nError: " + error.message);
      return;
    }

    console.log("Account balance:", account);
    console.log("Block count:", count);

    res.send(account);
  }

  queryDemo();;
});

// End point to send
app.post('/send', (req, res) => {

  const client = new NanoClient({
     url: 'http://localhost:7076'
   });

  client._send('send', {

    wallet: "CD5FEF7334AA15BAA9A1835E0D5DBE1E302E3F703E44E16B2670A249EB50CCE2",
    source: req.body.source,
    destination: req.body.destination,
    amount: req.body.amount

  }).then(transaction => {

    //////////////////////////////////////// testing receive
    client._send('receive', {

      wallet: "CD5FEF7334AA15BAA9A1835E0D5DBE1E302E3F703E44E16B2670A249EB50CCE2",
      account: req.body.destination,
      block: transaction.block

    }).then(confirmation => {

      console.log("Receiving successfull. confirmation block is : " + confirmation.block);

    }).catch(error => {

      console.log("Receiving error: " + error.message);
    });

    ////////////////////////////////////////
  })
  .catch(e => {

    console.log("Sending error: " + e.message);
  });

  res.send("Check console for to check Transaction");
});

app.listen(PORT, () => {
  console.log("Testing server on port " + PORT);
});