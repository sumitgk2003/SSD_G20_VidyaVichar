import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {Student} from "../models/student.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { Query } from "../models/query.model.js";
import { Class } from "../models/class.model.js";
export const options={
    httpOnly:true,
    secure:true
  }

export const generateAccessAndRefreshTokens=async(StudentId)=>{
  try {
    const student=await Student.findById(StudentId);
    const accessToken=student.generateAccessToken();
    const refreshToken=student.generateRefreshToken();

    student.refreshToken=refreshToken
    await student.save({validateBeforeSave:false})

    return {accessToken,refreshToken}
  } catch (error) {
    throw new ApiError(500,"Something went wrong while generating refresh and access tokens")
  }
}

const registerStudent=asyncHandler(
  async(req,res)=>{
    const { email, Name, Roll_Number, password } = req.body;
    console.log(email, Name, Roll_Number, password );
    if(
      [Name,email,Roll_Number,password].some((field)=>!field||field.trim()==="")
    ){
      throw new ApiError(400,"All fields are required")
    }
    console.log("jdfk");
    const existedStudent=await Student.findOne({
      $or:[{Roll_Number},{email}]
    })
    console.log("jdfk");
    console.log(existedStudent);
    if(existedStudent){
      throw new ApiError(409,"Student already exist");
    }

    const student=await Student.create({
      Name,
      email,
      Roll_Number,
      password
    })
    console.log(student);
    const createdStudent=await Student.findById(student._id).select("-password -refreshToken")

    if(!createdStudent){
      throw new ApiError(500,"Something went wrong while registering the student")
    }
    
    return res.status(201).json(
      new ApiResponse(200,createdStudent,"Student Registered Successfully")
    )

  }
)

const loginStudent=asyncHandler(async(req,res)=>{
  const{email,password}=req.body;
  if(!email){
    throw new ApiError(400,"email is required")
  }
  console.log(email, password);
  const student=await Student.findOne({email})
  if(!student){
    throw new ApiError(404,"Student does not exist")
  }

  const isPasswordValid=await student.isPasswordCorrect(password)

  if(!isPasswordValid){
    throw new ApiError(401,"Password incorrect")
  }

  const{accessToken,refreshToken}=await  generateAccessAndRefreshTokens(student._id);

  const loggedInStudent=await Student.findById(student._id).select("-password -refreshToken");
  console.log(student);
  return res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options).json(
    new ApiResponse(200,
      {
        userRole:"student",
        user:loggedInStudent,
        accessToken,
        refreshToken
      },
      "Student logged in successfully"
    )
  )
  
})

const logoutStudent=asyncHandler(async(req,res)=>{
  await Student.findByIdAndUpdate(req.user._id,
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
  .json(new ApiResponse(200,{},"Student logged Out Successfully"))
})

const createQuery=asyncHandler(async(req,res)=>{
  const {queryText}=req.body;
  if(
      [queryText].some((field)=>!field||field.trim()==="")
    ){
      throw new ApiError(400,"All fields are required")
    }
    console.log(queryText);
  const query=await Query.create({
      queryText,
      student:req.user._id
    })

    const createdQuery=await Query.findById(query._id)
    
      if(!createQuery){
        throw new ApiError(500,"Something went wrong while creating query")
      }

    return res.status(201).json(
      new ApiResponse(200,createdQuery,"Query created Successfully")
    )
})


const getCreatedQueries=asyncHandler(async(req,res)=>{
  const queries = await Query.find({student:req.user._id})
    .populate("student", "Name email");
  return res
    .status(200)
    .json(new ApiResponse(200, queries, "Your queries fetched successfully"));
})


const getAllActiveClasses=asyncHandler(async(req,res)=>{
  const classes = await Class.find({
    status:"active",
  }).select("-accessCode").sort({ createdAt: -1 });
    return res.status(200).json(
      new ApiResponse(200,classes,"All active classes fetched successfully")
    )
})

const joinClass=asyncHandler(async(req,res)=>{
  const {classId,accessCode}=req.body;
  console.log(classId,accessCode);
  const classs=await Class.findById(classId);
  if(!classs){
    throw new ApiError("Class does not exist");
  }
  console.log(classs);
  if(classs.status==='notActive'){
    throw new ApiError("Class has ended");
  }
  if(classs.accessCode!==accessCode){
    throw new ApiError("AccessCode is not correct");
  }
  return res.status(200).json(
    new ApiResponse(200,{},"Class joined Successfully")
  );
})


export {registerStudent,loginStudent,logoutStudent,createQuery,getCreatedQueries,getAllActiveClasses,joinClass};