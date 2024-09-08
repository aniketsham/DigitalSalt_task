import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

const userSchema=new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        validate:[validator.isEmail, "Please provide valid email."],
    },
    role: {
        type: String,
        required: true,
        enum: ["User", "Admin"],
      },
      phone: {
        type: Number,
        required: true,
      },
    password:
    {
        type:String,
        required:true,
        minLength:[8,"Your password should be greater than 8 characters long"],
        maxLenght:[32,"Your password should be lesser than 32 characters long"],
        select:false,

    },
    createdAt: {
        type: Date,
        default: Date.now,
      }
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    this.password = await bcrypt.hash(this.password, 10);
  });

  userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

  userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, "test", {
      expiresIn: "7d",
    });
  };
export const User = mongoose.model("User", userSchema);