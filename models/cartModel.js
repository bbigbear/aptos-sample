const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    orderer : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    nft_id : {
        type : Number
    }
}, { timestamps: true });

const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;