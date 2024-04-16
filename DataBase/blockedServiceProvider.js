
const mongoose = require('mongoose')

const blockedServiceProvider = mongoose.model('blockedServiceProvider',{
    username:{
        type:String,
        required:true

    },
    serviceProviderId:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    profile_image:{
        type:String

    },
    service:{
        type:String,
        required:true
    },
    specialization:{
        type:String,
        required:true
    },
    qualification:{
        type:String,
        required:true
    },
    experience_crt:{
        type:String,
        required:true
    },
    exp_year:{
       type:Number,
       required:true 
    },
    rate:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    }
    
   
    

})

module.exports = blockedServiceProvider