const axios = require('axios');
const mongoose = require('mongoose');
const db = require('./backend/question-service/models');
const functions = require('@google-cloud/functions-framework');

// Connect to questions database
mongoose.connect('mongodb+srv://yuanzhengtantyz:6fMDxgylAJlq5Ygr@peerprep.rrvvdr1.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser:true,
    useUnifiedTopology:true
  }).then(() => {
    console.log('Connected to the database.');
}).catch(err => {
    console.error('Connection failed.', err);
});

/*
Serverless function that fetches questions from Leetcode (third party API)
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

functions.http('function', async (req, res) => {
    try {
        if (req.method === 'OPTIONS') {
            res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
            res.set('Access-Control-Allow-Headers', 'Content-Type');
            res.set('Access-Control-Allow-Credentials', 'true');
            res.status(200).send('');
        }

        const response = await axios.get("https://leetcode.com/api/problems/all");
        const raw_data = response.data;

        const stat_status_pairs = raw_data.stat_status_pairs;
        const question_title_slug = stat_status_pairs.filter(i => i.paid_only === false).map(i => i.stat.question__title_slug);

        var arr = [];
        while(arr.length < 200){
            var r = Math.floor(Math.random() * question_title_slug.length) + 1;
            if(arr.indexOf(r) === -1) arr.push(r);
        }

        const Counter = db.counters;
        const Question = db.questions;

        for (let i = 0; i < arr.length; i++) {
            try {
                const query = `
                    query questionData {
                        question(titleSlug: "${question_title_slug[arr[i]]}") {
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
                    // // Check if a document with the same title exists in the database
                    const existingQuestion = await db.questions.findOne({ questionTitle: data.title });

                    if (existingQuestion) {
                        // Update the existing document with the new data
                        existingQuestion.questionTitle = data.title;
                        existingQuestion.questionDescription = data.content;
                        existingQuestion.questionCategory = data.topicTags[0].name;
                        existingQuestion.questionComplexity = data.difficulty;

                        // Save the updated document
                        await existingQuestion.save();
                        console.log('Updated question: ', data.title);
                        finalData[existingQuestion.questionId] = existingQuestion;
                    } else {
                        // Update counter and add new question
                        Counter.findOneAndUpdate({ id: "questionId" }, { $inc: { seq: 1 } }, { upsert: true, new: true, setDefaultsOnInsert: true })
                            .then(count => {
                                const question = new Question({
                                questionId: count.seq,
                                questionTitle: data.title,
                                questionDescription: data.content,
                                questionCategory: data.topicTags[0].name,
                                questionComplexity: data.difficulty
                            });

                            question.save(question).then(e => {
                                console.log('Added question: ', data.title);
                                finalData[question.questionId] = question;
                            }).catch(err => {
                                res.status(500).send({ message: err.message });
                            });
                        }).catch(err => {
                            console.log(err);
                        })
                    }
                }
            } catch (error) {
                console.error(`Error fetching data for question "${question_title_slug[arr[i]]}":`, error);
                res.status(500).send('');
            }
        }

        // Create a response object
        res.set('headers', HEADERS);
        res.status(200).send(JSON.stringify({ finalData }));
    } catch (error) {
        console.error('Error fetching question list:', error);
        res.status(500).send('Failed to fetch questions');
    }
});