import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config'
const server = express();
let PORT = 3000;

server.use(express.json()); //to use middleware  json sends requests and gets respose
mongoose.connect(process.env.DB_LOC,
    { autoIndex:true})

server.post("/signup",(req,res)=>{
let{fullname, email,password} = req.body; 
//validating data from the frontend
if(fullname.length < 3){
    return res.status(403).json({"error":"Fullname must be at least 3 letters long"}); //invalidation sts code 403
}
return res.status(200).json({"status":"okay"})
})


server.listen(PORT,()=>{
    console.log("listening on port "+ PORT)
}) //server created