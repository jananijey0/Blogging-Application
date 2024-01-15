
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import aws from 'aws-sdk';
import {getAuth} from 'firebase-admin/auth'
import bcrypt from 'bcrypt';
import {nanoid} from 'nanoid';
import jwt from 'jsonwebtoken'
import User from '../server/Schema/User.js';
import cors from 'cors';
import Blog from '../server/Schema/Blog.js';
import admin from 'firebase-admin'


const server = express();


  const ServiceAccountKey = {
    "type": process.env.TYPE,
    "project_id": process.env.PROJECT_ID,
    "private_key_id": process.env.PRIVATE_KEY_ID,
    "private_key": process.env.PRIVATE_KEY,
    "client_email": process.env.CLIENT_EMAIL,
    "client_id": process.env.CLIENT_ID,
    "auth_uri": process.env.AUTH_URI,
    "token_uri": process.env.TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.CLIENT_X509_CERT_URL,
    "universe_domain": process.env.UNIVERSE_DOMAIN
  };
  

let PORT = 3000;



admin.initializeApp ({
  credential:admin.credential.cert(ServiceAccountKey)
})
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
server.use(express.json());
//to use middleware  json sends requests and gets respose
server.use(cors()); //enables to accept data from anywhere
mongoose.connect(process.env.DB_LOC,
    { autoIndex:true})
//setting s3 bucket

const s3 = new aws.S3({
  region:'ap-south-1',
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,

})

//generating url for uploading
const generateUploadURL =async() =>{
  const date =new Date();
  const imageName = `${nanoid()}-${date.getTime()}.jpeg`
 return await s3.getSignedUrlPromise('putObject',{
    Bucket:'blogging-application',
    Key:imageName,
    Expires : 1000,
    ContentType : 'image/jpeg'
  })
}

const verifyJWT =(req,res,next)=>{
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1];
  if(token == null){
    return res.status(401).json({error:"No Access Token"})
  }
  jwt.verify(token,process.env.SECRET_ACCESS_KEY,(err,user)=>{
    if(err){
      return res.status(403).json({error:"Access Token is Invalid"})
    }
    req.user = user.id
    next()
  })
}


    const formatDatatoSend =(user) => {

         const access_token = jwt.sign({id: user._id},process.env.SECRET_ACCESS_KEY) 

        return {
            access_token,
            profile_img: user.personal_info.profile_img,
            username: user.personal_info.username,
            fullname: user.personal_info.fullname
        }
    }


const generateUsername = async(email)=>{
    let username = email.split("@")[0];
    let isUsernameNotUnique = await User.exists({"personal_info.username":username}).then((result)=> result)
isUsernameNotUnique ? username += nanoid().substring(0,5): "";
return username
}
//upload image url route
server.get ('/get-upload-url',(req,res)=>{
  generateUploadURL().then(url => res.status(200).json({uploadURL:url}))
  .catch (err =>
    {console.log(err.message);
    return res.status(500).json({error:err.message})
  })
})

server.post("/signup",(req,res)=>{
let{fullname, email ,password} = req.body; 
//validating data from the frontend
if(fullname.length < 3)
{
   return res.status(403).json({"error":"Fullname must be at least 3 letters long"})//invalidation sts code 403
}
if(!email.length) {
    return res.status(403).json({"error":"Please Enter Email"})
}
if(!emailRegex.test(email)){
    return res.status(403).json({"error":"Email is invalid"})
}
if(!passwordRegex.test(password)){
    return res.status(403).json({"error":"Password should be 6 to 20 characters long with a numeric,1 LowerCase and 1 UpperCase Letters"})
}
bcrypt.hash(password, 10, async(err, hashed_password)=>
{
     let username = await generateUsername(email);
     let user = new User({
        personal_info: {fullname,email, password:hashed_password, username}
     })
     user.save().then((u) => {
        return res.status(200).send(formatDatatoSend(u))
     }) //to save the data in mongodb
   .catch(err => {
    if(err.code == 11000) {
        return res.status(500).json({"error" : "Email Already Exists"})
    }
    return res.status(500).json({"error":err.message})
   })
}
)

})

