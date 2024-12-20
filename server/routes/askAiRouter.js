// askAiRouter.js - Router for POST /askAi endpoint
import express from 'express';  
const router = express.Router();
import askAiController from '../controllers/askAiController.js';

router.post('/askAi', askAiController.queryOpenAI, (req, res) => {
    return res.status(200).json({ success: true, analysis: res.locals.analysis });
});

export default router;
