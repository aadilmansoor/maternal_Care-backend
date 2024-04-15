const mongoose = require('mongoose')

const leaveRequests = mongoose.model('leaveRequests', {

    serviceProviderId : {
            type:String,
            required:true
    },
    name:{
        type:String,
        required:true
    },
            image:{
                type:String,
                required:true
            },
    email:{
        type:String,
        required:true
    },
    date: {
        type:String,
        required:true
    },
    reason: {
        type:String,
        required:true
    },
    additionalNotes: {
        type:String
    },
    status: {
        type:String,
        required:true
    }

})

module.exports = leaveRequests