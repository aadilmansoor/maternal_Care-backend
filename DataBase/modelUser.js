
const mongoose = require('mongoose')

const users = mongoose.model('users',{
    userName:{
        type:String,
        required:true
    },
    userEmail:{
        type:String,
        required:true,unique:true
        
    },
    userPassword:{
        type:String,
        required:true
    },
    userPhoneNumber:{
        type:String,
        required:true
    },
    userAddress:{
        type:String,
        required:true
    }


})

module.exports=users