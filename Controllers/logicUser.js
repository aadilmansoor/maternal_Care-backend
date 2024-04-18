const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");

const users = require("../DataBase/modelUser");

const categories = require("../DataBase/schemaCategory");

const webinarSchema = require("../DataBase/webinar_schema");

const blogSchema = require("../DataBase/blog_Schema");
const readytoBook = require("../DataBase/readytoBook");
const { response } = require("express");
const Bookings = require("../DataBase/booking");
const transactions = require("../DataBase/transactions");
const cron = require("node-cron");
const reviews = require("../DataBase/review");
const complaints = require("../DataBase/complaints");
const blockedServiceProvider = require("../DataBase/blockedServiceProvider");

// email send function

async function sendConfirmationEmail(Email, subjectmail, textmessage) {
  // Create a Nodemailer transporter using SMTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.gmail, // Admin's email
      pass: process.env.gmailpsw, // Admin's password
    },
  });

  // Send mail with defined transport object
  const info = await transporter.sendMail({
    from: "cc", // Admin's email address
    to: [Email], // Service provider's email address
    subject: subjectmail,
    text: textmessage,
  });

  console.log("Confirmation email sent: ", info.messageId);
}

//User Registration
exports.userRegistration = async (req, res) => {
  const { userName, userEmail, userPassword, userPhoneNumber, userAddress } =
    req.body;

  try {
    const newUser = await users({
      userName,
      userEmail,
      userPassword,
      userPhoneNumber,
      userAddress,
    });
    await newUser.save();
    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json(error);
  }
};

