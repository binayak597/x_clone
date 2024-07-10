import UserModel from "../../auth/model/user.schema.js";
import NotificationRepository from "../repository/notification.repository.js";

export default class NotificationController{

    constructor(){
        this.notificationRepository = new NotificationRepository();
    }

    getNotifications = async (req, res) => {

        try {
            const userId = req.userId;

            const isUser = await UserModel.findById(userId);

            if(!isUser) return res.status(404).json({error: "user is not found"});

            const notifications = await this.notificationRepository.getNotifications(isUser);

            return res.status(200).json(notifications);
        } catch (err) {
            console.error("error in getNotifications controller -> ", err.message);
            return res.status(err.statusCode).json({error: err.message});
        }
    }

    deleteNotifications = async (req, res) => {

        try {

            const userId = req.userId;

            const isUser = await UserModel.findById(userId);

            if(!isUser) return res.status(404).json({error: "user is not found"});

            const message = await this.notificationRepository.deleteNotifications(isUser);

            return res.status(200).json({message});
            
        } catch (err) {
            console.error("error in deleteNotifications controller -> ", err.message);
            return res.status(err.statusCode).json({error: err.message});
        }
    }
}