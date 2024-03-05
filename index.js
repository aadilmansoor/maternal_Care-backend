
require('dotenv').config()


const express= require('express')

require('./DataBase/connection')


const cors=require('cors')


const server=express()
const router = require('./routes/routes')

server.use(express.json())
server.use(router)   //server to use router
server.use(cors())

const port = 4000 || process.env.port



server.listen(port,()=>{
    console.log(`server start at ${port}`);
})

server.get('/', (req,res)=>{
    res.status(200).json("service started")
})