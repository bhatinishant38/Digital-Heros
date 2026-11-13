import mongoose from "mongoose";
import { required } from "zod/mini";

const scoreSchema = new mongoose.Schema(
    {
    user : { type :mongoose.Schema.Types.ObjectId, ref : 'user' ,required : true},
    date : { type : Date , required : true},
    score : {type : Number , required :true ,min : 1 , max : 45},
    position : { type : string , default : ""}
  }, 
  {
    timestamps : true
  }
)

export const scoreModel = mongoose.models.score || mongoose.model('score' ,scoreSchema)