const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const helmet=require('helmet')
require('dotenv').config();

const app=express();
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
        .then(()=>console.log("LabourFinder database connected!"))
        .catch((err)=>console.log("🌋 Connection error !"))

const PORT=process.env.PORT||5000;
app.listen(PORT,()=>console.log('🚀 Server is running.....'))