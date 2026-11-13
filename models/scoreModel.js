import mongoose from "mongoose";


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

// One score per user per date. The database enforces this, even if two requests arrive together.
scoreSchema.index({ user: 1, date: 1 }, { unique: true });

export const scoreModel = mongoose.models.score || mongoose.model('score' ,scoreSchema)