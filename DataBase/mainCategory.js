
const mongoose = require('mongoose')

const main_Category = mongoose.model('main_Category',{
    mainCategory:{
        type:String,
        required:true,unique:true
    },
    subCategory :{
        type:[]
    }
   

})
module.exports=main_Category