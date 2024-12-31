//askAiRouter.js - Router for POST /askAi endpoint
//Original Code (Commented Out)
import express from "express";
import askAiController from "../controllers/askAiController.js";

const router = express.Router();

router.post("/", askAiController.queryOpenAI, (req, res) => {
  res.status(200).json({ success: true, response: res.locals.analysis });
});

export default router;

// import express from "express";
// const router = express.Router();
// import askAiController from "../controllers/askAiController.js";

// const check = (req, res, next) => {
//   console.log("askAi router hit");
//   return next();
// };

// router.post("/askAi", check, askAiController.queryOpenAI, (req, res) => {
//   return res.status(200).json({ success: true, analysis: res.locals.analysis });
// });

// export default router;

// import express from "express";

// const router = express.Router();

// router.post("/askAi", (req, res) => {
//   const { userMessage } = req.body; // Extract user message from the request body

//   // Mock response generation for demonstration
//   const analysis = `You said: ${userMessage}`;

//   res.json({ analysis });
//   /*
//     Why this change?
//     - Simplified implementation to provide a mock response for testing frontend functionality.
//     - Ensures the backend correctly processes requests from the Chatbot component.
//     - Returns an "analysis" field in the response, matching the structure expected by the Chatbot.
//     - This allows the frontend Chatbot to seamlessly display AI responses during initial development.
//   */
// });

// export default router;
