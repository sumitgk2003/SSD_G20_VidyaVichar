import mongoose from "mongoose"
const querySchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  class:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Class",
    required:true
  },
  queryText: {
    type: String,
    required: true
  },
  status:{
    type:String,
    enum:['Unanswered','Answered','Important'],
    default:'Unanswered'
  }
},{timestamps : true})

export const Query = mongoose.model(
  'Query',
  querySchema
);
