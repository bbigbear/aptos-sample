const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    owner: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    wallet_address: {
        type: String,
        required : true
    },
    nft_id: {
        type: Number,
        required : true
    },
    nft_number: {
        type: Number,
        required : true
    },
    name: {
        type: String,
        required : true
    },
    description: {
        type: String,
        required : true
    },
    image: {
        type: String,
        required : true
    },
    custom_fields: {
        dna: {
            type: String,
            required : true
        },
        edition: {
            type: Number,
            required : true
        },
        date: {
            type: Number,
            required : true
        },
        compiler: {
            type: String,
            required : true
        }
    },
    attributes: {
        type : Array
    },
    orderType: {
        type: String,
        enum: ['ordered', 'sold', 'none'],
        default: 'none'
    }
}, { timestamps: true });

const NFT = mongoose.model("NFT", userSchema);

module.exports = NFT;