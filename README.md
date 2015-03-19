# snp-heatmap
Stack: Node.js / socket.io / D3.js

Visualize all trades happenning in the S&P500 in realtime (EST).

Opens a socket to stream directly from [Tradeking's](https://developers.tradeking.com/documentation/getting-started) 
API, pipe to ```socket.io``` and finally stream to your browser.
Uses cronjobs to query market data when market is closed.

###To run locally:

1. Install package dependencies: `$ npm install`
2. Using `config/default.sample.json` as an example, create a `config/default.json`
  - Create a developer account with tradeking and fill in your api key/secret. 
3. Run! `$ npm start`
