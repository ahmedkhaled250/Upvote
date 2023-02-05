import { Router } from "express";
import { auth } from "../../middlwear/auth.js";
import * as uc from "./controller/user.js";
import * as validators from "./user.validate.js";
import { HME, multerValidation, myMulter } from "../../service/clodMulter.js";
import { validation } from "../../middlwear/validation.js";
const router = Router();
router.get('/',validation(validators.allusers),uc.allusers)
router.get('/profile/:id',validation(validators.blockUserAndProfile),auth(),uc.profile)
router.put("/updateprofile",validation(validators.updateProfile),auth(), uc.updateProfile);
router.patch("/softDelete",validation(validators.softdelete), auth(), uc.softdelete);
router.patch("/blockUser/:id",validation(validators.blockUserAndProfile),auth(), uc.blockUser);
router.get("/profilePic",validation(validators.pictures),auth(),myMulter(multerValidation.image).single("file"),HME,uc.profilePic);
router.get("/coverPics",validation(validators.pictures),auth(),myMulter(multerValidation.image).array("files", 4),HME,uc.coverPics);
export default router;