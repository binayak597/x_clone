

export default class AuthModel{

    constructor(_fullName, _userName, _email, _password, _followers, _following, _profileImg, _coverImg, _socialLinks, _bio, _id){

        this.fullName = _fullName;
        this.userName = _userName;
        this.email = _email;
        this.password = _password;
        this.followers = _followers;
        this.following = _following;
        this.profileImg = _profileImg;
        this.coverImg = _coverImg;
        this.socialLinks = _socialLinks;
        this.bio = _bio;
        this._id = _id;
    }
}