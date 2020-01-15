const TransactionPool = require('../../wallet/transaction-pool');
const Transaction = require('../../wallet/transaction');
const Wallet = require('../../wallet/index');

describe('TransactionPool', () => {
    let transactionPool, transaction, senderWallet;

    beforeEach(() => {
        transactionPool = new TransactionPool();
        senderWallet = new Wallet();
        transaction = new Transaction({
            senderWallet,
            recipient: 'dummy-recipient',
            amount: 50
        });
    });

    describe('setTransaction()', () => {
        it('adds a transaction', () => {
            transactionPool.setTransaction(transaction);

            expect(transactionPool.transactionMap[transaction.id])
                .toBe(transaction);
        });
    });

    describe('existingTransaction()', () => {
        it('returns an existing transaction input address', () => {
            transactionPool.setTransaction(transaction);

            expect(
                transactionPool.existingTransaction({ inputAddress: senderWallet.publicKey })
            ).toBe(transaction);
        });
    });
});