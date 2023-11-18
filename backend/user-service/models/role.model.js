const mongoos = require('mongoose');

const Role = mongoos.model(
    "Role",
    new mongoos.Schema({
        name:String
    })
);

module.exports = Role;