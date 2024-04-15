const mongoose = require('mongoose')

const complaints = mongoose.model('complaints', {
    date: {
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true 
    },


    serviceProviderId : {
            type:String,
            required:true
    },
    ServiceProvider_email:{
        type:String,
        required:true
    },
    
    reason: {
        type:String,
        required:true
    },
    complaint_Notes: {
        type:String
    }
    

})

module.exports = complaints