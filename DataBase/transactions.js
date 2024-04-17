

const mongoose = require('mongoose')

const transactions = mongoose.model('transactions',{
    bookingId:{
        type:String,
        required:true
    },
    fromID:{
        type:String,
        required:true
    },
    from_Name:
  {
        type:String,
        required:true
    },
    
    To_ID:{
        type:String,
        required:true
    },
    To_Name:{
        type:String,
        required:true
    },
  
   Date:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    Status:{
        type:String,
        required:true
    }
    

})

module.exports=transactions