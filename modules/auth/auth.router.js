import { Router } from "express";
import { auth } from "../../middlwear/auth.js";
import { validation } from "../../middlwear/validation.js";
import * as validators from "./auth.validation.js";
import * as rc from "./controller/register.js";
const router = Router();
router.post("/signup", validation(validators.signup), rc.signup);
router.post("/signin", validation(validators.signin), rc.login);
router.get("/confirmEmail/:token",validation(validators.token),rc.confirmEmail);
router.get('/refreshToken/:token',validation(validators.token),rc.requestreftoken)
router.patch("/logout", validation(validators.logout),auth(), rc.logOut);

export default router;
