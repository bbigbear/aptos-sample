const Cart = require("../models/cartModel");
const NFT = require("../models/nftModel");
const AppError = require("../utils/appError");
const fs = require('fs') ;

exports.saveCart = async (req, res, next) => {

    const { nft_id } = req.body ;
    const user_id = req.user._id;
    let temp = await Cart.findOne({purchaser: user_id, nft_id: nft_id});
    if(temp) return next(new AppError(403, "fail", "cart duplicated")) ;
    let cart = await Cart.create({
        purchaser : user_id,
        nft_id : nft_id
    });
    await NFT.findByIdAndUpdate(nft_id, {orderType: 'ordered'});
    if(!cart) return next(new AppError(403, "fail", "cart create fail")) ;

    res.status(200).json({
        status : "success",
        message : "cart create success",
    })
}

exports.cancelCart = async (req, res, next) => {

    const { cart_id } = req.body ;
    
    let cart = await Cart.findOneAndRemove({_id: cart_id})
    if(!cart) return next(new AppError(403, "fail", "cart delete fail")) ;

    res.status(200).json({
        status : "success",
        message : "cart delete success",
    })
}

exports.addToCart = async (req, res, next) => {
    try {
        const { nft_id } = req.body;

        let cart = await Cart.create({
            nft_id,
            orderer : req.user._id
        });

        if(!cart) return next(new AppError(403, 'fail', 'add to cart')) ;

        res.status(200).json({
            status : 'success',
            message : 'add cart successfully'
        });
    } catch(err) {
        return next(new AppError(500, 'fail', 'internal server error'));
    }
}

exports.allCartList = async (req, res, next) => {
    try {   
        let allCartList = await Cart.find({});

        res.status(200).json({
            status : 'success',
            message : 'all cart list',
            allCartList
        });
    } catch(err) {
        return next(new AppError(500, 'fail', 'internal server error'));
    }
}

exports.cartList = async (req, res, next) => {
    try {
        let cartList = await Cart.find({orderer : req.user._id}) ;

        return res.status(200).json({
            status : 'success',
            message: 'order list',
            cartList
        });
    } catch(err) {
        return next(new AppError(500, 'fail', 'internal server error'));
    }
}