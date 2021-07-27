
const port = 3000;

const { performance } = require('perf_hooks');
const request = require('request-promise');
const http              = require('http');
const express           = require('express');

const region = process.argv[2] || 'unknown';

// var WebSocket = require('rpc-websockets').Client
const WebSocketServer = require('rpc-websockets').Server;

const EXCHANGES = {
    bitmex:                 'https://www.bitmex.com/api/v1/orderBook/L2?symbol=XBTUSD&depth=1',
    'binance-futures':      'https://fapi.binance.com/fapi/v1/depth?symbol=BTCUSDT&limit=5',
    'binance-spot':         'https://api.binance.com/api/v3/depth?symbol=BTCUSDT&limit=5',
    ftx:                    'https://ftx.com/api/markets/BTC-PERP/orderbook?depth=1',
    deribit:                'https://www.deribit.com/api/v2/public/get_order_book?depth=1&instrument_name=BTC-PERPETUAL',
    okex:                   'https://www.okex.com/api/swap/v3/instruments/BTC-USDT-SWAP/depth?size=1',
    'bybit':        'https://api.bybit.com/v2/public/orderBook/L2?symbol=BTCUSD&depth=1',
    coinbase:               'https://api.pro.coinbase.com/products/BTC-USD/book?level=1',                                       // Just a quote, not 5 levels

};

const app = express();

app.use(express.json());
app.use(express.static('public'));

// Create HTTP separately so we can serve WS and REST requests
const httpserver = http.createServer( app );
const wserver = new WebSocketServer({ server: httpserver });


(async()=>{

    // instantiate Server and start listening for requests
    // const server = new WebSocketServer({
    //     port,
    //     host: 'localhost'
    // });

    // register an RPC method
    wserver.register('sum', function(params) {
        return params[0] + params[1]
    });

    wserver.register('test', async params => {

        try {

            const ex = params.exchange;
            const uri = EXCHANGES[ ex ];

            const t = performance.now();
            const r = await request({
                uri, method: 'GET',
            });
            const p = performance.now() - t;

            return { result: {
                region,
                exchange: ex,
                time: p
            } };

        } catch(e) {
            console.log( e );
            return { error: true };
        }

       
    });

    httpserver.listen(port || 8000, () => {
        console.log(`=> ${region} | server listening on port ${httpserver.address().port}`);
    });

})();