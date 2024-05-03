


//  Chat box


const mongoose = require('mongoose')

const complaintSchema = mongoose.Schema({
    userId: {
        type: String,
       required:true
    },
  
    name:{
        type:String,
        required:true
    },

subject:{
    type:String,
    required:true

},

reason:{
    type:String,
    required:true

}


},{ timestamps: true })

const complaint = mongoose.model('complaintSchema',complaintSchema)
module.exports=complaint