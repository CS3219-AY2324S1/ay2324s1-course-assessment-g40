const db = require('../models');
const User = db.user;
const Role = db.role;

var bcrypt = require('bcryptjs');

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
  
exports.userBoard = (req, res) => {
console.log(req.session.username);
res.status(200).send("User Content.");
};
  
exports.adminBoard = (req, res) => {
res.status(200).send("Admin Content.");
};

exports.signup = (req, res) => {
  const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8)
  });
  user.save().then((user) => {
  if (req.body.roles) {
      Role.find({name: { $in: req.body.roles }}).then((roles) => {
          user.roles = roles.map(role => role._id);
          user.save().then(() => {
              res.send({ message: "User was registered successfully!" });
          }).catch((err) => { res.status(500).send({ message: err }); });
      }).catch((err) => { res.status(500).send({ message: err }); })
  } else {    
      Role.findOne({ name: "user" }).then((role) => {
          user.roles = [role._id];
          user.save().then(() => {
              res.send({ message: "User was registered successfully!" });
          }).catch((err) => { res.status(500).send({ message: err });})})
          .catch((err) => { res.status(500).send({ message: err }); });
      }
})
  .catch((err) => {
      res.status(500).send({ message: err.message });
  })
;};

exports.updateUser = (req, res) => {
  User.findOneAndUpdate({ _id: req.userId  }, 
      { password: bcrypt.hashSync(req.body.newPassword, 8) },
      { new: true })
      .then(updatedUser => {
          if (!updatedUser) {
              return res.status(404).send({ message: "User Not found." });
          }
          res.send({ message: "Password was updated successfully!" })
  }).catch((err) => {
      res.status(500).send({ message: err });});
};

exports.deleteUser = (req, res) => {
  User.findOneAndDelete({ _id: req.userId })
      .then(deletedUser => {
          if (!deletedUser) {
              return res.status(404).send({ message: "User Not found." });
          }
          res.send({ message: "User was deleted successfully!" })
      }).catch((err) => {
          res.status(500).send({ message: err });});
};  

exports.findAll = (req, res) => {
  const processedUsers = [];
  User.find({}, {_id: 0, password: 0, __v: 0})
  .then(users => {
      if (users.length === 0) {
          res.send({ message: "No users found." });
      }
      else {
          users.forEach(user => {
              Role.find({_id:{$in:user.roles}}).then((roles) => {
                  var userDetails = {};
                  userDetails["username"] = user.username;
                  userDetails["email"] = user.email; 
                  userDetails["roles"] = roles.map(role => role.name);
                  processedUsers.push(userDetails);
                  
                  if(processedUsers.length === users.length){
                      res.send(processedUsers);
                  }
              }).catch((err) => { res.status(500).send({message:err});});
          });
      }
  }).catch((err) => {
      res.status(500).send({ message: err });
  });
};


