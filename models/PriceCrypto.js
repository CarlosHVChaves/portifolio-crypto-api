const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PayloadSchema = new mongoose.Schema({
    cryptoCurrencyId: Number,
    price: Number,
});

const PriceCryptoSchema = new Schema({
    payload: PayloadSchema,
    timestamp: {
        type: Date,
        required: true
    },
    timestamp_ms: {
        type: Number,
        required: true
    }
});

module.exports = PriceCrypto = mongoose.model('priceCrypto', PriceCryptoSchema);