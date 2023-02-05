import { userModel } from "../../../DB/model/user.model.js";
import cloudinary from "../../../service/cloudinary.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { nodeEmail } from "../../../service/sendemail.js";
import postModel from "../../../DB/model/post.model.js";
import pagination from "../../../service/pagination.js";
export const allusers = async (req, res) => {
  const {page , size}=req.query
  const {limit,skip} = pagination(page,size)
  const users = [];
  const cursor = userModel.find().limit(limit).skip(skip).cursor();
  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    const posts = await postModel
      .find({ createdBy: doc._id })
      .populate({ path: "comments" });
    const allPostsObject = doc.toObject();
    allPostsObject.posts = posts;
    users.push(allPostsObject);
  }
  res.status(200).json({ message: "Done", users });
};
export const profile = async (req, res) => {
  const { id } = req.params;
  const user = await userModel.findById(id).select("-password");
  res.status(200).json({ message: "Done", user });
};
export const updateProfile = async (req, res) => {
  try {
    const { userName, email, password, gender, age } = req.body;
    const user = await userModel.findById(req.user._id);
    if (!user) {
      res
        .status(404)
        .json({ message: "In-valid user token or this token expired" });
    } else {
      let updateUser;
      if (password) {
        const hash = await bcrypt.hash(
          password,
          parseInt(process.env.SaltRound)
        );
        updateUser = await userModel.findOneAndUpdate(
          { _id: user._id },
          {
            userName,
            email,
            password: hash,
            gender,
            age,
          },
          { new: true }
        );
      } else {
        updateUser = await userModel.findOneAndUpdate(
          { _id: user._id },
          {
            userName,
            email,
            gender,
            age,
          },
          { new: true }
        );
      }
      if (user.email === updateUser.email) {
        res.status(201).json({ message: "Done", updateUser });
      } else {
        const token = jwt.sign({ id: savedUser._id }, process.env.emailToken, {
          expiresIn: 60 * 60,
        });
        const confirmLink = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}`;
        const tokenRf = jwt.sign({ id: savedUser._id }, process.env.emailToken);
        const confirmLinkRF = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/refreshToken/${tokenRf}`;
        const emailMessage = `
      <a href='${confirmLink}'>Confirm Email</a>
      <br>
      <a href='${confirmLinkRF}'> request new confirm email</a>
      `;
        await nodeEmail(updateUser.email, "Confirm Email", emailMessage);
        await userModel.updateOne(
          { _id: updateUser._id, confirmEmail: true },
          { confirmEmail: false }
        );
        res.status(201).json({ message: "Done", updateUser });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Catch error", error });
  }
};
export const softdelete = async (req, res) => {
  try {
    const { id } = req.query;
    const user = await userModel.findById(req.user._id);
    if (user) {
      if (user.role === "User") {
        if (user.isDeleted) {
          const account = await userModel
            .findByIdAndUpdate(
              user._id,
              { isDeleted: false, online: true },
              { new: true }
            )
            .select("-password");
          res.status(200).json({ message: "Done", account });
        } else {
          const account = await userModel
            .findByIdAndUpdate(
              user._id,
              { isDeleted: true, online: false },
              { new: true }
            )
            .select("-password");
          res.status(200).json({ message: "Done", account });
        }
      } else {
        if (!id) {
          res.status(400).json({ message: "In-valid id" });
        } else {
          const user = await userModel.findById(req.user._id);
          if (!user) {
            res
              .status(404)
              .json({ message: "In-valid user token or this token expired" });
          } else {
            if (user.role === "admin") {
              const users = await userModel.findOne({ _id: id });
              if (users.isBlocked) {
                const updateuser = await userModel.findOneAndUpdate(
                  { _id: id },
                  { isBlocked: false },
                  { new: true }
                );
                res.status(200).json({ message: "Done", updateuser });
              } else {
                const updateuser = await userModel.findOneAndUpdate(
                  { _id: id },
                  { isBlocked: true },
                  { new: true }
                );
                res.status(200).json({ message: "Done", updateuser });
              }
            } else {
              res.status(400).json({ message: "must be user admin" });
            }
          }
        }
      }
    } else {
      res
        .status(404)
        .json({ message: "In-valid user token or this token expired" });
    }
  } catch (error) {
    res.status(500).json({ message: "Catch error", error });
  }
};
export const profilePic = async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "plz upload u file" });
    } else {
      const spilitEncoding = req.file.encoding.split("bit")[0];
      console.log(spilitEncoding);
      if (spilitEncoding > 10) {
        res.status(400).json({ message: "file's Size is very big" });
      } else {
        const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
          folder: `user/profile/${req.user._id}`,
        });
        const user = await userModel.findByIdAndUpdate(
          req.user._id,
          { profilePic: secure_url },
          { new: true }
        );
        res.json({ message: "User Module", user });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Catch error", error });
  }
};
export const coverPics = async (req, res) => {
  try {
    if (req.files.length > 1) {
      const images = [];
      for (const file of req.files) {
        const { secure_url } = await cloudinary.uploader.upload(file.path, {
          folder: `user/coverPic/${req.user._id}`,
        });
        images.push(secure_url);
      }
      const user = await userModel.findByIdAndUpdate(
        req.user._id,
        { coverPictures: images },
        { new: true }
      );
      res.json({ message: "Done", user });
    } else {
      res.status(400).json({ message: "Please enter more than one pic" });
    }
  } catch (error) {
    res.status(500).json({ message: "Catch error", error });
  }
};
export const blockUser = async (req, res) => {
  const { id } = req.params;
  const user = await userModel.findById(req.user._id);
  if (!user) {
    res.status(404).json({ message: "In-valid user" });
  } else {
    if (user.confirmEmail == false) {
      res.status(400).json({ message: "Confirm your email" });
    } else {
      if (user.isDeleted) {
        res.status(400).json({ message: "You email is deleted" });
      } else {
        if(user.role === 'User'){
          res.status(400).json({message:"Must be admin"})
        }else{
          const user = await userModel.findById(id)
          let updateUser ;
          if(user.isBlocked){
            updateUser = await userModel.findOneAndUpdate({_id:user._id},{isBlocked:false},{new:true})
          }else{
            updateUser = await userModel.findOneAndUpdate({_id:user._id},{isBlocked:true,online:false},{new:true})
          }
          updateUser?res.status(200).json({message:"Done",updateUser}):res.status(400).json({message:"In-valid user"})
        }
      }
    }
  }
};
