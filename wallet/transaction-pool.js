class TransactionPool {
    constructor() {
        this.transactionMap = {};
    }

    setTransaction(transaction) {
        this.transactionMap[transaction.id] = transaction;
    }

    existingTransaction({ inputAddress }) {
        const transations = Object.values(this.transactionMap);

        return transations
            .find(transaction => transaction.input.address === inputAddress);
    }

    setMap(transationMap) {
        this.transactionMap = transationMap;
    }
}

module.exports = TransactionPool;