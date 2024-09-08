import express from "express"
import { deleteUser, getProfile, getUsers, Login, logout, Register, updateProfile, updateUserById } from "../controllers/userControllers.js";
import { isAdmin, isAuthenticated } from "../middleware/auth.js";

const router=express.Router();


router.post("/register",Register);
router.post("/login",Login);
router.get("/logout",isAuthenticated,logout);
router.get("/getMyProfile",isAuthenticated,getProfile);
router.get("/getProfileId/:id",isAuthenticated,getProfile);
router.put("/updateProfile",isAuthenticated,updateProfile);
router.put("/updateById/:id",isAuthenticated,isAdmin,updateUserById)
router.delete("/deleteUser/:id",isAuthenticated,deleteUser);
router.get("/getUsers",isAuthenticated,isAdmin,getUsers);
export default router