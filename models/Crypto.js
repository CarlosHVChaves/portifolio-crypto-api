const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PayloadSchema = new mongoose.Schema({
    name: String,
    symbol: String,
    amount: Number,
});

const CryptoSchema = new Schema({
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

module.exports = Crypto = mongoose.model('crypto', CryptoSchema);