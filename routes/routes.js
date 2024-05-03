
const express = require('express')

// import category logic
const category = require('../Controllers/category')

const chat = require('../Controllers/chat')

//import logic service provider
const {leaveRequest,attendanceServiveProvider,serviceProviderRegistration, serviceProviderfinalRegistration,loginServiceProvider,get_bookingRequest_to_serviceProvider,accept_bookingRequest_by_serviceprovider,reject_bookingRequest_by_serviceprovider, attendanceView, bookingView, bookingAcceptServiceProvider, bookingRejectServiceProvider, get_Single_serviceProvider, edit_serviceprovider}=require('../Controllers/logic_ServiceProvider')


// import admin logic
const {webinarRegistration,rejectLeaveReq,gelAllLeaveRequests,rejectionServiceProvider,getServiceProviderRequest,approvalServiceProvider,getApprovedServiceProviderList,getBookingRequest,admin_approval_bookingrequest,adminlogin, attendanceViewServiceProvider, acceptLeaveReq, blogRegistration, viewAllBooking, confirmBooking, viewacceptedBooking, viewrejectedBooking, viewpendingBooking, salaryCalculation, salaryPayment, chatPostfromAdmin}=require('../Controllers/logicAdmin')

// import logic file for user
const {getallSubcategories,userLogin,userRegistration, webinarView, blogsView, searchServiceprovider, primaryBooking, getUnpaidBill, getbookingDetails, payment, reshedule, addReview, viewReview, chatPost, chatget, get_Single_User, edit_user,getSpecificServiceProvider} = require('../Controllers/logicUser')


// import multer file
const  uploadpdf = require('../multer/StorageConfig')
const uploadImage=require('../multer/serviceProviderImageConfig')
const uploadwebinar = require('../multer/webinarConfig')
const uploadblog = require('../multer/blogConfig')


const router = new express.Router()

// const path = require('path');

// router.use('/webinarImage', express.static(path.join(__dirname, 'webinarImage')));
//Admin login
router.post('/maternalcare/admin/login',adminlogin)

//register user
router.post('/maternalcare/user/register',userRegistration)

// register service provider
router.post('/maternalcare/serviceProvider/register',uploadpdf.single('experience_crt'),serviceProviderRegistration)

//upload image of service provider
router.post('/maternalcare/serviceProvider/uploadimage',uploadImage.single('profile_image'),serviceProviderfinalRegistration)

//get all service provider request for approval
router.get('/maternalcare/admin/listofserviceproviderRequest', getServiceProviderRequest)

//get all approved list of service providers
router.get('/maternalcare/admin/listofapprovedserviceproviderRequest',getApprovedServiceProviderList)

//approval of service provider by admin
router.post('/maternalcare/admin/approval/serviceprovider',approvalServiceProvider)

//rejection of service provider by admin
router.post('/maternalcare/admin/rejection/serviceprovider',rejectionServiceProvider)
//service provider login
router.post('/maternalcare/serviceprovider/login',loginServiceProvider)

// booking request by user
// router.post('/maternalcare/user/bookingrequest',bookingRequest)

//booking request display on service provider page
// router.get('/maternalcare/user/bookingrequest/serviceprovider/view',get_bookingRequest_to_serviceProvider)

// booking request accepted by service provider
// router.post('/maternalcare/user/bookingrequest/serviceprovider/accept',accept_bookingRequest_by_serviceprovider)

// booking rejected by service provider

// router.post('/maternalcare/user/bookingrequest/serviceprovider/reject',reject_bookingRequest_by_serviceprovider)

//booking request display on admin page
// router.get('/maternalcare/user/bookingrequest/admin/view',getBookingRequest)

//// admin approval for request

// router.post('/maternalcare/user/bookingrequest/Admin/accept',admin_approval_bookingrequest)

//attendance of service provider 
router.post('/maternalcare/user/serviceprovider/attendance',attendanceServiveProvider)

//attendance view of service provider
router.post('/maternalcare/user/serviceprovider/attendanceview',attendanceView)
// attendance view accordance with service provider id on admin page

router.post('/maternalcare/admin/serviceprovider/attendanceview/admin',attendanceViewServiceProvider)

// user login
router.post('/maternalcare/user/login',userLogin)


// get all sub categories
router.post('/maternalcare/Subcategories/get', getallSubcategories)

// leave request
router.post('/maternalcare/serviceprovider/leaverequest',leaveRequest)

