const NFT = require("../models/nftModel");
const Cart = require("../models/cartModel");
const AppError = require("../utils/appError");
const fs = require('fs') ;

exports.listNFTs = async (req, res, next) => {

    let nfts = await NFT.find();

    res.status(200).json({
        status : 'success',
        nfts : nfts
    }) ;
}

exports.listOrderedNFTs = async (req, res, next) => {

    const user_id = req.user._id;

    let nfts = await Cart.find({purchaser: user_id}).populate({path:'nft_id', match: {orderType: 'ordered'}});

    res.status(200).json({
        status : 'success',
        nfts : nfts
    }) ;
}

exports.listNFTsByCart = async (req, res, next) => {
    const { user_id } = req.body ;
    let nfts = await Cart.find({purchaser: user_id}).populate('nft_id');

    res.status(200).json({
        status : 'success',
        nfts : nfts
    }) ;
}

exports.saveNFT = async ( req, res , next) => {

    let nft = await NFT.create(req.body) ;

    if(!nft) return next(new AppError(403, "fail", "nft save fail")) ;

    res.status(200).json({
        status : "success",
        message : "nft create success",
    })
}
