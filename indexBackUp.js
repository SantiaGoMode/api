// index back up. in this version the balance works. also the send works but the receive is not implemented yet.


const express = require('express');
const bodyParser = require('body-parser');
const NanoClient = require('nano-node-rpc');

const app = express();
const PORT = 7091;

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', (req, res, next) => {
  res.send("This is a test");
});

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

      // custom RPC command (e.g. block_info)
      var block_info = await client._send('block_info', {
        "json_block": true,
        "hash": "87434F8041869A01C8F6F263B87972D7BA443A72E0A97D7A3FD0CCC2358FD6F9"
      });

    } catch (error) {
      console.error("\nError: " + error.message);
      return
    }

    console.log("Account balance:", account);
    console.log("Block count:", count);
    console.log("Block info:", block_info.block_account);

  }

  queryDemo();

  res.send("check");

});

///////////////////////////////////////////////////////////
app.post('/send', (req, res) => {

  const client = new NanoClient({
     url: 'http://localhost:7076'
   });

  client._send('send', {
    wallet: req.body.wallet,
    source: req.body.source,
    destination: req.body.destination,
    amount: req.body.amount
  }).then(transaction => {
    console.log(transaction);
    /**
     * {
     *   "block_account": "nano_1ipx847tk8o46pwxt5qjdbncjqcbwcc1rrmqnkztrfjy5k7z4imsrata9est",
     *   "amount": "30000000000000000000000000000000000",
     *   "balance": "5606157000000000000000000000000000000",
     *   "height": "58",
     *   "local_timestamp": "0",
     *   "confirmed": "true",
     *   "contents": {
     *     ...
     *   },
     *   "subtype": "send"
     * }
     */
  })
  .catch(e => {
    console.log("Sending error: " + e.message);
  });

  res.send("send check");
});
////////////////////////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log("Testing server on port " + PORT);
});