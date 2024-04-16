
//1) import mongoose
const mongoose = require('mongoose')

//2) Define Schema to store user collection
const bookingSchema = new mongoose.Schema({
    userEmail:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    typeOfCare:{
        type:String,
        required:true
    },
    services:{
        type:String,
        required:true
    },
    startingTime:{
        type:String,
        required:true
    },
    endingTime:{
        type:String,
        required:true
    },
    startDate:{
        type:String,
        required:true
    },
    endDate:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    serviceProviderName:{
        type:String,
        required:true
    },
    service:{
        type:String,
        required:true
    },
    serviceProviderId:{
        type:String,
        required:true
    },
    profile_img:{
        type:String,
        required:true
    },
    serviceProviderEmail:{
        type:String,
        required:true
    },
    serviceProviderMobile:{
        type:String,
        required:true
    },
    rate:{
        type:Number,
        required:true
    },
    workinghours:{
        type:Number,
        required:true
    },
    amountPaid:{
        type:Number,
        required:true
    },
    amountStatus:{
        type:String,
        required:true
    },
    serviceProviderStatus:{
        type:String,
        required:true
    },
    adminStatus:{
        type:String,
        required:true
    },
    bookingPeriod:{
        type:String
    }

})

//3) Create a model to store user
const Bookings= mongoose.model('Bookings',bookingSchema)

//4) Export model
module.exports=Bookings