const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        unique : true ,
        required : true,
    },
    password: {
        type: String,
        required : true
    },
    is_email_verified : {
        type : Boolean,
        required : true
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;