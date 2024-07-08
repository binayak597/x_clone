
export default class NotificationModel{

    constructor(_from, _to, _type, _read, _id){
        this.from = _from;
        this.to = _to;
        this.type = _type;
        this.read = _read;
        this._id = _id;
    }
}