const multer =require('multer')

//storage
const imgstorage=multer.diskStorage({

    destination:(req , file ,callback)=>{

        callback(null,'./webinarImage')
    },
    filename:(req,file,callback)=>{
        callback(null,`image-${Date.now()}-${file.originalname}`)
    }
})

//file filtering

const imgfileFilter=(req,file,callback)=>{
    if(file.mimetype=='image/png'|| file.mimetype=='image/jpg'|| file.mimetype=='image/jpeg'){
        callback(null,true)
    }
    else{
        callback(null,false)
        return callback(new Error('only accept pdf file'))
    }
}

//define upload
const uploadwebinar = multer({storage:imgstorage,fileFilter:imgfileFilter})

module.exports= uploadwebinar