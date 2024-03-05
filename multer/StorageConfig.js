const multer =require('multer')

//storage
const pdfstorage=multer.diskStorage({

    destination:(req , file ,callback)=>{

        callback(null,'./upload_cirtificate')
    },
    filename:(req,file,callback)=>{
        callback(null,`file-${Date.now()}-${file.originalname}`)
    }
})

//file filtering

const pdffileFilter=(req,file,callback)=>{
    if(file.mimetype=== 'application/pdf'){
        callback(null,true)
    }
    else{
        callback(null,false)
        return callback(new Error('only accept pdf file'))
    }
}

//define upload
const uploadpdf = multer({storage:pdfstorage,fileFilter:pdffileFilter})

module.exports= uploadpdf