//1) import mongoose
const mongoose = require('mongoose')

//2) Define Schema to store user collection
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    date:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
})
//3) Create a model to store user
const Blog= mongoose.model('Blog',blogSchema)

//4) Export model
module.exports=Blog