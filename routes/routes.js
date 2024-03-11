
const express = require('express')

//import logic service provider
const {serviceProviderRegistration, serviceProviderfinalRegistration,loginServiceProvider,get_bookingRequest_to_serviceProvider,accept_bookingRequest_by_serviceprovider,reject_bookingRequest_by_serviceprovider}=require('../Controllers/logic_ServiceProvider')


// import admin logic
const {getServiceProviderRequest,approvalServiceProvider,getApprovedServiceProviderList,getBookingRequest}=require('../Controllers/logicAdmin')

// import logic file for user
const {userRegistration,bookingRequest} = require('../Controllers/logicUser')


// import multer file
const  uploadpdf = require('../multer/StorageConfig')
const uploadImage=require('../multer/serviceProviderImageConfig')


const router = new express.Router()

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

//service provider login
router.post('/maternalcare/serviceprovider/login',loginServiceProvider)

// booking request by user
router.post('/maternalcare/user/bookingrequest',bookingRequest)

//booking request display on service provider page
router.get('/maternalcare/user/bookingrequest/serviceprovider/view',get_bookingRequest_to_serviceProvider)

// booking request accepted by service provider
router.post('/maternalcare/user/bookingrequest/serviceprovider/accept',accept_bookingRequest_by_serviceprovider)

// booking rejected by service provider

router.post('/maternalcare/user/bookingrequest/serviceprovider/reject',reject_bookingRequest_by_serviceprovider)

//booking request display on admin page
router.get('/maternalcare/user/bookingrequest/admin/view',getBookingRequest)




module.exports=router
