const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const bcrypt = require('bcrypt') ;
const passportConfig = require('../config/passportConfig') ;
const { sendEmailVerifyLink } = require('../utils/sendMail') ;
const { v4: uuidv4 } = require('uuid');

const createPassword = async (password , callback) => {
    bcrypt.genSalt(10 , function(err, salt) {
        if(err) return next(new AppError(400 , "fail" , "generate salt failed")) ;

        bcrypt.hash(password, salt, function(err, hash) {
            if(err) return next(new AppError(400 , "fail" , "password hash failed")) ;
            else return callback(hash) ;
        });
    })
}

const comparePassword = async (password , db_password , next , callback) => {
    bcrypt.compare(password , db_password ,function(err , isMatch) {
        if(err) return next(new AppError(40 , "compare" , "compare password failed"))
        else return callback(isMatch) 
    })
}

const tokenForUser = async (userInfo, next, callback) => {
    jwt.sign({
        user : userInfo
    } , 
    passportConfig.JWT_SECRET_OR_KEY , 
    {
        expiresIn : passportConfig.JWT_TOKEN_EXPIRATION
    } , function (err , token) {
        if(err) return next(new AppError(403 , "token" , "provide token failed"))
        else return callback(token)
    }) ;
}

exports.signUp = async ( req, res , next) => {

    const { email, password, confirm_password } = req.body ;

    if(password !== confirm_password){
        return next(new AppError(403, "fail", "password didn't match")) ;
    }
    await createPassword(password , async (hash) => {
        let user = await User.findOne({
            email :  email
        }) ;

        if(user) return next(new AppError(403, "fail", "user already exist")) ;

        user = await User.create({
            email : email,
            is_email_verified : false,
            password : hash
        }) ;

        if(!user) return next(new AppError(403 , "fail" , "user create failed.") ) ;
        else {
            res.status(200).json({
                status : "success",
                message : "user created successfully",
            })
        }
    }) ;
}

exports.signIn = async (req, res, next) => {
    const { email, password } = req.body ;

    let user = await User.findOne({
        email : email
    }) ;

    if(!user) return next(new AppError(201 , "unknown" , "Unknown User") ) ;

    await comparePassword(password , user.password , next , async (isMatch) => {
        if(isMatch) {
            // if(!user.is_email_verified) {
            //     let verify_code = uuidv4() ;
                
            //     user.email_verify_code = verify_code ;
            //     await user.save() ;

            //     // await sendEmailVerifyLink('http://10.10.10.186:3000/emailVerify/verify_code=' + verify_code, email) ;

            //     return res.status(201).json({
            //         status : "email" ,
            //         message : "Email isn't verified",
            //         code : verify_code
            //     })
            // }

            await tokenForUser(user , next , async (token) => {
                return res.status(200).json({
                    status : "success" ,
                    message : "login success.",
                    access_token : token ,
                })
            })
        } else {
            return res.status(403).json({
                status : "match" ,
                message : "Password isn't matched."
            })
        }
    }) ;
}

exports.userProfile = async (req, res, next) => {
    return res.status(200).json({
        profile : req.user
    })
}

exports.createProfile = async (req, res, next) => {
    let user = await User.updateOne({_id : req.user._id}, {
        ...req.body,
        is_profile_created: true 
    });

    if(!user) return next(new AppError(403 , "failed" , "create profile") ) ;

    return res.status(200).json({
        status : 'success',
        message: 'Profile is created'
    }) ;
  
}

exports.emailVerify = async (req, res, next) => {
    try {
        let { verify_code } = req.body ;

        let user = await User.updateOne({email_verify_code : verify_code} , {
            is_email_verified : true
        }) ;
    
        if(user.nModified) {
            return res.status(200).json({

            })
        }
        return res.status(201).json({
    
        }) ;

    } catch(err) {
       
    }
}

exports.forgotCode = async (req, res, next) => {
    try {
        let { email } = req.body ;

        let forgot_code = uuidv4() ;

        let user = await User.updateOne({email : email} , {
            forgot_code : forgot_code
        }) ;
    
        if(user.nModified) {
            return res.status(200).json({
                status : 'success',
                code : forgot_code
            })
        }

        return res.status(201).json({
    
        }) ;

    } catch(err) {
       
    }
}

exports.passwordChanged = async (req, res, next) => {
    try {
        let { change_code, new_password } = req.body ;

        await createPassword(new_password , async (hash) => {
            let user = await User.updateOne({forgot_code : change_code} , {
                forgot_code : null,
                password : hash
            }) ;

            if(user.nModified)  return res.status(200).json({
                status : 'success',
                message : 'Password is changed'
            })

            return res.status(200).json({
                status : 'failed',
                message: 'Password Change is failed'
            })
        }) ;
       
    } catch(err) {
        console.log(err) ;
    }
}