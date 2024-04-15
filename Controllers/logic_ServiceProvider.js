// token import
const jwt = require("jsonwebtoken");

const leaveRequests = require('../DataBase/leaveRequestSchema')

const approvedservicerproviders = require("../DataBase/approvedServiceProvider");
// schema import
const servicerproviders = require("../DataBase/modelServiceProvider");

//booking request data collection

const attendance_ServiceProvider = require("../DataBase/attendance_ServiceProvider");
const Bookings = require("../DataBase/booking");

exports.serviceProviderRegistration = async (req, res) => {
  const exp_crtt = req.file.filename
const exp_crt = `http://localhost:4000/upload_cirtificate/${exp_crtt}` 
  // const image = req.file.filename
  const {
    username,
    email,
    password,
    mobile,
    service,
    specialization,
    qualification,
    exp_year,
    rate,
    location
  } = req.body;
  try {
    const existingUser = await servicerproviders.findOne({ email });
    const registereduser = await approvedservicerproviders.findOne({ email });
    if (existingUser || registereduser) {
      res.status(406).json({ message: "Account already exist" });
    } else {
      const newUser = new servicerproviders({
        username,
        email,
        password,
        mobile,
        profile_image: "",
        service,
        specialization,
        qualification,
        experience_crt: exp_crt,
        exp_year,
        rate,
        status: "pending",
        location
      });
      await newUser.save();
      res
        .status(200)
        .json({ newUser, message: "primary registration completed," });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// image upload of service provider
// exports.serviceProviderfinalRegistration = async(req,res)=>{
//     const {email}= req.body
//     const img = req.file.filename
//     console.log(email);
//     console.log(img);
//     try{

//         const existingUser = await servicerproviders.findOne({email:email})
//         if(!existingUser){
//             res.status(400).json({message:'primary registration failed'})
//         }
//         else
//         {
//             const filter={email};
//             const update={
//                 $set:{
//                     profile_img:img
//                 }

//         }
//         const result=await servicerproviders.updateOne(filter,update)
//             console.log(result);

//     if(result.modifiedCount==1){

//         const preUser=await servicerproviders.findOne({email})

//         res.status(200).json({preUser,message:'Photo succesfully uploaded'})
//     }
//     else{
//         res.status(404).json({message:'Photo upload faild'})
//     }
// }

// }
//     catch(error){
//         res.status(500).json(error)

//     }

// }
//Logic for secondary serviceProvider registration
exports.serviceProviderfinalRegistration = async (req, res) => {
  const image = req.file.filename;
  const img = `http://localhost:4000/serviceProviderImage/${image}` 

  const { email } = req.body;
  console.log(email);
  console.log(img);
  try {
    const existingUser = await servicerproviders.findOne({ email: email });
    if (!existingUser) {
      res.status(400).json({ message: "primary registeration faild" });
    } else {
      const filter = { email };
      const update = {
        $set: { profile_image: img },
      };
      const result = await servicerproviders.updateOne(filter, update);
      console.log(result);
      if (result.modifiedCount == 1) {
        const preUser = await servicerproviders.findOne({ email });
        res
          .status(200)
          .json({ preUser, message: "photo successfully updated" });
      } else {
        res.status(400).json({ message: "photo uploaded failed" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// login for approved service providers

exports.loginServiceProvider = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await approvedservicerproviders.findOne({
      email,
      password,
    });
    if (existingUser !== null && existingUser !== undefined) {
      const token = jwt.sign(
        {
          serviceProvider_Id: existingUser._id,
          email:existingUser.email,
          // name:existingUser.username,
          // image:existingUser.profile_image

        },
        "superkey2024",
        { expiresIn: '60m' }
      );
      res.status(200).json({ token,existingUser });
      // res
      //   .status(200)
      //   .json({ existingUser, token, message: "login Successfully" });
    } else {
      res.status(404).json({ message: "incorrect username or password" });
    }
  } catch (error) {
    res.status(500).json({ message: " Request Not approved by admin" });
  }
};

// attendance of service provider on his page by verify token
exports.attendanceView = async (req, res, next) => {
  const { month, year } = req.body;

  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    jwt.verify(token, 'superkey2024', async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
      }

      req.userId = decoded.serviceProvider_Id;

      try {
        const userId = req.userId;
        const user = await attendance_ServiceProvider.find({ serviceProviderId: userId });

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
          res.status(200).json(filteredUser);
        }
        else {
          res.status(401).json({ message: "no attendance found" });
        }

        next()

        // res.status(200).json(filtereduser);
      } catch (error) {
        console.error("Error while fetching user data:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



//get user request on  service provider page

exports.get_bookingRequest_to_serviceProvider = async (req, res) => {
  const { serviceProvider_id, serviceProvider_email } = req.body;
  try {
    const response = await bookingRequests.find({
      serviceProvider_id,
      serviceProvider_email,
      serviceProvider_status: "pending",
    });
    if (response.length > 0) {
      res.status(200).json({ response, message: "succesfully" });
    } else {
      res.status(400).json({ message: "No new booking requested" });
    }
  } catch (error) {
    res.status(500).json({ message: " server error" });
  }
};




//Attendance of service provider

exports.attendanceServiveProvider = async (req, res) => {
  const { date, time_in, time_out, workingHours, present } = req.body

  try {
    const token = req.headers.authorization;
console.log(token);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    jwt.verify(token, 'superkey2024', async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
      }
      req.userId = decoded.serviceProvider_Id;
    const userId =req.userId
    const user = await approvedservicerproviders.findOne({ _id:userId })
if(!user){
  res.status(400).json({message:"user not found"})
}
    const check = await attendance_ServiceProvider.findOne({ serviceProviderId:userId,date, time_in, time_out,workingHours, present: true })

    if (check) {
      res.status(401).json({ message: "already marked" })

    }
    else {
      const newUser = new attendance_ServiceProvider({
        date, time_in, time_out, workingHours, serviceProviderId:userId, present
      })
      await newUser.save()
      res.status(200).json({ newUser, message: "attendance marked" })
    }

  })
  }
  catch (error) {
    res.status(500).json({ error, message: "server error" })
  }
}

//Leave request of service provider

exports.leaveRequest=async(req,res)=>{
  
  const {date,reason,additionalNotes}= req.body

  try {
    
    const token = req.headers.authorization;
    console.log(token);
        if (!token) {
          return res.status(401).json({ message: "Unauthorized: No token provided" });
        }
        jwt.verify(token, 'superkey2024', async (err, decoded) => {
          if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
          }
          const userId = decoded.serviceProvider_Id;
          const emailId =decoded.email
         const user = await leaveRequests.findOne({serviceProviderId:userId ,date})
         const serviceProvider = await approvedservicerproviders.findOne({_id:userId})
         const image= serviceProvider.profile_image
         const name = serviceProvider.username
         if(user){
          res.status(400).json({message:"Leave Request already marked"})
         }
         else{
          const newleaveReq = new leaveRequests({
            serviceProviderId:userId,
            name,
            image,
            email:emailId,
            date,
            reason,
            additionalNotes,
            status:"pending"
          })
          await newleaveReq.save()
          res.status(200).json({newleaveReq,message:"Waiting for admin confirmation"})
         }


  })
  } catch (error) {
    res.status(500).json({message:"Internal server error"})

  }


}

// booking view by service provider

exports.bookingView =async (req,res)=>{
  try {
    const token = req.headers.authorization;
    console.log(token);
        if (!token) {
          return res.status(401).json({ message: "Unauthorized: No token provided" });
        }
        jwt.verify(token, 'superkey2024', async (err, decoded) => {
          if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
          }
          const serviceProviderId = decoded.serviceProvider_Id;
          console.log(serviceProviderId);
          const user = await Bookings.find({serviceProviderId:serviceProviderId})
          console.log(user);
          if(user.length>0){
            res.status(200).json({user,message:"successfully fetched"})

          }
          else{
            res.status(400).json({message:"No bookings available"})

          }
  })} catch (error) {
    res.status(500).json({message:"invalid token"})
  }
}