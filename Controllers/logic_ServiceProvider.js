// token import
const jwt = require("jsonwebtoken");

const approvedservicerproviders = require("../DataBase/approvedServiceProvider");
// schema import
const servicerproviders = require("../DataBase/modelServiceProvider");

//booking request data collection
const bookingRequests = require("../DataBase/bookingRequest");

const attendance_ServiceProvider = require("../DataBase/attendance_ServiceProvider");

exports.serviceProviderRegistration = async (req, res) => {
  const exp_crt = req.file.filename;
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
  const img = req.file.filename;
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
        },
        "superkey2024"
      );

      res
        .status(200)
        .json({ existingUser, token, message: "login Successfully" });
    } else {
      res.status(404).json({ message: "incorrect username or password" });
    }
  } catch (error) {
    res.status(500).json({ message: " Request Not approved by admin" });
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

//service provider accept user bboking request

exports.accept_bookingRequest_by_serviceprovider = async (req, res) => {
  const { _id } = req.body;
  try {
    const response = await bookingRequests.findOne({ _id });
    if (response) {
      const filter = { _id };
      const update = {
        $set: { serviceProvider_status: "Accepted" },
      };
      const result = await bookingRequests.updateOne(filter, update);
      console.log(result);
      if (result.modifiedCount == 1) {
        const preUser = await bookingRequests.findOne({ _id });
        res.status(200).json({ preUser, message: "Accepted successfully" });
      } else {
        res.status(400).json({ message: " failed" });
      }
    } else {
      res.status(200).json({ message: " no user present" });
    }
  } catch (error) {
    res.status(500).json({ message: " server error" });
  }
};

//service provider Reject user booking request
exports.reject_bookingRequest_by_serviceprovider = async (req, res) => {
  const { _id } = req.body;
  try {
    const response = await bookingRequests.findOne({
      _id,
      serviceProvider_status: "pending",
    });
    if (response) {
      const filter = { _id };
      const update = {
        $set: { serviceProvider_status: "Rejected" },
      };
      const result = await bookingRequests.updateOne(filter, update);
      console.log(result);
      if (result.modifiedCount == 1) {
        const preUser = await bookingRequests.findOne({ _id });
        res.status(200).json({ preUser, message: "Rejected successfully" });
      } else {
        res.status(400).json({ message: " failed" });
      }
    } else {
      res.status(400).json({ message: " no user present" });
    }
  } catch (error) {
    res.status(500).json({ message: " server error" });
  }
};


//Attendance of service provider

exports.attendanceServiveProvider = async(req,res)=>{
  const {date,time_in ,time_out,workingHours,serviceProviderId,present} = req.body

  const user = await approvedservicerproviders.findOne({_id : serviceProviderId})
  try
  {
    const check = await attendance_ServiceProvider.findOne({serviceProviderId,date,present:true})
    
    if(check){
      res.status(401).json({message:"already marked"})
      
      }
      else{
        const newUser = new attendance_ServiceProvider({
          date,time_in ,time_out,workingHours,serviceProviderId,present})
          await newUser.save()
    res.status(200).json({newUser,message:"attendance marked"})
      }
      
  }
  
catch(error)
{
  res.status(500).json({error, message:"server error"})
}
}
