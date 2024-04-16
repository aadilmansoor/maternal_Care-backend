
//1) import mongoose
const mongoose = require('mongoose')

//2) Define Schema to store user collection
const transactions = new mongoose.Schema({
    bookingId:{
        type:String,
        required:true
    },
    fromID:{
        type:String,
        required:true
    },
    from_Name:
  {
        type:String,
        required:true
    },
    
    To_ID:{
        type:String,
        required:true
    },
    To_Name:{
        type:String,
        required:true
    },
  
   Date:{
        type:String,
        required:true
    },
    Status:{
        type:String,
        required:true
    }
    
})

//3) Create a model to store user
const transaction = mongoose.model('transactions',transactions)

//4) Export model
module.exports=transaction