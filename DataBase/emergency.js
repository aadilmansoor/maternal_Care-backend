const mongoose = require('mongoose')

const emergency = mongoose.model('emergency',{

    emergency_support:{
        type:String,
       
    },
    location:{
        type:String,
        
    },
    phonenumber:{
        type:String,
        
    }

})
module.exports=emergency