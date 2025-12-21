import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      min: 2,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },

    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "TravelStory" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
