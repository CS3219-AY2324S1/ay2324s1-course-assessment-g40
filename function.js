const axios = require('axios');
const mongoose = require('mongoose');
const db = require('./backend/question-service/models');
const CONNECTION_STRING = require('./backend/question-service/config/db.config');

// Connect to questions database
mongoose.connect('mongodb+srv://yuanzhengtantyz:AqhYoCF1Cy6x7e6f@peerprep.rrvvdr1.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(() => {
    console.log('Connected to the database.');
}).catch(err => {
    console.log('Connection failed.', err);
});

/*
Serverless function that fetches questions from Leetcode (thirs party API)
*/

// Useful constants
const HEADERS = {
    'Referer': 'https://leetcode.com/problems',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'POST, OPTIONS, GET, DELETE',
};
const endpoint = "https://leetcode.com/graphql";
let finalData = {};

exports.function = async (event) => {
    try {
        if (event.httpMethod === 'OPTIONS') {
            // Respond to preflight requests with a 200 OK status code
            return {
              statusCode: 200,
              headers: {
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Credentials': 'true',
              },
              body: '',
            };
        }
        
        const requestData = JSON.parse(event.body);
        const counter = requestData.counter;

        const response = await axios.get("https://leetcode.com/api/problems/all");
        const raw_data = response.data;

        const stat_status_pairs = raw_data.stat_status_pairs;
        const question_title_slug = stat_status_pairs.filter(i => i.paid_only === false).map(i => i.stat.question__title_slug);

        var arr = [];
        while(arr.length < 200){
            var r = Math.floor(Math.random() * question_title_slug.length) + 1;
            if(arr.indexOf(r) === -1) arr.push(r);
        }

        for (let i = 0; i < arr.length; i++) {
            try {
                const query = `
                    query questionData {
                        question(titleSlug: "${question_title_slug[counter + i]}") {
                            questionId
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

                const response = await axios.post(
                    endpoint,
                    { query },
                    { headers: HEADERS }
                );
        
                const data = response.data.data.question;

                if (data.topicTags.length > 0) {
                     // Check if a document with the same titleSlug exists in the database
                     const existingQuestion = await db.questions.findOne({ questionId: data.titleSlug });

                     if (existingQuestion) {
                         // Update the existing document with the new data
                         existingQuestion.questionTitle = data.title;
                         existingQuestion.questionDescription = data.content;
                         existingQuestion.questionCategory = data.topicTags[0].name;
                         existingQuestion.questionComplexity = data.difficulty;
 
                         // Save the updated document
                         await existingQuestion.save();
                         console.log(`Updated question: "${question_title_slug[counter + i]}"`);
                     } else {
                         // Create a new Question document
                         const question = new db.questions({
                             questionId: data.titleSlug,
                             questionTitle: data.title,
                             questionDescription: data.content,
                             questionCategory: data.topicTags[0].name,
                             questionComplexity: data.difficulty,
                         });
 
                         // Save the question document to the MongoDB database
                         console.log(`Added question: "${question_title_slug[counter + i]}"`);
                         await question.save();
                     }
                }
                
                finalData[data.questionId] = data;
            } catch (error) {
                console.error(`Error fetching data for question "${question_title_slug[counter + i]}":`, error);
            }
        }

        // Create a response object
        const responseObj = {
            statusCode: 200,
            body: JSON.stringify({ finalData }),
            headers: HEADERS,
        };

        return responseObj;
    } catch (error) {
        console.error('Error fetching question list:', error);
        return {
            statusCode: 500,
            body: 'Failed to fetch questions',
        };
    }
};