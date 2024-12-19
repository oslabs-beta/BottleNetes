import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { react } from "react";

const Chatbot = ({ allData, fetchData }) => {
  // State that holds ai response?
  const [aiContent, setAiContent] = useState(null);

  // State that holds user input
  const [userInput, setUserInput] = useState(null);

  // Function to interact with AI
  const askAi = async () => {
    setAiContent(null);
    const body = allData;
    // Get AI response
    const response = await fetchData("POST", "ai/askAi", body);
    const { analysis } = response;
    console.log(analysis);
    setAiContent(analysis);
  };

  return (
    <div>
      <div className="chat-popup" id="myForm">
        <form action="/action_page.php" className="form-container">
          <h1>Chat</h1>
          <label>
            <b>Message</b>
          </label>
          <textarea placeholder="Type message.." name="msg" required></textarea>

          <button type="submit" className="btn">
            Send
          </button>
          <button type="button" className="btn cancel">
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

// Validate allData prop type
Chatbot.propTypes = {
  allData: PropTypes.object,
  fetchData: PropTypes.function,
};

export default Chatbot;
