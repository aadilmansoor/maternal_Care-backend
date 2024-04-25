// token import
const jwt = require('jsonwebtoken')
// nodemailer import
const nodemailer = require('nodemailer');

const leaveRequests = require('../DataBase/leaveRequestSchema')

//booking request data collection
const users = require('../DataBase/modelUser')

const approved_booking = require('../DataBase/Admin_approved_Booking_Collections')

// schema import  for serviceprovider
const servicerproviders = require('../DataBase/modelServiceProvider')

//schema import for approved service provider
const approvedservicerproviders=require('../DataBase/approvedServiceProvider')

//schema attendance
const attendance_ServiceProvider = require("../DataBase/attendance_ServiceProvider");

// schema admin
const admindetails= require('../DataBase/modelAdmin')

// schema webinar

const webinarSchema = require('../DataBase/webinar_schema')

// Add blogs
const blogSchema = require('../DataBase/blog_Schema')

//schema for ready to book
const readytoBook= require('../DataBase/readytoBook')

const booking = require('../DataBase/booking')

const transactions = require('../DataBase/transactions')

const complaints = require('../DataBase/complaints')
//Admin Login
exports.adminlogin = async (req,res)=>{
    const {username,password}=req.body
    try{
        const response = await admindetails.findOne({username,password})
        if(response){
            res.status(200).json({response,message:"login successfully"})

        }
        else{
            res.status(400).json({message:"Incorrect username and password"})
        }

    }
    catch(err){

    }
}



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
    const {username,email,password,mobile,profile_image,service,specialization,qualification,experience_crt,exp_year,rate,location}=req.body
    try
    {
      
    const preUser = await approvedservicerproviders.findOne({email})
      if(preUser){
        res.status(400).json({message:"already approved"})
    }
    else{
   const newUser = new approvedservicerproviders({username,email,password,mobile,profile_image,service,specialization,qualification,experience_crt,exp_year,rate,location})
 await newUser.save()
//  const readyUser =new readytoBook({username,email,password,mobile,profile_image,service,specialization,qualification,experience_crt,exp_year,rate,location})
//  await readyUser.save()
 
 const response = await approvedservicerproviders.findOne({email})
 if(response){
  const id=response._id
  const readyUser =new readytoBook({username,serviceProviderId:id,email,password,mobile,profile_image,service,specialization,qualification,experience_crt,exp_year,rate,location})
  await readyUser.save()

    const result = await servicerproviders.deleteOne({email})
    console.log(result);
    textmessage='Your request as a service provider has been approved. You can now login to the platform and start offering your services.'
    subjectmail ='Service Provider Approval Confirmation'
    await sendConfirmationEmail(email,subjectmail,textmessage);
    res.status(200).json({message:"Successfully approved"})
  
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


async function sendConfirmationEmail(serviceProviderEmail,subjectmail,textmessage) {
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
        from: 'cc', // Admin's email address
        to: [serviceProviderEmail], // Service provider's email address
        subject:subjectmail ,
        text:textmessage
    });

    console.log('Confirmation email sent: ', info.messageId);
}

// reject service provider request by admin
exports.rejectionServiceProvider=async (req,res)=>{
  const {email}=req.body
  try
  {
    
 

  const result = await servicerproviders.deleteOne({email})
  console.log(result);
  textmessage='Your request as a service provider has been rejected by admin.for any queries please contact admin'
  subjectmail =' Rejected!!! '
  await sendConfirmationEmail(email,subjectmail,textmessage);
  res.status(200).json({message:"Rejected"})

}

catch(err){
  res.status(500).json({err,message:"server error"})
}
}








// get attendance of service provider on admin page
exports.attendanceViewServiceProvider = async (req, res) => {
    const { id , month, year } = req.body;
 
        try {
          
          const user = await attendance_ServiceProvider.find({ serviceProviderId: id });
  if(user){
    console.log(user);
    const filteredUser = user.filter(record => {
        const recordMonth = parseInt(record.date.split('-')[1]);
        const recordyear = parseInt(record.date.split('-')[2]);
        // console.log(parseInt(month));
        // console.log(recordMonth);
        if (month && year)
          return recordMonth === parseInt(month) && recordyear === parseInt(year)// Compare with provided month value
        else if (month)
          return recordMonth === parseInt(month)
        else if (year)
          return recordyear === parseInt(year)

      });
      if (filteredUser.length > 0) {
        const sum = filteredUser.reduce((a,b)=>a + b.workingHours,0)
        res.status(200).json({filteredUser,sum});

      }
      else {
        res.status(200).json({ message: "no attendance found" });
      }

   
  }
  
          // res.status(200).json(filtereduser);
        } 
        catch (error) {
          console.error("Error while fetching user data:", error);
          res.status(500).json({ message: "Internal Server Error" });
        }
   
  }

  // get all leave request on admin page

  exports.gelAllLeaveRequests=async(req,res)=>{
   try {
    const allReq=await leaveRequests.find()
    res.status(200).json({allReq,message:'List of all leave req'})

   } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });

   }
  }

  //Logic to reject leave request
