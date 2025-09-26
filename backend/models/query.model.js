import mongoose from "mongoose"
const querySchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  queryText: {
    type: String,
    required: true
  },
},{timestamps : true})

export const Query = mongoose.model(
  'Query',
  querySchema
);