server.post("/signin",(req,res) =>{
    let {email, password} = req.body;
 User.findOne({"personal_info.email": email}).then((user) => {
    if(!user){
        return res.status(403).json({"error":"Email not found"});
    }
    if(!user.google_auth){
      bcrypt.compare(password,user.personal_info.password, (err,result) => {
        if(err){
            return res.status(403).json({"error": "Error occured while login please try again"});
        }
        if(!result){
            return res.status(403).json({"error":"Incorrect Password"})
        }
        else {
            return res.status(200).send(formatDatatoSend(user))
        }
       })
    }else {
      return res.status(403).json({"error": "This account was created using google.Try logging in with Google."})
    }
   
   

 })
 .catch(err => {
    console.log(err);
    return res.status(500).json({"error":"err.message"})
 })
})
//for google login
server.post('/google-auth',async(req,res)=>
{
  let {access_token} = req.body;
  getAuth().verifyIdToken(access_token).then(async(decodedUser)=>{
let {email, name, picture} = decodedUser;
picture = picture.replace('s96-c','s384-c');
let user = await User.findOne({'personal_info.email':email}).select('personal_info.fullname personal_info.username personal_info.profile_img google_auth')
.then((u) =>
{
  return u || null
}) .catch (err => {
  return res.status(500).json({ "error" :"err.message"})
})
if(user){ //login
  if(!user.google_auth){
return res.status(403).json ({"error":"This email was signed up without google. Please log in with password to access the account"})
  }

} else {
  //sign up
  let username = await generateUsername(email);
  user = new User({
    personal_info:{fullname: name,email,username},
    google_auth: true
  })
  await user.save().then((u) =>{
    user =u;
  }).catch (err =>{
    return res.status(500).json({"error": err.message})
  })
}
return res.status(200).json(formatDatatoSend(user))
  })
  .catch(err =>{
    return res.status(500).json({"error":"Failed to authenticate you with google.Try with some other google account"})
  })
})
//latest blogs
server.get('/latest-blogs',(req,res)=>
{
  let maxLimit = 5;
  Blog.find({draft:false})
  .populate("author","personal_info.profile_img personal_info.username personal_info.fullname -_id")
  .sort({"publishedAt":-1})
  .select("blog_id title activity tags publishedAt -_id")
  .limit(maxLimit)
  .then(blogs => {
  return res.status(200).json({blogs})
}).catch(err =>
{ return res.status(500).json({error:err.message})
})
})

//trending blogs
server.get('/trending-blogs',(req,res)=>
{
  let maxLimit = 5;
  Blog.find({draft:false})
  .populate("author","personal_info.profile_img personal_info.username personal_info.fullname -_id")
  .sort({"activity.total_read":-1,"activity.total_likes":-1,"publishedAt" : -1})
  .select("blog_id title  publishedAt -_id")
  .limit(maxLimit)
  .then(blogs => {
  return res.status(200).json({blogs})
}).catch(err =>
{ return res.status(500).json({error:err.message})
})
})

//blog creation
server.post('/create-blog',verifyJWT,(req,res)=>{
 let authorId = req.user;

 let {title,des,banner,tags,content,draft}= req.body;
 if(!title.length){
  return res.status(403).json({error:"You must provide a title."});

   }
 if(!draft){
  if(!des.length || des.length > 200){
    return res.status(403).json({error:"You must provide blog description under 200 characters"});
  
   }
  if(!banner.length){
    return res.status(403).json({error:"You must provide blog banner to publish it"});
  
  } 
  if(!content.blocks.length){
    return res.status(403).json({error:"There must be some blog content to publish it"});
  }
  if(!tags.length || tags.length > 10){
    return res.status(403).json({error:"The blog should contain tags it can be maximum of 10"});
  }

 }


 
tags = tags.map(tag => tag.toLowerCase());
let blog_id = title.replace(/[^a-zA-Z0-9]/g,' ').replace(/\s+/g,"-").trim() + nanoid();
let blog =new Blog ({
  title,des,banner,content,tags,author: authorId, blog_id,draft: Boolean(draft)
})
blog.save().then(blog => {
  let incrementVal = draft ? 0:1;
  User.findOneAndUpdate({_id:authorId},{$inc :{"account_info.total_posts":incrementVal},$push: {
    "blogs":blog._id
  }}).then(user => {
    return res.status(200).json({id:blog.blog_id})
  }).catch(err => {
    return res.status(500).json({error:"Failed to update total posts number"})
  })
  .catch(err => {
    return res.status(500).json({error:err.msg})
  })
})

})

server.listen(PORT,()=>{
    console.log("listening on port "+ PORT)
})