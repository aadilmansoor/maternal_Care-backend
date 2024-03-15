
const mongoose = require('mongoose')

const admindetails = mongoose.model('admindetails',{
    username:{
        type:String,
        required:true,unique:true
    },
    password:{
        type:String,
        required:true,unique:true
    },
    gmail:{
        type:String,
        required:true,unique:true
    }

})
module.exports=admindetails







