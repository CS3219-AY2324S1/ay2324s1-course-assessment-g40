const lodash = require('lodash');

class matchingQueue {
    constructor() {
        this.queue = [];
    }

    enqueue(match) {
        const checkedMatch = this.checkMatch(match); //check if match exists, return match if it does
        if (typeof(checkedMatch) == "undefined") {
            this.queue.push(match);
        }  
        return checkedMatch;
    }

    deleteMatch(userid) {
        lodash.remove(this.queue, (existingMatch) => {
            return userid == existingMatch.userid;
        });
    }

    checkMatch(match) { 
        return lodash.find(this.queue, (existingMatch) => {
            return match.equalMatch(existingMatch);
        });
    }

    checkUserId(userid) {
        return lodash.find(this.queue, {userid: userid});
    }
    
    getQueueLen() {
        return this.queue.length;
    }
}

module.exports = matchingQueue;
