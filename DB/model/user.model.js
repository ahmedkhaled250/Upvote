import { Schema, model } from "mongoose";
const userSchema = new Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, default: "Male", enum: ["Male", "Female"] },
    role: { type: String, default: "User", enum: ["User", "Admin"] },
    age: Number,
    profilePic: String,
    QrCode: String,
    coverPictures:Array,
    online: { type: Boolean, default: false },
    confirmEmail: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
export const userModel = model("User", userSchema);
