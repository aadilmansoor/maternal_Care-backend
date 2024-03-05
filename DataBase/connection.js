const mongoose = require('mongoose')
mongoose.connect(process.env.baseurl,{
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(()=>{
    console.log("mongodb connected successfully");
}).catch((err)=>{
    console.log("connected error"+err);
}

)