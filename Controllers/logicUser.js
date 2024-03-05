const bcrypt=require('bcryptjs')
const users = require('../DataBase/modelUser')

//User Registration
exports.userRegistration= async(req,res)=>{

    const {userName,userEmail,userPassword,userPhoneNumber,userAddress} = req.body
    
    try{

        const newUser = await users ({userName,userEmail,userPassword,userPhoneNumber,userAddress})
           await newUser.save()
           res.status(200).json(newUser)
    }
    catch(error){
        res.status(500).json(error)

    }
}

