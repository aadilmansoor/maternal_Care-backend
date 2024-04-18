


const mongoose = require('mongoose')

const reviews = mongoose.model('reviews',{
    serviceProviderId:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,    
    },
    date:{
        type:String,
        required:true
    },
    ratings:{
        type:Number,
        required:true
    },
    comments:{
        type:String,
        required:true
    }


})

module.exports=reviews