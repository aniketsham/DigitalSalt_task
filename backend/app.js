import express from "express";
import userRouter from "./Routes/UserRoutes.js";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/errorMiddleware.js";


const app=express()
app.use(cors({
    origin:["https://digital-task-frontend-rckjrhf97-aniketshams-projects.vercel.app","https://digital-task-frontend.vercel.app"],
    methods:["GET","POST","PUT","DELETE"],
    credentials:true,
}))
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
const connection=()=>{
    mongoose.connect("mongodb+srv://aniket:12345@cluster0.9uugitj.mongodb.net/",{
        dbName:"DS_DB"
    }).then(()=>{
        console.log("Connected to database")
    }).catch(err=>{
        console.log(`Some error occured while connecting to database:${err}`)
    })
}

connection();

app.use("/api",userRouter);
app.use(errorMiddleware);
export default app;
