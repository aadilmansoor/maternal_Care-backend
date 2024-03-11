// token import
const jwt = require('jsonwebtoken')
// nodemailer import
const nodemailer = require('nodemailer');
//booking request data collection
const bookingRequests = require('../DataBase/bookingRequest')



// schema import  for serviceprovider
const servicerproviders = require('../DataBase/modelServiceProvider')

//schema import for approved service provider
const approvedservicerproviders=require('../DataBase/approvedServiceProvider')


// view all service provider request list on admin page

exports.getServiceProviderRequest= async(req,res)=>{
    console.log('inside api call to get all service providers');
   try{


    const response = await servicerproviders.find()
    res.status(200).json({response, message:"list of all service providers request"})
   }
   catch(error){
 res.status(500).json({error,message:"failed to fetch data"})
   }
}

// view all approved service provider list

exports.getApprovedServiceProviderList = async (req,res)=>{

try{
    const response = await approvedservicerproviders.find()
    res.status(200).json({response, message:"list of all approved service providers"})

}
catch(error){
res.status(500).json({error,message:"failed to fetch data"})
}


}



// Aproval of service provider by admin and delete the same from serviceprovider requestlist

exports.approvalServiceProvider=async (req,res)=>{
    const {username,email,password,mobile,profile_image,service,specialization,qualification,experience_crt,exp_year,rate}=req.body
    try
    {
      
    const preUser = await approvedservicerproviders.findOne({email})
      if(preUser){
        res.status(400).json({message:"already approved"})
    }
    else{
   const newUser = new approvedservicerproviders({username,email,password,mobile,profile_image,service,specialization,qualification,experience_crt,exp_year,rate})
 await newUser.save()
 const response = await approvedservicerproviders.findOne({email})
 if(response){
    const result = await servicerproviders.deleteOne({email})
    console.log(result);
    res.status(200).json({message:"Successfully approved"})
    await sendConfirmationEmail(email);
 }
 else{
    res.status(404).json({message:"approval failed"})}

}
}
catch(err){
    res.status(500).json({err,message:"server error"})
}
}


// mail send


async function sendConfirmationEmail(serviceProviderEmail) {
    // Create a Nodemailer transporter using SMTP
    const transporter = nodemailer.createTransport({
        service:'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.gmail, // Admin's email
            pass: process.env.gmailpsw // Admin's password
        }
    });
    

    // Send mail with defined transport object
    const  info = await transporter.sendMail({
        from: 'projectmern123@gmail.com', // Admin's email address
        to: [serviceProviderEmail], // Service provider's email address
        subject: 'Service Provider Approval Confirmation',
        text: 'Your request as a service provider has been approved. You can now login to the platform and start offering your services.'
    });

    console.log('Confirmation email sent: ', info.messageId);
}


// get all details of booking details



exports.getBookingRequest = async (req,res)=>{

    try{
        const response = await bookingRequests.find()
        res.status(200).json({response, message:"list of all booking request"})
    
    }
    catch(error){
    res.status(500).json({error,message:"failed to fetch data"})
    }
    
    }
    

// admin approval for request

// exports.admin_approval_bookingrequest = async( req,res)=>{
//     const {_id}=req.body
//     try{
//         const response = await bookingRequests.findOne({_id,serviceProvider_status:"Accepted"})
//         if(response){
//          console.log(response);
//         }
//         else{
//             res.status(400).json({message:" no user present"})

//         }

//     }
//     catch(error){
//         res.status(500).json({message:" server error"})

//     }
// }
