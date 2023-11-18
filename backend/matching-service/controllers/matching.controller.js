const queue = require('../models/matching-queue.js'); 
const mQueue = new queue();
const matchObject = require('../models/match.object.js');

exports.enqueue = (req, res) => {
    try {    
        if(typeof(mQueue.checkUserId(req.body.userid)) != 'undefined') { //check if user is already in queue
            mQueue.deleteMatch(userid);
        } else {
            let match = new matchObject(
                req.body.userid,
                req.body.difficulty,
                req.body.language,
                res
            );
            let existingMatch = mQueue.enqueue(match);
            if (typeof(existingMatch) != "undefined") {
                let firstUserRes = existingMatch.firstUserRes;
                let userid = existingMatch.userid;
                let msg = "Matched users: " + userid + " and " + match.userid;
                let roomId = `${userid}&${match.userid}&${Date.now()}` // to improve roomId generation
                console.log(`${msg} with roomId ${roomId}`)
                mQueue.deleteMatch(userid);
                res.send({ message: msg, roomId: roomId, difficulty: match.difficulty, language: match.language, match: userid});
                firstUserRes.send({ message: msg, roomId: roomId, difficulty: match.difficulty, language: match.language, match: match.userid});
            } else {
                console.log(req.body.userid + " has entered the queue. Queue Length: " + mQueue.getQueueLen());
            }
        }
    } catch (error) {
        res.status(500).send({
            message: error.message || 'Error adding match to queue.'
        });
    }

};

exports.dequeue = (req, res) => {
    try {
        let existingMatch = mQueue.checkUserId(req.body.userid);
        if(typeof(existingMatch) == 'undefined') { //check if user is already in queue
            res.send({ message: 'User is not in queue.'});
        } else {
            userid = req.body.userid;
            mQueue.deleteMatch(userid);
            console.log(req.body.userid + " has left the queue. Queue Length: " + mQueue.getQueueLen())
            existingMatch.firstUserRes.send({ message: 'Successfully removed from queue.'});
            res.send({ message: 'Successfully removed from queue.'});
        }
    } catch (error) {
        res.status(500).send({
            message: error.message || 'Error removing match from queue.'
        });
    }
};

exports.getLength = (req, res) => {
    try {
        res.send({length: mQueue.getQueueLen()});
    } catch (error) {
        res.status(500).send({
            message: error.message || 'Error retrieving queue.'
        });
    }
};
