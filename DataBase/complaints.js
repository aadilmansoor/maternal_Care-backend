


//  Chat box


const mongoose = require('mongoose')

const complaintSchema = mongoose.model('complaintSchema',{
    senderId: {
        type: String,
       
    },
  
    receiverId:{
        type:String,
        
    },

message:{
    type:[]
}


})

module.exports=complaintSchema