// get all category
exports.getallcategories = async (req, res) => {
  try {
    const newUser = await categories.find();

    res.status(200).json({ newUser });
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};

//get all subcategory
exports.getallSubcategories = async (req, res) => {
  const { mainCategory } = req.body;
  try {
    const newUser = await categories.findOne({ mainCategory });

    res.status(200).json({ newUser });
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};

exports.userLogin = async (req, res) => {
  const { userEmail, userPassword } = req.body;
  try {
    const exist_User = await users.findOne({ userEmail, userPassword });
    if (exist_User !== null && exist_User != undefined) {
      const token = jwt.sign(
        {
          user_id: exist_User._id,
          user_email: exist_User.userEmail,
          user_name: exist_User.userName,
        },
        "user_superkey2024",
        { expiresIn: "300m" }
      );
      res.status(200).json({ exist_User, token });
    } else {
      res.status(404).json({ message: "incorrect email and password" });
    }
  } catch (error) {
    res.status(500).json({ message: " Request Not approved by admin" });
  }
};

// get all webinar
exports.webinarView = async (req, res) => {
  try {
    const webinar = await webinarSchema.find();
    if (!webinar) {
      res.status(400).json({ message: "no webinar founded" });
    } else {
      res
        .status(200)
        .json({ webinar, message: "webinar fetched successfully" });
    }
  } catch (error) {}
};

// get all blogs
exports.blogsView = async (req, res) => {
  try {
    const blog = await blogSchema.find();
    if (!blog) {
      res.status(400).json({ message: "no webinar founded" });
    } else {
      res.status(200).json({ blog, message: "webinar fetched successfully" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// api for searching service provider by location and service

exports.searchServiceprovider = async (req, res) => {
  console.log("inside api call to search service provider");
  const { location, service } = req.body;
  try {
    const searchUser = await readytoBook.find({ location, service });
    if (searchUser.length === 0) {
      res.status(400).json({ message: "No service provider available" });
    } else {
      res
        .status(200)
        .json({
          searchUser,
          message: "List of service providers in this location",
        });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//  service booking
exports.primaryBooking = async (req, res) => {
  const {
    typeOfCare,
    services,
    startingTime,
    endingTime,
    startDate,
    endDate,
    location,
    serviceProviderName,
    service,
    serviceProviderId,
    profile_img,
    serviceProviderEmail,
    serviceProviderMobile,
    rate,
    workinghours,
    amountPaid,
  } = req.body;
  const formattedStartTime = formatToTime(startingTime);
  const formattedEndTime = formatToTime(endingTime);

  // console.log(formattedTime); // Output: "10:00"
  try {
    const token = req.headers.authorization;
    console.log(token);
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }
    jwt.verify(token, "user_superkey2024", async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden: Invalid token" });
      }

      const userEmail = decoded.user_email;

      const userName = decoded.user_name;
      const userId = decoded.user_id;

      const user = await Bookings({
        userEmail,
        userName,
        userId,
        typeOfCare,
        services,
        startingTime: formattedStartTime,
        endingTime: formattedEndTime,
        startDate,
        endDate,
        location,
        serviceProviderName,
        service,
        serviceProviderId,
        profile_img,
        serviceProviderEmail,
        serviceProviderMobile,
        rate,
        workinghours,
        amountPaid,
        amountStatus: "unpaid",
        serviceProviderStatus: "pending",
        adminStatus: "pending",
      });

      await user.save();
      textmessage =
        "You have one booking request placed, please check your page";
      subjectmail = "Service Request!!!!!";
      await sendConfirmationEmail(
        serviceProviderEmail,
        subjectmail,
        textmessage
      );
      res.status(200).json({ user, message: "saved succesfully" });
    });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

// conversion to time
function formatToTime(number) {
  const formattedTime = `${number.toString().padStart(2, "0")}:00`;
  return formattedTime;
}

// get unpaid service booking  bill

exports.getUnpaidBill = async (req, res) => {
  try {
    const token = req.headers.authorization;
    console.log(token);
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }
    jwt.verify(token, "user_superkey2024", async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden: Invalid token" });
      }

      const userEmail = decoded.user_email;

      const userName = decoded.user_name;
      const userId = decoded.user_id;

      const bill = await Bookings.find({
        userId: userId,
        adminStatus: "approved",
        amountStatus: "unpaid",
      });

      if (bill.length > 0) {
        res.status(200).json({ bill, message: "bill fetched successfully" });
      } else {
        res.status(400).json({ message: "No bill to Paid" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

//get  booking status of user

exports.getbookingDetails = async (req, res) => {
  try {
    const token = req.headers.authorization;
    console.log(token);
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }
    jwt.verify(token, "user_superkey2024", async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden: Invalid token" });
      }

      const userEmail = decoded.user_email;

      const userName = decoded.user_name;
      const userId = decoded.user_id;

      const user = await Bookings.find({ userId: userId });

      if (user.length > 0) {
        res.status(200).json({ user, message: " fetched successfully" });
      } else {
        res.status(400).json({ message: "No bookings available" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

// payment and booking confirm
exports.payment = async (req, res) => {
  const { id } = req.body; // booking id
  const date = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  try {
    const token = req.headers.authorization;

    const user = await Bookings.findById(id);
    if (!user) {
      return res.status(404).json({ message: "no booking Data available" });
    }
    const serviceproviderId = user.serviceProviderId;
    const serviceProvider = await readytoBook.findOne({
      serviceProviderId: serviceproviderId,
    });
    if (!serviceProvider) {
      return res
        .status(401)
        .json({
          message: "no service provider available book for another one",
        });
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    jwt.verify(token, "user_superkey2024", async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden: Invalid token" });
      }

      const userEmail = decoded.user_email;
      const userName = decoded.user_name;
      const userId = decoded.user_id;

      const pay = await Bookings.findOneAndUpdate(
        {
          _id: id,
          serviceProviderStatus: "accepted",
          adminStatus: "approved",
          amountStatus: "unpaid",
        },
        {
          $set: {
            amountStatus: "paid",
            bookingDate: date,
          },
        },
        { new: true }
      );

      console.log(pay);
      if (!pay) {
        return res.status(404).json({ message: "Payment already processed " });
      } else {
        const blockeduser = await blockedServiceProvider.findOne({
          serviceProviderId: serviceproviderId,
        });
        if (blockeduser) {
          res
            .status(400)
            .json({
              message:
                "Sorry for incovenience this Service provider is Un available now",
            });
        } else {
          const transaction = new transactions({
            bookingId: id,
            fromID: userId,
            from_Name: userName,
            To_ID: "65f3c3454247fe18fe09ed2e",
            To_Name: "admin",
            Date: date,
            amount: pay.amountPaid,
            Status: "credited",
          });
          console.log(transaction);
          await transaction.save();

          const blockedlist = await blockedServiceProvider.insertMany(
            serviceProvider
          );
          const deletelist = await readytoBook.deleteOne({
            serviceProviderId: serviceproviderId,
          });
          console.log(blockedlist);
          textmessage = "your booking placed";
          subjectmail = "Booking  confirmed!!!!!";
          await sendConfirmationEmail(userEmail, subjectmail, textmessage);
          res
            .status(200)
            .json({
              booking: pay,
              message: "Payment successful and booking confirmed",
            });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

cron.schedule("* * * * *", async () => {
  try {
    const currentDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const currentTime = new Date().toLocaleTimeString("en-IN", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const users = await Bookings.find({
      endingTime: currentTime,
      endDate: currentDate,
    });
    if (users.length > 0) {
      console.log("testing started");
      for (const user of users) {
        const updatedBooking = await Bookings.findOneAndUpdate(
          { _id: user._id },
          { $set: { bookingPeriod: "completed" } },
          { new: true }
        );
        const readytobook = await blockedServiceProvider.findOne({
          serviceProviderId: user.serviceProviderId,
        });
        const serviceprovider = await readytoBook.insertMany(readytobook);
        const newuser = await blockedServiceProvider.deleteOne({
          serviceProviderId: user.serviceProviderId,
        });
      }
      console.log("success");
      res.status(200).json({ updatedBooking, message: "successful" });
    } else {
      res.status(400).json({ message: "unsuccessful" });
    }
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
});

//Logic to add review to a service provider
exports.addReview = async (req, res) => {
  const date = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  console.log("inside api call to add review");
  const { serviceProviderId, ratings, comments } = req.body;
  console.log(serviceProviderId, ratings, comments);
  try {
    const token = req.headers.authorization;
    console.log(token);
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }
    jwt.verify(token, "user_superkey2024", async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden: Invalid token" });
      }
      const username = decoded.user_name;
      const userId = decoded.user_id;
      console.log(username);
      if (!ratings || !comments) {
        return res.status(400).json({ message: "Missing required fields" });
      } else {
        const newReview = new reviews({
          serviceProviderId,
          username: username,
          userId: userId,
          date: date,
          ratings,
          comments,
        });

        await newReview.save();

        res
          .status(200)
          .json({ newReview, message: "Review added successfully" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// view reviews for service provider

exports.viewReview = async (req, res) => {
  const { serviceProviderId } = req.body;
  try {
    const user = await reviews.find({ serviceProviderId: serviceProviderId });
    if (user) {
      res.status(200).json({ user, message: "review fetched successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.chatPost = async (req, res) => {
  const { userID, message } = req.body;

  try {
    const newUser = await complaints({
      senderId: userID,
      receiverId: "admin123",
      user_message: message,
    });
    await newUser.save();
    res.status(200).json({ message: "message sent" });
  } catch (error) {
    res.status(500).json({ message: "message sent error" });
  }
};

exports.chatget = async (req, res) => {
  const { userID } = req.body;

  try {
    const user = await complaints.find({
      $or: [{ senderId: userID }, { senderId: "admin123" }],
    });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "message sent error" });
  }
};
