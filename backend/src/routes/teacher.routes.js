import { Router } from "express";
import { registerTeacher,createClass,loginTeacher,logoutTeacher,getAllCreatedEvents} from "../controllers/teacher.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router() ;

router.route("/register").post(registerTeacher);
router.route("/login").post(loginTeacher);

//secured routes
router.route("/logout").post(verifyJWT,logoutTeacher);
router.route("/getAllCreatedEvents").get(verifyJWT,getAllCreatedEvents);

export default router;