// get all leave request on admin page
router.get('/maternalcare/admin/serviceprovider/leaverequest/view',gelAllLeaveRequests)

// reject leave request
router.post('/maternalcare/admin/serviceprovider/leaverequest/reject',rejectLeaveReq)


// accept leave request
router.post('/maternalcare/admin/serviceprovider/leaverequest/accept',acceptLeaveReq)

//webinar add
router.post('/maternalcare/admin/webinar',uploadwebinar.single('image'),webinarRegistration)

// get webinar post
router.get('/maternalcare/user/webinar/view',webinarView)

//webinar add
router.post('/maternalcare/admin/blog',uploadblog.single('image'),blogRegistration)


//get blogs view
router.get('/maternalcare/user/blog/view',uploadblog.single('image'),blogsView)


//api location search
router.post('/maternalcare/user/serviceproviderSearch',searchServiceprovider)


// api primary booking
router.post('/maternalcare/user/primarybooking',primaryBooking)

//booking view service provider
router.get('/maternalcare/serviceprovider/primarybooking/view',bookingView)

// accept booking by service provider
router.post('/maternalcare/serviceprovider/primarybooking/accept',bookingAcceptServiceProvider)


// reject booking by service provider
router.post('/maternalcare/serviceprovider/primarybooking/reject',bookingRejectServiceProvider)

// view all booking requests
router.get('/maternalcare/primarybooking/view',viewAllBooking)

// approved booking by admin
router.post('/maternalcare/admin/primarybooking/accept',confirmBooking)

  //get service provider accepted request
router.get('/maternalcare/primarybooking/serviceprovider/accept/view',viewacceptedBooking)


 //get service provider rejected request
 router.get('/maternalcare/primarybooking/serviceprovider/reject/view',viewrejectedBooking)

     //get  pending request
     router.get('/maternalcare/primarybooking/serviceprovider/pending/view',viewpendingBooking)

     //get unpaid bill on userPage
     router.get('/maternalcare/primarybooking/billunpaid/view',getUnpaidBill)

     //get booking status of user
     router.get('/maternalcare/primarybooking/user/view',getbookingDetails)

// payment and confirm booking
router.post('/maternalcare/primarybooking/user/payment/view',payment)

// salary calculation
router.post('/maternalcare/serviceprovider/salary',salaryCalculation)



// salary payment
router.post('/maternalcare/serviceprovider/salary/payment',salaryPayment)

// reviews add 
router.post('/maternalcare/serviceprovider/review',addReview)

//view reviw
router.post('/maternalcare/serviceprovider/review/view',viewReview)

//post chat
// router.post('/maternalcare/chat/post',chatPost)

//get chat
// router.post('/maternalcare/chat/get',chatget)

// router.post('/maternalcare/chat/post/from/admin',chatPostfromAdmin)

// get service provider with Id
router.post('/maternalcare/serviceprovider/get/id',get_Single_serviceProvider)

// get user by ID
router.post('/maternalcare/user/get/id',get_Single_User)

// edit service provider
router.post('/maternalcare/serviceprovider/edit',edit_serviceprovider)

// edit user
router.post('/maternalcare/user/edit',edit_user)

// add main category

router.post('/maternalcare/maincategory/add',category.add_main_category)

// get all categories
router.get('/maternalcare/category/get',category.getallcategories)

//delete category
router.delete('/maternalcare/maincategory/delete',category.deleteCategory)

// add subcategory
router.post('/maternalcare/subcategory/add',category.addSubcategory)
// get subcategory
router.post('/maternalcare/subcategory/get',category.get_sub_category)

// add emergency
router.post('/maternalcare/emergency/add',category.add_emergency)

//get emergency
router.get('/maternalcare/emergency/get',category.getEmergency)

// post chat
router.post('/maternalcare/chat/post',chat.user_chat_post)

// chat admin read

router.post('/maternalcare/chat/admin/read',chat.adminRead)

// chat post admin
router.post('/maternitycare/admin/chat/post',chat.admin_chat_post)

// chat read user on click
router.post('/maternity/chat/user/read',chat.userRead)

// get all chat
router.get('/maternalcare/chat/get',chat.getallchat)

// get specific service provider 
router.get('/maternalcare/specificserviceprovider',getSpecificServiceProvider)

// post complaints

router.post('/maternalcare/complaints/post',chat.postComplaints)

// get all complaints
router.get('/maternalcare/complaints/get',chat.getComplaints)

//get admin message on user page
router.get('/maternalcare/chat/user',chat.userReadMessage)

module.exports=router
