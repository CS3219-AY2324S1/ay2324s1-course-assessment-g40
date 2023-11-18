require('dotenv').config();
JWT_SECRET = process.env.JWT_SECRET || "the-inner-machinations-of-my-mind-are-an-enigma"; 
module.exports = { secret: JWT_SECRET };