import NotificationModel from "../model/notification.schema.js";

export default class NotificationRepository{


    getNotifications = async (user) => {

        try {
            const notifications = await NotificationModel.find({
                to: user._id
            })
            .sort({createdAt: -1})
            .populate({
                path: "from",
                select: "userName profileImg"
            });

            await NotificationModel.updateMany({
                to: user._id
            },
        {
            read: true
        });


        return notifications;

        } catch (err) {
            throw new ApplicationError("something went wrong", 500);
        }
    }

    deleteNotifications = async (user) => {

        try {
            
            await NotificationModel.deleteMany({

                to: user._id,
                read: true
            });

            return "notifications deleted successfully";

        } catch (err) {
            throw new ApplicationError("something went wrong", 500); 
        }
    }
}