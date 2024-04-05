const bcrypt=require('bcryptjs')
const jwt = require("jsonwebtoken");

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


exports.userLogin = async (req,res )=>{
    const { userEmail,userPassword}=req.body
    try {
        const exist_User = await users.findOne({userEmail,userPassword})
     if(exist_User!==null && exist_User!=undefined){
        const token =jwt.sign(
            {
                user_id : exist_User._id,
                user_email:exist_User.userEmail,
                user_name : exist_User.userName
            },
            "user_superkey2024",{expiresIn:'60m'}
        );
        res.status(200).json({exist_User,token})
     }

     else{
        res.status(404).json({message:"incorrect email and password"})
     }
    } 
    
    catch (error) {
        res.status(500).json({ message: " Request Not approved by admin" });
     
    }
}


// booking request by user
exports.bookingRequest = async (req,res)=>{
    // const {treatment_Type,care_type,scheduled_from,scheduled_to,location,serviceProvider_id,serviceProvider_email}= req.body
 
try{  

    const token = req.headers.authorization;
    if(!token){
        return res.status(401).json({message: "Unauthorized: No token provided"})
    }
    verify(token,"user_superkey2024", async (err , decoded)=>{
      if  (err){

            return res.status(403).json({ message: 'Forbidden: Invalid token' });

        }
        const userId = decoded.user_id
       const user_email = decoded.user_email
       const user_name = decoded.user_name

       console.log(userId,user_email,user_name);

    })
//     const response = await users.findOne({userEmail:user_email,_id:userId})
//     if(response)
// { const newUser = await bookingRequests({user_email,user_name,userId,treatment_Type,care_type,scheduled_from,scheduled_to,location,serviceProvider_id,serviceProvider_email,serviceProvider_status:"pending"})
//  await newUser.save()
//  res.status(200).json({newUser,message:"booking successfully,admin will contact you soon"})
// }
// else
// {
// res.status(400).json({message:"please register first"})
// }
}


 catch(error){
    res.status(500).json(error)

}
}