exports.rejectLeaveReq=async(req,res)=>{
  console.log('inside api call to reject leave req')
  const{id}=req.body
  try {
      const rejectReq = await leaveRequests.findByIdAndUpdate(
          id,
          
          {
            $set: {
              status:'Rejected'
            },
          },
          { new: true }
        );
        const mail=rejectReq.email
        console.log(mail);
        textMessage='Your Leave Application Rejected...! Please Contact Your Admin Personally For Any Queries...'
        subject='Rejected Leave Request....!'
        sendConfirmationEmail(mail,subject,textMessage) 

        res.status(200).json({rejectReq,message:'Leave Request rejected'});
      
  } catch (error) {
      res.status(500).json({message:"Internal server error"}) 
  }
}

// logic to accept leave request
//Logic to accept leave request
exports.acceptLeaveReq=async(req,res)=>{
  console.log('inside api call to accept leave request')
  const{id}=req.body
  try {
      const user=await leaveRequests.findById(id)
      const userId=user.serviceProviderId
      const Date=user.date
      console.log(userId,Date)

      const checkServiceProvider=await attendance_ServiceProvider.findOne({serviceProviderId:userId,date:Date})
      console.log(checkServiceProvider);
      if(checkServiceProvider){
          res.status(404).json({message:'Connot Approve Leave Request Due to service Provider already marked attandence on same date'})
      }else{
          console.log("insideattendance");

          const acceptReq = await leaveRequests.findByIdAndUpdate(
              id,
              
              {
                $set: {
                  status:'Accepted'
                },
              },
              { new: true }
            );
            const mail=acceptReq.email
            console.log(mail);
            textMessage='Your Leave Application is Accepted'
            subject='Leave Request Accepted'
            sendConfirmationEmail(mail,subject,textMessage) 
            const newUser = new attendance_ServiceProvider({
              date:Date,  serviceProviderId:userId, present:"false"
            })
            await newUser.save()
            // res.status(200).json({ newUser, message: "attendance marked" })
  

            res.status(200).json({acceptReq,message:'Leave Request Accepted'});
          
      }

      } catch (error) {
          res.status(500).json({message:"Internal server error"}) 
      }


}

// add webinar
exports.webinarRegistration =async(req,res)=>{

const {title,topics,date,time,description,speaker}= req.body

const img = req.file.filename
const image = `http://localhost:4000/webinarImage/${img}` 


try {
  const user = new webinarSchema({title,topics,date,time,description,speaker,image})
await user.save()
const getUser = await webinarSchema.findOne({title,topics,date,time,description,speaker})
res.status(200).json({getUser,message:"webinar added succesfully"})
  
} catch (error) {
  res.status(500).json({error})
  
}


}

// Add blogs 

exports.blogRegistration =async(req,res)=>{

  const {title,date,description}= req.body
  
  const img = req.file.filename
  const image = `http://localhost:4000/blogImage/${img}` 
  
  
  try {
    const user = new blogSchema({title,date,description,image})
  await user.save()
  const getUser = await blogSchema.findOne({title,date})
  if(!getUser){
    res.status(400).json({message:"blogs already added"})
  }
  res.status(200).json({getUser,message:"blogs added succesfully"})
    
  } catch (error) {
    res.status(500).json({error})
    
  }
    
  }

  //booking view on admin page

  exports.viewAllBooking = async(req,res)=>{
    try {
      const user = await booking.find()
      if(!user){
        res.status(400).json({message:"no bookings "})
      }
      else{
        res.status(200).json({user, message:"listed successfully"})
      }
    } catch (error) {
      res.status(500).json({message:"server error"})

    }
  }

  //get service provider accepted request
  exports.viewacceptedBooking = async(req,res)=>{
    try {
      const user = await booking.find({serviceProviderStatus: "accepted"})
      if(!user){
        res.status(400).json({message:"no bookings available "})
      }
      else{
        res.status(200).json({user, message:"listed successfully"})
      }
    } catch (error) {
      res.status(500).json({message:"server error"})

    }
  }

   //get  reject request
   exports.viewrejectedBooking = async(req,res)=>{
    try {
      const user = await booking.find({serviceProviderStatus: "rejected"})
      if(!user){
        res.status(400).json({message:"no bookings available "})
      }
      else{
        res.status(200).json({user, message:"listed successfully"})
      }
    } catch (error) {
      res.status(500).json({message:"server error"})

    }
  }

     //get  pending request
     exports.viewpendingBooking = async(req,res)=>{
      try {
        const user = await booking.find({serviceProviderStatus: "pending"})
        if(!user){
          res.status(400).json({message:"no bookings available "})
        }
        else{
          res.status(200).json({user, message:"listed successfully"})
        }
      } catch (error) {
        res.status(500).json({message:"server error"})
  
      }
    }


