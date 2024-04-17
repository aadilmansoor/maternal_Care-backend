


const mongoose = require('mongoose')

const complaintSchema = mongoose.model('complaintSchema',{
    senderId: {
        type: String,
       
    },
    senderName:{
        type:String
     },
    receiverId:{
        type:String,
        
    },
    message:{
        type:String,
        required:true
       
    },


})

module.exports=complaintSchema