import commentModel from "../../../DB/model/comment.model.js";
import postModel from "../../../DB/model/post.model.js";
import { userModel } from "../../../DB/model/user.model.js";

export const addComment = async (req, res) => {
 try{
  const { id } = req.params;
  const { commnetBody } = req.body;
  const user = await userModel.findById(req.user._id);
  if (!user) {
    res.status(404).json({ message: "This user is not found" });
  } else {
    if (user.confirmEmail === false) {
      res.status(400).json({ message: "Please confirm your Email" });
    } else {
      if (user.isBlocked || user.isDeleted) {
        res.status(400).json({ message: "Your account is stopped" });
      } else {
        const post = await postModel.findById(id);
        if (!post) {
          res.status(404).json({ message: "This post not found" });
        } else {
          if (post.isDeleted) {
            res.status(400).json({ message: "This post is stopped" });
          } else {
            const newComment = new commentModel({
              commnetBody,
              createdBy: user._id,
              postId: post._id,
            });
            const savedComment = await newComment.save();
            await postModel.updateOne(
              { _id: post._id },
              {
                $push: { comments: savedComment._id },
              }
            );
            res.status(201).json({ message: "Done", savedComment });
          }
        }
      }
    }
  }
 }catch (error) {
  res.status(500).json({message:"Cath error",error})
 }
};
export const EiditComment = async (req, res) => {
  try{
  const { id } = req.params;
  const { commnetBody } = req.body;
  const user = await userModel.findById(req.user._id);
  if (!user) {
    res.status(404).json({ message: "This user is not found" });
  } else {
    if (user.confirmEmail === false) {
      res.status(400).json({ message: "Please confirm your Email" });
    } else {
      if (user.isBlocked || user.isDeleted) {
        res.status(400).json({ message: "Your account is stopped" });
      } else {
        const comment = await commentModel.updateOne(
          { _id: id, createdBy: user._id },
          { commnetBody }
        );
        comment?.modifiedCount
          ? res.status(201).json({ message: "Done", comment })
          : res.status(404).json({ message: "This comment not found" });
      }
    }
  }
}catch (error) {
  res.status(500).json({message:"Cath error",error})
 }
};
export const softDeleteComment = async (req, res) => {
  try{
  const { id } = req.params;
  const user = await userModel.findById(req.user._id);
  if (!user) {
    res.status(404).json({ message: "This user is not found" });
  } else {
    if (user.confirmEmail === false) {
      res.status(400).json({ message: "Please confirm your Email" });
    } else {
      if (user.isBlocked || user.isDeleted) {
        res.status(400).json({ message: "Your account is stopped" });
      } else {
        const delteComment = await commentModel.updateOne(
          { _id: id, createdBy: user._id },
          { deletedBy: user._id }
        );
        delteComment?.modifiedCount
          ? res.status(200).json({ message: "Done", delteComment })
          : res.status(400).json({ message: "Fail to softDelete" });
      }
    }
  }
}catch (error) {
  res.status(500).json({message:"Cath error",error})
 }
};
export const likeComment = async (req, res) => {
  try{
  const { id } = req.params;
  const comment = await commentModel.updateOne(
    { _id: id, likes: { $nin: req.user._id } },
    {
      $push: { likes: req.user._id },
    }
  );
  res.status(200).json({ message: "Done", comment });
}catch (error) {
  res.status(500).json({message:"Cath error",error})
 }
};
export const findOneComment = async (req, res) => {
  try{
  const { id } = req.params;
  const user = await userModel.findById(req.user._id);
  if (!user) {
    res.status(404).json({ message: "In-valid user" });
  } else {
    const post = await postModel.findById(id);
    if (!post) {
      res.status(404).json({ message: "In-valid post" });
    } else {
      const comment = await commentModel
        .findOne({ createdBy: user._id, postId: post._id })
        .populate([
          {
            path: "createdBy",
            select: "userName email profilePic",
          },
          {
            path: "postId",
            populate: {
              path: "createdBy",
              select: "userName email profilePic",
            },
          },
        ]);
        res.status(200).json({message:"Done",comment})
    }
  }
}catch (error) {
  res.status(500).json({message:"Cath error",error})
 }
};
// export const replay = async (req, res) => {
//   const { contentReplay } = req.body;
//   const { id } = req.params;
//   const user = await userModel.findById(req.user._id);
//   if (!user) {
//     res.status(404).json({ message: "This user is not found" });
//   } else {
//     if (user.confirmEmail === false) {
//       res.status(400).json({ message: "Please confirm your Email" });
//     } else {
//       if (user.isBlocked || user.isDeleted) {
//         res.status(400).json({ message: "Your account is stopped" });
//       } else {
//         const comment = await commentModel.findById(id);
//         if (!comment) {
//           res.status(404).json({ message: "In-valid this comment" });
//         } else {
//           const updateComment = await commentModel.findOneAndUpdate(
//             { _id: comment._id, createdBy: user._id },
//             {
//               $push: { replay: { replayId: user._id, contentReplay } },
//             },
//             {
//               new:true
//             }
//           );
//           res.status(200).json({message:"Done",updateComment})
//         }
//       }
//     }
//   }
// };
