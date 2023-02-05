import mongoose from "mongoose";
const commentSchema = new mongoose.Schema(
  {
    commnetBody: { type: String, required: true },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    pictures: Array
  },
  {
    timestamps: true,
  }
);
const commentModel = mongoose.model("Comment", commentSchema);
export default commentModel;