// accept booking by admin

exports.confirmBooking = async(req,res)=>{

   const {id}=req.body
  try {
    const user= await booking.findById(id)
    if (!user){



      res.status(400).json({message:"No booking present"})
    }
    else{
      if(user.serviceProviderStatus==="rejected" ||user.serviceProviderStatus==="pending" ){
       res.status(401).json({message:"can not approve unless service provider accepted"})
      }
       const updatedBooking = await booking.findOneAndUpdate(
          { _id: id ,serviceProviderStatus: "accepted" ,
          adminStatus:"pending"},
          { $set: { adminStatus:"approved" } },
          { new: true }
        );
    console.log(updatedBooking);
        if (!updatedBooking) {
          return res.status(404).json({ message: "Booking  already processed" });
        }
    
        res.status(200).json({ booking: updatedBooking , message:"booking accepted"});

    }


  } catch (error) {
    res.status(500).json({message:"server error"})

  }
}

// salary calculation of service provider

exports.salaryCalculation = async(req,res)=>{
  const {serviceProviderId,month,year }= req.body
  const users = await attendance_ServiceProvider.find({
    serviceProviderId:serviceProviderId,present: true})

    const filteredUser = users.filter(record => {
      const recordMonth = parseInt(record.date.split('-')[1]);
      const recordyear = parseInt(record.date.split('-')[2]);
      // console.log(parseInt(month));
      // console.log(recordMonth);
      if (month && year)
        return recordMonth === parseInt(month) && recordyear === parseInt(year)// Compare with provided month value
     else{
      res.status(400).json({message:"enter month and year"})
     }

    });
    if (filteredUser.length > 0) {
      const sum = filteredUser.reduce((a,b)=>a + b.workingHours,0)
      const data = await approvedservicerproviders.findOne({_id:serviceProviderId})
      const rate = data.rate;
      totalSalary=sum*rate;
      res.status(200).json({totalSalary});

    }
    else{
      res.status(404).json({message:"found Leave for the month"})
    }
  }

  exports.salaryPayment = async(req,res)=>{
  const {To_ID ,To_Name,amount,email}=req.body
  const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
 
 try {
  const payment = await transactions.findOne({To_ID ,To_Name,amount,Date:date})
  if(payment){
    res.status(400).json({message:"Payment already done"})
  }
 else{
  const transaction = new transactions({
    bookingId:"123456",
    fromID: "65f3c3454247fe18fe09ed2e",
    from_Name: "admin",
    To_ID: To_ID,
    To_Name: To_Name,
    Date: date,
    amount:amount,
    Status: "debited"
});
console.log(transaction);
await transaction.save()
const user = await transactions.findOne({ bookingId:"123456",
fromID: "65f3c3454247fe18fe09ed2e",
from_Name: "admin",
To_ID: To_ID,
To_Name: To_Name,
Date: date,
amount:amount,
Status: "debited"})
if(user){
  textMessage=`your salary ${amount} credited to your account`
            subject='Salary Credited!!!'
            sendConfirmationEmail(email,subject,textMessage) 
            res.status(200).json({user,message:"Salary transfered successfully"})

}

else{
  res.status(401).json({message:"payment failed"})
}
 }
 } catch (error) {
  res.status(500).json({message:"internal server error"})

 }
  }

//   exports.chatPostfromAdmin= async(req,res)=>{

//     const {userID,message}= req.body

// try {
//     const newUser = await complaints({senderId:"admin123",receiverId:userID,admin_message:message})
//     await newUser.save()
//     res.status(200).json({message:"message sent"})
// } catch (error) {
//     res.status(500).json({ message: 'message sent error' });  

// }
//   }