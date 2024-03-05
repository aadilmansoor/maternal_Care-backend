
const express = require('express')

//import logic service provider
const {serviceProviderRegistration, serviceProviderfinalRegistration,loginServiceProvider}=require('../Controllers/logic_ServiceProvider')


// import admin logic
const {getServiceProviderRequest,approvalServiceProvider}=require('../Controllers/logicAdmin')

// import logic file for user
const {userRegistration} = require('../Controllers/logicUser')


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

//approval of service provider by admin
router.post('/maternalcare/admin/approval/serviceprovider',approvalServiceProvider)

//service provider login
router.post('/maternalcare/serviceprovider/login',loginServiceProvider)

module.exports=router
