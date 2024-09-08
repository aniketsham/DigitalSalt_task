
import {User} from "../models/userSchema.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import { catchAsyncErrors } from "../middleware/catchAsyncError.js";

export const Register=catchAsyncErrors(async(req,res,next)=>{
    try{const {name,email,role,phone,password}=req.body;

    const existingUser=await User.findOne({email})
    if(existingUser){
        return next(new ErrorHandler("User already exist.", 400));

       
    }
    const userData={
        name,
        email,
        role,
        phone,
        password
    }

    const user=await User.create(userData);
    console.log(req.body)
    sendToken(user, 200, res, "User Created Successfully")

    }
    catch(error){
        console.log(error)
        next(error);
    }
    
    
})

export const Login=catchAsyncErrors(async(req,res,next)=>{
    try{
        const {email,password}=req.body;

        const existingUser=await User.findOne({email}).select("+password");
        if(!existingUser){
            return next(new ErrorHandler("User does not exists", 400));

        }   
        const isPassword=await existingUser.comparePassword(password)
        if(!isPassword){
            return next(new ErrorHandler("Invalid Password.", 400));

        }
        sendToken(existingUser, 200, res, "User logged in successfully.")
        
    }
    catch(error){
        next(error);    }
    
})
export const logout =catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("token", "", {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .json({
        success: true,
        message: "Logged out successfully.",
      });
  })

export const getProfile= catchAsyncErrors(async (req,res,next)=>{
    try{
        const user =await User.findById(req.user.id);

        res.status(200).json({
            success:true,
            user,
        })
    }
    catch(error){
        next(error);
    }
    
})
export const updateProfile=catchAsyncErrors(async(req,res,next)=>{
    try{
        const newUserData={
            name:req.body.name,
            email:req.body.email,
            role:req.body.role,
            phone:req.body.phone,
    
        }
    
        const user=await User.findByIdAndUpdate(req.user.id,newUserData,{
            new:true,
            runValidators:true,
            useFindAndModify:false,
    
        })
    
        res.status(200).json({
            success:true,
            user,
            message:"Profile Updated.",
        })
    }
    catch(error){
        next(error);
    }
    
}
)
export const getUsers=catchAsyncErrors(async(req,res,next)=>{
    try{
        const Users=await User.find()
        res.status(200).json({
            success:true,
            users:Users,
        })
    }
    catch(error){
        return next(new ErrorHandler("Some Error has occured", 400));

    }
    

})

export const getUsersId=catchAsyncErrors(async(req,res,next)=>{
    try{
        const {id}=req.params;
        const user =await User.findById(id);

        res.status(200).json({
            success:true,
            user,
        })
    }
    catch(error){
        next(error);
    }
    
})

export const deleteUser=catchAsyncErrors(async(req,res,next)=>{
    try{
        const {id}=req.params;
        const existingUser=await User.findById(id);
        if(!existingUser){
            return next(new ErrorHandler("No such user exists", 400));

        }
        await existingUser.deleteOne()
        res.status(200).json({
            success:true,
            message:"Profile Deleted"
        })
    }
    catch(error){
        next(error);
    }
    
})

export const updateUserById=catchAsyncErrors(async(req,res,next)=>{
    try{
        const {id}=req.params;
        const newUserData={
            name:req.body.name,
            email:req.body.email,
            role:req.body.role,
            phone:req.body.phone,
    
        }
    
        const user=await User.findByIdAndUpdate(id,newUserData,{
            new:true,
            runValidators:true,
            useFindAndModify:false,
    
        })
    
        res.status(200).json({
            success:true,
            user,
            message:"Profile Updated.",
        })
    }
    catch(error){
        next(error);
    }
})

const sendToken=(user,statusCode,res,message)=>{
    const token=user.getJWTToken();
    const options={
        expires:new Date(
            Date.now()+ (10 * 24 * 60 * 60 * 1000)
        ),
        httpOnly:true,
        secure:true
        
    };
    res.status(statusCode).cookie("token",token,options).json({
        success:true,
        user,
        message,
        token,
    })
}