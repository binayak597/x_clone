
import { Router } from "express";
import UserController from "../controller/user.controller.js";

const router = Router();


//create an instance of UserController class
const userController = new UserController();

//routes related to UserController

router.get("/profiledetails/:username", (req, res) => {
    userController.getProfileDetails(req, res);
});

router.get("/suggested", (req, res) => {
    userController.getSuggestedUsers(req, res);
});

router.post("/follow/:userId", (req, res) => {
    userController.followUnfollowUser(req, res);
});

router.post("/update", (req, res) => {
    userController.updateUser(req, res);
});

export default router;