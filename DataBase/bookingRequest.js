const mongoose = require('mongoose')

const bookingRequests = mongoose.model('bookingRequests',{

    user_email:{
        type:String,
        required:true,
        unique:true
    },
     user_name:{
        type:String,
        required:true,
        unique:true
    },

    userId:{
        type:String,
        required:true,
        unique:true
    },

    treatment_Type:{
        type:String,
        required:true,
    },

    care_type:{
        type:String,
        required:true,
    },

    scheduled_from:{
        type:String,
        required:true
    },

    scheduled_to:{
        type:String,
        required:true
    },

    location:{
        type:String,
        required:true
    },

    serviceProvider_id:{
        type:String,
        required:true
    },

    serviceProvider_email:{
        type:String,
        required:true
    },

    serviceProvider_status:{
            type:String
           
    }
})

module.exports = bookingRequests