const bcrypt=require('bcryptjs')
const users = require('../DataBase/modelUser')
const bookingRequests = require('../DataBase/bookingRequest')
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


// booking request by user
exports.bookingRequest = async (req,res)=>{
    const {user_email,user_name,userId,treatment_Type,care_type,scheduled_from,scheduled_to,location,serviceProvider_id,serviceProvider_email}= req.body
 
try{  
    const response = await users.findOne({userEmail:user_email,_id:userId})
    if(response)
{ const newUser = await bookingRequests({user_email,user_name,userId,treatment_Type,care_type,scheduled_from,scheduled_to,location,serviceProvider_id,serviceProvider_email,serviceProvider_status:"pending"})
 await newUser.save()
 res.status(200).json({newUser,message:"booking successfully,admin will contact you soon"})
}
else
{
res.status(400).json({message:"please register first"})
}
}


 catch(error){
    res.status(500).json(error)

}
}


