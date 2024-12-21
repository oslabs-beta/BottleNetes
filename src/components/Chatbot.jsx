import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import { react } from "react";
import logo from "../assets/logo.png";

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
};

const Chatbot = ({ allData, fetchData }) => {
  // State that holds ai response
  const [aiContent, setAiContent] = useState([]);

  // State that holds user input
  const [userInput, setUserInput] = useState("");

  // State that holds all user chat input
  const [historicalUserInput, setHistoricalUserInput] = useState([]);

  // Scrollbar reference
  const chatRef = useRef(null);

  // Update userInput state every time keystroke logged
  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  // Submits form when user hits enter
  const handleKeyDown = ((e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      handleSubmit(e)
    }
  });
  
  //Event handler for form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!userInput.trim()) return;

    // Update historical user input state
    setHistoricalUserInput((historicalUserInput) => [
      ...historicalUserInput,
      userInput,
    ]);
    setUserInput("");

    // Formate request body
    const body = {
      allData: allData,
      userMessage: userInput,
    };

    // Send data to backend and update state with ai response
    try {
      const response = await fetchData("POST", "ai/askAi", body);
      const { analysis } = response;
      setAiContent((aiContent) => [
        ...aiContent,
        analysis || "❌ No response received",
      ]);
    } catch (error) {
      console.error("😵 Error:", error);
      throw new Error("💀 an error has occurred...");
    }
  };

  // Scroll to bottom of convo every time
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [aiContent, historicalUserInput]);

  // Map out user-ai conversation
  const conversationArr = [];
  for (
    let i = 0;
    i < Math.max(aiContent.length, historicalUserInput.length);
    i++
  ) {
    conversationArr.push(
      // human chat
      <div className="ml-auto mt-2 flex w-full max-w-xs justify-end space-x-3">
        {/* div that includes timestamp */}
        <div>
          {/* text bubble backgorund color */}
          <div className="rounded-l-lg rounded-br-lg bg-blue-600 p-2 text-white">
            {/* actual text */}
            <p className="text-sm">{historicalUserInput[i]}</p>
          </div>
          <span className="text-xs leading-none text-gray-500">
            {formatTimestamp(setAiContent.timestamp)}
          </span>
        </div>
        {/* human circles */}

        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"></div>
      </div>,

      // ai chat?
      <div className="mt-1 flex w-full max-w-xs space-x-3">
        {/* AI circle */}
        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-red-300"></div>
        {/* div that includes the timestamp */}
        <div>
          {/* actual text */}
          <div className="rounded-r-lg rounded-bl-lg bg-gray-300 p-2">
            <p className="text-sm">{aiContent[i]}</p>
          </div>
          <span className="text-xs leading-none text-gray-500">
            {formatTimestamp(setAiContent.timestamp)}
          </span>
        </div>
      </div>,
    );
  }

  //RENDERING CHATBOT COMPONENT
  return (
    <div className="flex min-h-[500px] flex-col items-center">
      <div className="flex w-full max-w-xl flex-grow flex-col overflow-hidden rounded-lg bg-white p-1.5 shadow-xl">
        <div
          className="flex h-0 flex-grow flex-col overflow-auto p-3"
          ref={chatRef}
        >
          {/* ai text box that includes everything*/}
          <div className="flex w-full max-w-xs space-x-3">
            {/* AI circle */}
            <div className="h-20 w-20 flex-shrink-0">
              <img
                src={logo}
                alt="AI Logo"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            {/* div that includes the timestamp */}
            <div>
              {/* actual text */}
              <div className="rounded-r-lg rounded-bl-lg bg-gray-300 p-3">
                <p className="text-sm">How can I help you?</p>
              </div>
              <span className="text-xs leading-none text-gray-500">
                {formatTimestamp(setAiContent.timestamp)}
              </span>
            </div>
          </div>
          {conversationArr}
        </div>
        {/* Input text box */}
        <span className="bg flex w-full items-center justify-between">
          <div className="flex-grow rounded-l-lg rounded-br-lg p-2">
            <input
              className="flex h-10 w-full items-center rounded-xl bg-blue-200 px-5 text-sm"
              type="text"
              placeholder="Type your message…"
              onChange={handleInputChange}
              value={userInput}
              onKeyDown={handleKeyDown}
            ></input>
          </div>
          <div className="text-m mx-1 rounded-xl bg-blue-500 px-3 py-1.5 text-slate-200 hover:brightness-90">
            <button onClick={handleSubmit}>Send</button>
          </div>
        </span>
      </div>
    </div>
  );
};

// Validate allData prop type
Chatbot.propTypes = {
  allData: PropTypes.object,
  fetchData: PropTypes.func.isRequired,
};

export default Chatbot;