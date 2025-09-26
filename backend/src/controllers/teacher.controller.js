import { asyncHandler } from "../utils/asyncHandler.js";
import {Teacher} from "../models/teacher.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Class } from "../models/class.model.js";

const options={
    httpOnly:true,
    secure:true,
    sameSite:'None'
}

const generateAccessAndRefreshTokens=async(TeacherId)=>{
  try {
    const teacher=await Teacher.findById(TeacherId);
    const accessToken=teacher.generateAccessToken();
    const refreshToken=teacher.generateRefreshToken();

    teacher.refreshToken=refreshToken
    await teacher.save({validateBeforeSave:false})

    return {accessToken,refreshToken}
  } catch (error) {
    throw new ApiError(500,"Something went wrong while generating refresh and access tokens")
  }
}

const registerTeacher=asyncHandler(
  async(req,res)=>{
    const {  email, Name, password } = req.body;
    console.log(email);
    if(
      [Name,email,password].some((field)=>!field||field.trim()==="")
    ){
      throw new ApiError(400,"All fields are required")
    }
    const existedTeacher=await Teacher.findOne(
      {email}
    )
    console.log(existedTeacher);
    if(existedTeacher){
      throw new ApiError(409,"Teacher already exist");
    }

    const teacher=await Teacher.create({
      email, 
      Name, 
      password
    })

    const createdTeacher=await Teacher.findById(teacher._id).select("-password -refreshToken")

    if(!createdTeacher){
      throw new ApiError(500,"Something went wrong while registering the Teacher")
    }
    
    return res.status(201).json(
      new ApiResponse(200,createdTeacher,"Teacher Registered Successfully")
    )
  }
)

const loginTeacher=asyncHandler(async(req,res)=>{
  const{email,password}=req.body;
  if(!email){
    throw new ApiError(400,"email is required")
  }

  const teacher=await Teacher.findOne({email})
  if(!teacher){
    throw new ApiError(404,"Teacher does not exist")
  }

  const isPasswordValid=await teacher.isPasswordCorrect(password)

  if(!isPasswordValid){
    throw new ApiError(401,"Password incorrect")
  }

  const{accessToken,refreshToken}=await  generateAccessAndRefreshTokens(teacher._id);

  const loggedInTeacher=await Teacher.findById(teacher._id).select("-password -refreshToken");
  console.log(teacher);
  return res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options).json(
    new ApiResponse(200,
      {
        userRole:'teacher',
        user:loggedInTeacher,
        accessToken,
        refreshToken
      },
      "Teacher logged in successfully"
    )
  )

})

const logoutTeacher=asyncHandler(async(req,res)=>{
  await Teacher.findByIdAndUpdate(req.user._id,
    {
      $set:{
        refreshToken:undefined
      }
    },
    {
      new:true
    }
  )
  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200,{},"Teacher logged Out Successfully"))
})

const createClass=asyncHandler(async(req,res)=>{
  const {title}=req.body;
  console.log(title);
  if(
      [title].some((field)=>!field||field.trim()==="")
    ){
      throw new ApiError(400,"All fields are required")
    }
  // const accessCode = Class.generateAccessCode();
  const classs=await Class.create({
    title,
    teacher : req.user._id
  })

  const createdClass=await Class.findById(classs._id)

  if(!createdClass){
    throw new ApiError(500,"Something went wrong while creating class")
  }
  const accessCode = createdClass.generateAccessCode();
  createdClass.accessCode = accessCode;
  await createdClass.save({ validateBeforeSave: false });
  return res.status(201).json(
      new ApiResponse(200,createdClass,"Class Created Successfully")
    )
})

const getAllCreatedEvents=asyncHandler(async(req,res)=>{
  const events=await Event.find({createdBy:req.user._id}).sort({createdAt:-1});
  return res.status(200).json(
    new ApiResponse(200,events,"Events fetched successfully")
  )
})



export {registerTeacher,createClass,loginTeacher,logoutTeacher,getAllCreatedEvents};
