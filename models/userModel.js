import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
    username: {
      type: String,
      required: true,
      unique: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },
    subscriptionPlan : {
        type : string ,
        enum : ['basic', 'pro']
    },
    charity : {
        type : String ,
    },
    image : {type : string ,default : ''},
    gender: { type: String, default: "Not selected" },
    dob: { type: Date },
    phone: { type: String, default: "" },  
  },
  {
    timestamps: true
  }
)

const UserModel =
  mongoose.models.User ||
  mongoose.model("User", UserSchema);

export default UserModel;