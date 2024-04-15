

const mongoose = require('mongoose')

const categories = mongoose.model('categories',{
    mainCategory: {
        type: String,
        required: true
    },
    subCategory: [{
        name: String
    }]

})
module.exports=categories