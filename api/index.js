const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');
const Blockchain = require('../blockchain/index');
const PubSub = require('../app/pubsub');
const TransactionPool = require('../wallet/transaction-pool');
const Wallet = require('../wallet/index');
const TransactionMiner = require('../app/transaction-miner');

const blockchain = new Blockchain();
const app = express();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain, transactionPool });
const transactionMiner = new TransactionMiner({ blockchain, transactionPool, wallet, pubsub });

const DEFAULT_PORT = 8080;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;
let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;

app.use(bodyParser.json());

app.get('/api/v1/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.post('/api/v1/mine', (req, res) => {
    const { data } = req.body;

    blockchain.addBlock({ data });

    pubsub.broadcastChain();

    res.redirect('/api/v1/blocks');
});

app.post('/api/v1/transaction', (req, res) => {
    const { amount, recipient } = req.body;

    let transaction = transactionPool
        .existingTransaction({ inputAddress: wallet.publicKey });

    try {
        if (transaction) {
            transaction.update({ senderWallet: wallet, recipient, amount });
        } else {
            transaction = wallet.createTransaction({ recipient, amount });
        }
    } catch (error) {
        return res.status(400).json({
            status: 'failed',
            message: error.message
        });
    }

    transactionPool.setTransaction(transaction);

    pubsub.broadcastTransaction(transaction);

    res.json({ status: 'success', transaction });
});

app.get('/api/v1/transaction_pool_map', (req, res) => {
    res.json(transactionPool.transactionMap);
});

app.get('/api/v1/mine_transactions', (req, res) => {
    transactionMiner.mineTransaction();

    res.redirect('/api/v1/blocks');
});

const syscWithRootState = () => {
    request({ url: `${ROOT_NODE_ADDRESS}/api/v1/blocks` }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const rootChain = JSON.parse(body);

            console.log('replace chain on a sync with', rootChain);
            blockchain.replaceChain(rootChain);
        }
    });

    request({ rul: `${ROOT_NODE_ADDRESS}/api/v1/transaction_pool_map` }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const rootTransactionPoolMap = JSON.parse(body);

            console.log('replace transaction pool map on a sync wiht', rootTransactionPoolMap);
            transactionPool.setMap(rootTransactionPoolMap);
        }
    });
}

app.listen(PORT, () => {
    console.log(`listening at http://localhost:${PORT}`);

    if (PORT !== DEFAULT_PORT) {
        syscWithRootState();
    }
});