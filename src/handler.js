'use strict';

const axios = require('axios');
const mongoose = require('mongoose');
const db = require('../backend/question-service/models');
const dbConfig = require("../backend/question-service/config/db.config.js");

// Connect to questions database
mongoose.connect(`mongodb://localhost:27002/question_db`, {
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(() => {
    console.log('Connected to the database.');
}).catch(err => {
    console.log('Connection failed.', err);
});

/*
 - Serverless function that fetches questions from Leetcode (thirs party API)
 - Provided url must be valid
 - User can provide an endpoint to a specific question, and that question will be added to the question database
*/

// Useful constants
const HEADERS = {
  'Referer': 'https://leetcode.com/problems',
  'Access-Control-Allow-Origin' : 'http://localhost:8000',
  'Access-Control-Allow-Headers': 'Content-Type',
};
const endpoint = "https://leetcode.com/graphql";

module.exports.hello = async (event) => {
  try {
    // Change this so that user can pass specific question as input
    const titleSlug = 'two-sum'; 
    const query = `
        query questionData {
            question(titleSlug: "${titleSlug}") {
                title
                titleSlug
                content
                difficulty
                topicTags {
                    name
                }
            }
        }
    `;
    const response = await axios.post(endpoint, { query }, { headers: HEADERS });
    const raw_data = response.data.data.question;
    
    // let categories = [];
    // for (let i = 0; i < raw_data.topicTags.length; i++) {
    //     categories.push(raw_data.topicTags[i].name);
    // }

    // Create a new Question document
    const question = new db.questions({
        questionId: raw_data.titleSlug,
        questionTitle: raw_data.title,
        questionDescription: raw_data.content,
        questionCategory: raw_data.topicTags[0].name,
        questionComplexity: raw_data.difficulty,
    });

    // Save the question document to the MongoDB database
    await question.save();

    const responseObj = {
        statusCode: 200,
        body: JSON.stringify({ raw_data }),
        HEADERS
    };
    console.log(responseObj);

    return responseObj;
  } catch (error) {
      console.error('Error fetching question:', error);
      
      return {
          statusCode: 500,
          body: 'Failed to fetch question',
      };
  }
};
