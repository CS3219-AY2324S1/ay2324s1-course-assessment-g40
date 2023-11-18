class matchObject {
    constructor(userid, difficulty, language, firstUserRes) {
        this.userid = userid;
        this.difficulty = difficulty;
        this.language = language;
        this.firstUserRes = firstUserRes;
    }
    equalMatch(obj){
        return this.difficulty === obj.difficulty && this.language === obj.language;
    }
}
module.exports = matchObject;
