import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
    username: {
      type: String,
      required: true,  
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
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
   },
    subscriptionPlan : {
        type : String ,
        enum : [ 'monthly', 'yearly']
    },
    subscriptionEnd: { type: Date },

    isSubscribed : {type : Boolean ,default :false},

    verifiedPaymentIds: {
      type: [String],
      default: [],
      select: false,
    },
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