
import Router from "express";
import NotificationController from "../controller/notification.controller.js";

const router = Router();

// create an instance of an NotificationController class

const notificationController = new NotificationController();

// routes related to notificationController

router.get("/", (req, res) => {
    notificationController.getNotifications(req, res);
});

router.delete("/", (req, res) => {
    notificationController.deleteNotifications(req, res);
});

export default router;