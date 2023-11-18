module.exports = app => {
    const matching = require("../controllers/matching.controller.js");
  
    var router = require("express").Router();

    // Enqueue a new match
    router.post("/enqueue", matching.enqueue);
  
    // Dequeue an existing match
    router.post("/dequeue", matching.dequeue);
    
    // Get current Queue 
    router.get("/getLength", matching.getLength);
  
    app.use('/matching', router);
  };