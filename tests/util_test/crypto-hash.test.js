const cryptoHash = require('../../util/cryto-hash');

describe('cryptoHash()', () => {
    it('generates a SHA-256 hashed output', () => {
        const sha256 = '4D967A30111BF29F0EBA01C448B375C1629B2FED01CDFCC3AED91F1B57D5DD5E'.toLowerCase();
        expect(cryptoHash('test')).toEqual(sha256);
    });

    it('produces the same hash with the same input arguments in any order', () => {
        expect(cryptoHash('one', 'two', 'three'))
            .toEqual(cryptoHash('three', 'two', 'one'));
    });

    it('produces a unique hash when the properties have changed on an input', () => {
        const foo = {};
        const originalHash = cryptoHash(foo);
        foo['a'] = 'a';

        expect(cryptoHash(foo)).not.toEqual(originalHash);
    });
});