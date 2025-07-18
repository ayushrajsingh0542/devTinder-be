const express=require('express');
const LoginAuth=require("../utils/LoginAuth")
const bcrypt=require("bcrypt")
const User=require("../models/user.js")

const authRouter=express.Router();

authRouter.post("/signup",async(req,res)=>{
     console.log(req.body);

     const {firstName,lastName,emailId,password, age,
        gender,
        skills,
        photoUrl,about}=req.body;

     //validation of the data->done in schema only
     const existingUser=await User.findOne({emailId:emailId});
             if(existingUser)
                 return res.status(404).send("User already exists");

     //encrypt the password
     
     const passwordHash=await bcrypt.hash(password,10)

     //creating a new instance of only valid schema
    const user=new User({
        firstName,
        lastName,
        emailId,
        password:passwordHash,
        age,
        gender,
        skills,
        photoUrl,
        about
    });
    await user.save().then(()=>{
        LoginAuth(emailId,password,req,res)
        // res.json({messgae:"user added successfully"})
    })
    .catch((err)=>{
        res.status(err.status||500).send(err.message||"Something went wrong");
    })
})

authRouter.post("/login",async(req,res)=>{
    try
    {
        const {emailId,password}=req.body;
        LoginAuth(emailId,password,req,res);
        
    }catch(err)
    {
        res.status(err.status||500).send(err.message||"Something went wrong");
    }
})

authRouter.post("/logout",async(req,res)=>{
    res.clearCookie("token");
    res.json({message:"User Logged Out"});
})


module.exports=authRouter;