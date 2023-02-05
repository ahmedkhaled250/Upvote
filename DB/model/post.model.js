import mongoose from "mongoose";
const postSchema = new mongoose.Schema(
  {
    postBody: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    unlikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    pictures: Array,
    TotalCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);
postSchema.post("updateOne", async function () {
  console.log(this.model);
  console.log(this.getQuery());
  const docToUpdate = await this.model.findOne({ _id: this.getQuery()._id });
  docToUpdate.TotalCount = docToUpdate.likes.length - docToUpdate.unlikes.length
  docToUpdate.save()
});
const postModel = mongoose.model("Post", postSchema);
export default postModel;
