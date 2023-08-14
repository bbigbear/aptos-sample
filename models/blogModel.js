const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    title: {
        type: String,
        required : true,
    },
    description : {
        type : String,
        required : true
    },
    sections : {
        type : Array,
        required : true
    },
    folder_id : {
        type :String,
        required : true
    }
}, { timestamps: true });

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;