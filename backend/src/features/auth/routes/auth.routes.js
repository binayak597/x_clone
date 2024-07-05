import { Router } from "express";
import AuthController from "../controller/auth.controller.js";
import jwtAuth from "../../../middlewares/jwtAuth.middleware.js"

const router = Router();


// create an instance of AuthController class
const authController = new AuthController();

//routes related to AuthController

router.get("/me", jwtAuth, (req, res) => {
    authController.getMe(req, res);
});

router.post("/signup", (req, res) => {
    authController.signUp(req, res);
});

router.post("/signin", (req, res) => {
    authController.signIn(req, res);
});

router.post("/signout", (req, res) => {
    authController.signOut(req, res);
});

export default router;
