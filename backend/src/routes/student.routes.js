import { Router } from "express";
import { registerStudent,loginStudent,logoutStudent,createQuery,getCreatedQueries,getAllActiveClasses} from "../controllers/student.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router() ;

router.route("/register").post(registerStudent);
router.route("/login").post(loginStudent);

//secured routes
router.route("/logout").post(verifyJWT,logoutStudent);
router.route("/createQuery").post(verifyJWT,createQuery);
router.route('/getCreatedQueries').get(verifyJWT,getCreatedQueries);
router.route('/getAllActiveClasses').get(verifyJWT,getAllActiveClasses);

export default router;