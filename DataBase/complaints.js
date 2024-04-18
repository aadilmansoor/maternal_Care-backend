


const mongoose = require('mongoose')

const complaintSchema = mongoose.model('complaintSchema',{
    senderId: {
        type: String,
       
    },
  
    receiverId:{
        type:String,
        
    },
   user_message:{
        type:String,
        // required:true
       
    },
    admin_message:{
        type:String,
  
    }


})

module.exports=complaintSchema