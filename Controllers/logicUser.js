const bcrypt=require('bcryptjs')
const jwt = require("jsonwebtoken");


const users = require('../DataBase/modelUser')

const categories = require('../DataBase/schemaCategory')

const webinarSchema = require('../DataBase/webinar_schema')

const blogSchema = require('../DataBase/blog_Schema');
const readytoBook = require('../DataBase/readytoBook');
const { response } = require('express');
const Bookings = require('../DataBase/booking');
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

// get all category
exports.getallcategories = async (req,res)=>{
    try {
        const newUser = await categories.find()
        
        res.status(200).json({newUser})

    } catch (error) {
      res.status(500).json({message:"server error"})
    }
}

//get all subcategory
exports.getallSubcategories = async (req,res)=>{
    const {mainCategory} = req.body
    try {
        const newUser = await categories.findOne({mainCategory})
        
        res.status(200).json({newUser})

    } catch (error) {
      res.status(500).json({message:"server error"})
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




// get all webinar
exports.webinarView = async(req,res)=>{
    try {
        
        const webinar = await webinarSchema.find()
        if(!webinar){
            res.status(400).json({message:"no webinar founded"})
        }

        else{
            res.status(200).json({webinar,message:"webinar fetched successfully"})
        }

    } catch (error) {
        
    }
}


// get all blogs
exports.blogsView = async(req,res)=>{
    try {
        
        const blog = await blogSchema.find()
        if(!blog){
            res.status(400).json({message:"no webinar founded"})
        }


        else{
            res.status(200).json({blog,message:"webinar fetched successfully"})
        }

    } catch (error) {
        res.status(500).json(error)
    }
}


// api for searching service provider by location and service

exports.searchServiceprovider = async (req, res) => {
    console.log('inside api call to search service provider');
    const { location, service } = req.body;
    try {
        const searchUser = await readytoBook.find({ location, service });
        if (searchUser.length === 0) {
            res.status(400).json({ message: 'No service provider available' });
        } else {
            res.status(200).json({ searchUser, message: 'List of service providers in this location' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }

  };

  //  service booking
  exports.primaryBooking= async(req,res)=>{
  
  
       const {typeOfCare,services,startingTime,
        endingTime,startDate,endDate,location,
        serviceProviderName,service,serviceProviderId,
        profile_img,serviceProviderEmail,
        serviceProviderMobile,rate,workinghours,amountPaid} = req.body
        const formattedStartTime = formatToTime(startingTime);
        const formattedEndTime = formatToTime(endingTime);

        // console.log(formattedTime); // Output: "10:00"
        try {
            const token = req.headers.authorization;
            console.log(token);
                if (!token) {
                  return res.status(401).json({ message: "Unauthorized: No token provided" });
                }
            jwt.verify(token, "user_superkey2024", async (err, decoded) => {
                if (err) {
                  return res.status(403).json({ message: 'Forbidden: Invalid token' });
                }
           
                const userEmail= decoded.user_email
              
               const userName=decoded.user_name
               const userId =decoded.user_id
 


                const user = await  Bookings({userEmail,userName,userId,typeOfCare,services,startingTime:formattedStartTime,
                    endingTime:formattedEndTime,startDate,endDate,location,
                    serviceProviderName,service,serviceProviderId,
                    profile_img,serviceProviderEmail,
                    serviceProviderMobile,rate,workinghours,amountPaid,amountStatus:"unpaid",serviceProviderStatus:"pending",
                    adminStatus:"pending"})
                    

                await user.save()
                  res.status(200).json({user,message:"saved succesfully"})
               
            } )    } catch (error) {
            res.status(500).json({message:"internal server error"})

        }
       }

// conversion to time
       function formatToTime(number) {
        const formattedTime = `${number.toString().padStart(2, '0')}:00`;
        return formattedTime;
      }
      
     
    // get unpaid service booking  bill 

    exports.getUnpaidBill = async(req,res)=>{
        try {
            const token = req.headers.authorization;
            console.log(token);
                if (!token) {
                  return res.status(401).json({ message: "Unauthorized: No token provided" });
                }
            jwt.verify(token, "user_superkey2024", async (err, decoded) => {
                if (err) {
                  return res.status(403).json({ message: 'Forbidden: Invalid token' });
                }
           
                const userEmail= decoded.user_email
              
               const userName=decoded.user_name
               const userId =decoded.user_id
 
            const bill = await Bookings.find({amountStatus:"unpaid"})
          
            if(bill.length>0){
                res.status(200).json({bill,message:"bill fetched successfully"})
            }
            else{
                res.status(400).json({message:"No bill to Paid"})

            }

          
               
            } )    } catch (error) {
            res.status(500).json({message:"internal server error"})

        }
    }

    //get  booking status of user



    exports.getbookingDetails = async(req,res)=>{
        try {
            const token = req.headers.authorization;
            console.log(token);
                if (!token) {
                  return res.status(401).json({ message: "Unauthorized: No token provided" });
                }
            jwt.verify(token, "user_superkey2024", async (err, decoded) => {
                if (err) {
                  return res.status(403).json({ message: 'Forbidden: Invalid token' });
                }
           
                const userEmail= decoded.user_email
              
               const userName=decoded.user_name
               const userId =decoded.user_id
 
            const user = await Bookings.find({userId:userId})
          
            if(user.length>0){
                res.status(200).json({user,message:" fetched successfully"})
            }
            else{
                res.status(400).json({message:"No bookings available"})

            }

          
               
            } )    } catch (error) {
            res.status(500).json({message:"internal server error"})

        }
    }
