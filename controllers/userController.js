const User = require("../models/userModel");
const AppError = require("../utils/appError");

exports.createStripe = async ( req, res , next) => {

    const { stripe_customer_id, stripe_account_id } = req.body ;

    let user = await User.updateOne({_id : req.user._id} , {
        stripe_customer_id : stripe_customer_id,
        stripe_account_id : stripe_account_id
    }) ;

    if(!user) return next ( new AppError(403, 'createStripe', 'create stripe account is failed')) ;

    return res.status(200).json({
        status : 'success',
        message : 'stripe account is created successful'
    })
}

exports.incBalance = async ( req, res , next) => {

    const { amount } = req.body ;

    let user = await User.findOne({_id : req.user._id}) ;

    user = await User.updateOne({_id : req.user._id} , {
        stripe_balance : amount + user.stripe_balance
    }) ;

    if(!user) return next ( new AppError(403, 'createStripe', 'payment is failed')) ;

    return res.status(200).json({
        status : 'success',
        message : 'payment is successful'
    })
}