import jwt from 'jsonwebtoken'
import {User} from '../models/userSchema.js'
import ErrorHandler from './errorMiddleware.js';
export const isAuthenticated=async(req,res,next)=>{
   const {token}=req.cookies;
 
    if(!token){
        return next(new ErrorHandler("User is not authenticated",400))
    }

    const decoded= jwt.verify(token,"test");

    req.user=await User.findById(decoded.id);
    next();
}

export const isAdmin=async(req,res,next)=>{
    const role=req.user.role;

    if(role!=="Admin"){
        new ErrorHandler(
            `${req.user.role} not allowed to access this resource.`
          )
    }

    next();
}