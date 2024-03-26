
mongoose = require('mongoose')

const attendance_ServiceProvider = mongoose.model('attendance_ServiceProvider',{
    date:{
        type:String,
        required:true
    },
    time_in:{
        type:String,
        required:true

    },
    time_out:{
        type:String,
        required:true
    },
    workingHours:{
        type:Number,
        required:true
    },
    serviceProviderId:{
        type:String,
        required:true
    },
    present:{
        type:Boolean,
        require:true
    }
})

module.exports = attendance_ServiceProvider