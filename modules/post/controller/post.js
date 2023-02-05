import postModel from "../../../DB/model/post.model.js";
import { userModel } from "../../../DB/model/user.model.js";
import cloudinary from "../../../service/cloudinary.js";
import pagination from "../../../service/pagination.js";

export const addPost = async (req, res) => {
  try {
    const { postBody } = req.body;
    if (req.files.length > 0) {
      const user = await userModel.findById(req.user._id);
      if (!user) {
        res.status(404).json({ message: "In-valid user" });
      } else {
        if (user.isDeleted) {
          res.status(400).json({ message: "your account is deleted" });
        } else {
          const images = [];
          for (const file of req.files) {
            const { secure_url } = await cloudinary.uploader.upload(file.path, {
              folder: `post/${user._id}`,
            });
            images.push(secure_url);
          }
          const post = new postModel({
            postBody,
            pictures: images,
            createdBy: user._id,
          });
          const savedPost = await post.save();
          res.status(201).json({ message: "Done", savedPost });
        }
      }
    } else {
      res.status(400).json({ message: "image is required" });
    }
  } catch (error) {
    res.status(500).json({ message: "Catch error", error });
  }
};
export const updatePost = async (req, res) => {
  try {
    const { postBody } = req.body;
    const { id } = req.params;
    const user = await userModel.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: "In-valid user" });
    } else {
      if (user.isDeleted || user.isBlocked) {
        res.status(400).json({ message: "your account is deleted or blocled" });
      } else {
        const post = await postModel.findById(id);
        if (post.isDeleted) {
          res.status(400).json({ message: "This post is deleted" });
        } else {
          if (req.files.length > 0) {
            const images = [];
            for (const file of req.files) {
              const { secure_url } = await cloudinary.uploader.upload(
                file.path,
                {
                  folder: `post/${user._id}`,
                }
              );
              images.push(secure_url);
            }
            const updatePost = await postModel.findOneAndUpdate(
              { _id: id, createdBy: user._id },
              {
                postBody,
                pictures: images,
              },
              { new: true }
            );
            res.status(201).json({ message: "Done", updatePost });
          } else {
            const updatePost = await postModel.findOneAndUpdate(
              { _id: id, createdBy: user._id },
              {
                postBody,
              },
              { new: true }
            );
            res.status(201).json({ message: "Done", updatePost });
          }
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Catch error", error });
  }
};
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: "In-valid user" });
    } else {
      if (user.isBlocked || user.isDeleted) {
        res.status(400).json({ message: "your account is deleted or blocled" });
      } else {
        const post = await postModel.findOne({ _id: id, createdBy: user._id });
        if (post.isDeleted) {
          res.status(400).json({ message: "This post is deleted" });
        } else {
          const deletePost = await postModel.deleteOne({
            _id: post._id,
            createdBy: user._id,
          });
          deletePost?.deletedCount
            ? res.status(200).json({ message: "Done" })
            : res.status(400).json({ message: "Fail to delete post" });
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Catch error", error });
  }
};
export const getAllPosts = async (req, res) => {
  try {
    const { page, size } = req.query;
    const { limit, skip } = pagination(page, size);
    const posts = await postModel
      .find({})
      .limit(limit)
      .skip(skip)
      .populate([
        {
          path: "createdBy",
          select: "userName email profilePic",
        },
        {
          path: "comments",
        },
      ]);
    res.status(200).json({ message: "Done", posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Catch error", error });
  }
};
export const getSpecificPosts = async (req, res) => {
  try{
  const { id } = req.params;
  const { page, size } = req.query;
  const { limit, skip } = pagination(page, size);
  const user = await userModel.findById(id);
  if (!user) {
    res.status(404).json({ message: "In-valid user" });
  } else {
    const posts = await postModel
      .find({ createdBy: user._id })
      .populate({
        path: "createdBy",
        select: "-password",
      })
      .limit(limit)
      .skip(skip);
    res.status(200).json({ message: "Done", posts });
  }
} catch (error) {
  console.log(error);
  res.status(500).json({ message: "Catch error", error });
}
};
export const likePost = async (req, res) => {
  try{
  const { id } = req.params;

  const post = await postModel.updateOne(
    { _id: id, likes: { $nin: req.user._id } },
    {
      $push: { likes: req.user._id },
      $pull: { unlikes: req.user._id },
    }
  );
  res.status(200).json({ message: "Done", post });
} catch (error) {
  console.log(error);
  res.status(500).json({ message: "Catch error", error });
}
};
export const unlikePost = async (req, res) => {
  try{
    const { id } = req.params;

    const post = await postModel.updateOne(
      { _id: id, unlikes: { $nin: req.user._id } },
      {
        $pull: { likes: req.user._id },
        $push: { unlikes: req.user._id },
      }
    );
    res.status(200).json({ message: "Done", post });
} catch (error) {
  console.log(error);
  res.status(500).json({ message: "Catch error", error });
}
};
