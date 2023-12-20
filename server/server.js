
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

const ServiceAccountKey =  {
  "type": "service_account",
  "project_id": "blogging-application-b9b6d",
  "private_key_id": "d21b96109714a74337cdd9db96ac5ab902b657ab",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC6Y9D67NsyL096\nxuKMn2CH61xFSfLNzaOhMvcBsGdloEnxCJobLUeRH+9h0szd1MGzePsiAEMkFYQX\no+jV4Z9oDZOIDnk1K0cAbOzRhBEfLiKl4zkpjn8I0vV/Oyw8aniihaPVkiASr07P\n3PHAZ6fyZAlhWzwzMas1Qv1GlGe+ilJ9cWxsp5Qa6K0T2+XPg5n1lKAgyifaUWum\n089gbBbkOOiHgAntEyUzbAPsY4+udjQFcqfUHuBXWQskTccffFEJzUqSoPLTDwHg\nFKlTJeVM5FLFG2jwb7xqVs0dwrv0lYZqZuYB8S8VgX4T3JfmYOValWCtBpJCm9FA\ngKbaPpTXAgMBAAECggEAKNeDbOBmvY3pXA1ligvIUrArhVFJX3hOgR2SS2/0kCu5\n2BOa9RaMZov5X9WZp4gds65wVQh6rdb7HVUAyZEJZXsIF1mYjKKBieHUWKqYN91b\noT7zgRwk0PGs8qasMEbiTTZ8aml9FqsMWXbgEFmGTxJFjew4ej1Jdz/JEOSnAPSd\nW4lDNFX77KqVNGLdJ//6LwIHHmabnjQI0pkblp+dbeD/ytqSIoefm1MmCR5bM4Yu\njghh0D5u+pb+H3Q70pgFjLzri4YU7mw7TrFMYZCddHZBtZSU/uJmSXbC4XegWMdR\n0S0dtEJ1BNXySgD835wqxsX54CYhs2yhMJCpgta8FQKBgQDqbN5ZtAYdbg+Jla/9\nD4Zz4m9NqdmDMyMp0710NgnXrs+DqQj8igh4WEtPhvO3Ma/IHKWuYnDhl+9aU8Jk\n2E9/QHx0yY7dl9up3Udm0lrPNdG3HVc0+4bPvuUuuV42jog5Hq4Fv4Z6ZeOTISra\nnb83quvnqTBolQc/leIiBZl8BQKBgQDLizhLn0lncIpY1vlQ+d6k3gcF/5PUB+NA\nPFHHLFvhwJzSKHdNVFI4XAu1E+rcol1eFLoLklDfnO16wZTfJeeEBZRSZRirsn5o\nZ2eeokEJQOh7BIEnzKsCZyGSH5KY8oFg7pQ3s5Yr00wuIz2FQvrSog5FYLajlbRc\nYQrQiBfAKwKBgQCoQSd9/sX8zYf9WiCMY14/QqBcf7IMhuGQHdd212pNEb0DZIl8\nqJ3XsperJtM6A0GFQXpxJVqbsG8sx71YoCC+1sv9DsWpqlsRGi8rT4O6AYjaAwca\nkgV6iir4VDeYtMh1Jt4EZijhJMwoR7/4VQxvqg/ToA2MoponOy6o+Jfm+QKBgBIF\nD0TSo0L/GaBn18ateGKMLX8Ac2vwDtRfArZpXPENhlSstHMqJeVLcNXlH4PM9Asi\nNp5To8lIMVYO0Uk4J9juTYVF4ftBYCOKFAhdQPi6wFozueN2ISWjT7uKBAZ6Ya3d\nMU4FHiRfHn1vLUEg/ueq5SyLNWAiHseW58gyZDflAoGAew+wI51fiPl0BoXtjar6\nlGM+QbrSAclEs1HUDL28PZiwoAqNiQSQzRUbsP4NpvGIB9MM0XXPmYr1fNQupmqR\nxA7O1PknZvXLIXyGpvdlupK0wccxIoFSVyvOvxuaY/txbMAPgDlIPc3WEhbuCaJm\n0KK2qt4P7gppaG4tL+5W7LU=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-7xoop@blogging-application-b9b6d.iam.gserviceaccount.com",
  "client_id": "104432578254166060525",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-7xoop%40blogging-application-b9b6d.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
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