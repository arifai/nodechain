const cryptoHash = require('../cryto-hash');

describe('cryptoHash()', () => {
    it('generates a SHA-256 hashed output', () => {
        const sha256 = '9F86D081884C7D659A2FEAA0C55AD015A3BF4F1B2B0B822CD15D6C15B0F00A08'.toLowerCase();
        expect(cryptoHash('test')).toEqual(sha256);
    });

    it('produces the same hash with the same input arguments in any order', () => {
        expect(cryptoHash('one', 'two', 'three')).toEqual(cryptoHash('three', 'two', 'one'));
    });
});