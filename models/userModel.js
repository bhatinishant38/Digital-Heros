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
        type : String ,
        enum : ['basic', 'pro']  
    },
    subscriptionEnd: { type: Date },
    charity : {
        type : String ,default:'',
    },
    image : {type : String ,default : ''},
    gender: { type: String, default: "Not selected" },
    dob: { type: Date ,default :''},
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