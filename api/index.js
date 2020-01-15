const bodyParser = require('body-parser');
const express = require('express');
const Blockchain = require('../blockchain/blockchain');
const blockchain = new Blockchain();
const app = express();
const PORT = 8080;

app.use(bodyParser.json());

// app.use('/api/v1', (req, res) => {
//     res.status(404).send({
//         status: 'failed',
//         message: 'Not found',
//         data: []
//     });
// });

app.get('/api/v1/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.post('/api/v1/mine', (req, res) => {
    const { data } = req.body;

    blockchain.addBlock({ data });

    res.redirect('/api/v1/blocks');
});

app.listen(PORT, () => console.log(`listening at http://localhost:${PORT}`));