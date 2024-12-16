// askAiController.js - Controller for handling POST /askAi connecting to OpenAI API
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const openAiApiKey = process.env.OPENAI_API_KEY;
const openAiEndpoint = 'https://api.openai.com/v1/chat/completions';

const askAiController = {};

askAiController.queryOpenAI = async (req, res, next) => {
    const { metrics } = req.body;

    if (!metrics || typeof metrics !== 'string') {
        return res.status(400).json({ success: false, message: 'Invalid metrics format' });
    }

    try {
        const response = await axios.post(
            openAiEndpoint, 
            {
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: 'You are a Kubernetes metrics analysis assistant.' },
                    { role: 'user', content: `Analyze these Kubernetes metrics: ${metrics}` }
                ]
            }, 
            {
                headers: {
                    'Authorization': `Bearer ${openAiApiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const result = response.data.choices[0].message.content;
        res.locals.analysis = result;
        next();
    } catch (error) {
        console.error('OpenAI API Error:', error.response?.data || error.message);
        return res.status(500).json({ success: false, message: 'Error processing metrics analysis' });
    }
};

export default askAiController;

