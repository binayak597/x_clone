

export default class PostModel{

    constructor(_user, _content, _postImg, _likes, _comments, _id){
        
        this.user = _user;
        this.content = _content;
        this.postImg = _postImg;
        this.likes = _likes;
        this.comments = _comments;
        this._id = _id;
    }
}