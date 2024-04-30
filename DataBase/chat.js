


//  Chat box




//  Chat box


const mongoose = require('mongoose')

const chat = mongoose.model('chat',{
  userId:{
    type:String
  },
  username:{
    type:String
  },
 
message:{
    type:[]
},

userUnreadcount:{
  type:Number,
  default: 0
},
adminUnreadcount:{
  type:Number,
  default: 0
},

})

module.exports=chat