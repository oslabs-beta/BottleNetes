/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { useEffect, useRef } from "react";

import logo from "../assets/logo.png";
import dataStore from "../stores/dataStore";
import userStore from "../stores/userStore";
import chatBotStore from "../stores/chatBotStore";

// Helper function to calculate relative time
// This version calculates a human-readable timestamp format like "5 min ago"
const formatRelativeTime = (timestamp: number) => {
  const secondsAgo = Math.floor((Date.now() - timestamp) / 1000); // Calculate the difference in seconds
  if (secondsAgo < 60) return `${secondsAgo} sec ago`; // Less than 1 minute
  if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} min ago`; // Less than 1 hour
  return `${Math.floor(secondsAgo / 3600)} hr ago`; // 1 hour or more
};

// A previous formatTimestamp function was used, but the relative time approach is more user-friendly.
// Old code for comparison:
// const formatTimestamp = (timestamp) => {
//   const date = new Date(timestamp);
//   return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
// };

type Body = {
  [key: string]: string | number | Record<string, unknown>;
};

const Chatbot = () => {
  const backendUrl = dataStore((state) => state.backendUrl);
  const username = userStore((state) => state.username);
  const {
    // State to hold user input text
    userInput,
    setUserInput,
    // State to store user message history
    historicalUserInput,
    setHistoricalUserInput,
    // State to track timestamps for messages
    timestamps,
    setTimestamps,
    // State to hold AI responses
    aiContent,
    setAiContent,
  } = chatBotStore();
  
  const fetchData = async (method: string, endpoint: string, body: Body) => {
    console.log(`Sending ${method} request to ${backendUrl}${endpoint}...`);
    
    try {
      const response = await fetch(`${backendUrl}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("😵 Error:", error);
    }
  };
  
  // Scrollbar reference for auto-scrolling
  const chatRef = useRef<HTMLDivElement>(null);

  // Handle input changes for the text field
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value); // Updates the state with user input
  };

  // Event handler for pressing Enter to submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents default form submission
      handleSubmit(e as React.KeyboardEvent<HTMLInputElement>); // Calls handleSubmit
    }
  };

  // Handle form submission to send user input and fetch AI response
  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (!userInput.trim()) return; // Prevent empty submissions

    const timestamp = new Date(Date.now()); // Record the current timestamp

    // Update historical user input and timestamps states
    setHistoricalUserInput([{...historicalUserInput, text: userInput, timestamp }]);
    setTimestamps([...timestamps, timestamp]);

    setUserInput(""); // Clear the input field after submission

    // Format request body
    const body = {
      // allData: allData,
      userMessage: userInput,
    };

    // Send data to backend and update AI response state
    try {
      const response = await fetchData("POST", "ai/askAi", body);
      const { analysis } = await response.json();

      // Append the AI response and its timestamp to aiContent state
      setAiContent([...aiContent, { text: analysis || "❌ No response received", timestamp }]);
    } catch (error) {
      console.error("😵 Error:", error);
    }
  };

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [aiContent, historicalUserInput]);

  // Construct the conversation array dynamically
  const conversationArr: JSX.Element[] = [];
  for (
    let i = 0;
    i < Math.max(aiContent.length, historicalUserInput.length);
    i++
  ) {
    const userMessage = historicalUserInput[i];
    const aiMessage = aiContent[i];

    // Render user messages
    conversationArr.push(
      // Render AI messages
      aiMessage && (
        <div className="mt-1 flex w-full max-w-xs space-x-3">
          <div className="h-10 w-10 flex-shrink-0">
            <img
              src={logo}
              alt="AI Logo"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <div>
            <div className="rounded-r-lg rounded-bl-lg bg-gradient-to-br from-gray-400 to-gray-200 p-2">
              <p className="text-sm">{aiMessage.text}</p>
            </div>
            <span className="text-xs font-bold leading-none text-gray-500">
              {formatRelativeTime(aiMessage.timestamp.getTime())}
            </span>
          </div>
        </div>
      ),
      userMessage && (
        <div className="ml-auto mt-2 flex w-full max-w-xs justify-end space-x-3">
          <div>
            <div className="rounded-l-lg rounded-br-lg bg-gradient-to-br from-[#6699e1] to-[#2229f4] p-2 text-white">
              <p className="text-sm">{userMessage.text}</p>
            </div>
            <span className="text-xs leading-none text-gray-500">
              {formatRelativeTime(userMessage.timestamp.getTime())}
            </span>
          </div>
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-800 to-indigo-600 font-bold text-white">
            {username[0].toUpperCase()}{" "}
            {/* Display the first letter of the username */}
          </div>
        </div>
      ),
    );
  }

  // Render the chatbot component
  return (
    <div
      // logoStyle={{
      //   width: "70px",
      //   height: "70px",
      //   borderRadius: "50%",
      //   boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      //   backgroundImage: "linear-gradient(to right, #1e90ff, #87ceeb)",
      //   color: "#fff",
      //   fontSize: "18px",
      //   fontWeight: "bold",
      //   textTransform: "uppercase",
      // }}
      className="text-gradient font-poppins flex min-h-[500px] flex-col items-center text-2xl font-bold shadow-lg"
    >
      <div className="flex w-full max-w-xl flex-grow flex-col overflow-hidden rounded-lg bg-white p-1.5 shadow-xl">
        <div
          className="flex h-0 flex-grow flex-col overflow-auto p-3"
          ref={chatRef}
        >
          {/* <div className="flex w-full max-w-xs space-x-3">
            <div className="h-20 w-20 flex-shrink-0">
              <img
                src={logo}
                alt="AI Logo"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <div>
              <div className="rounded-r-lg rounded-bl-lg bg-gray-300 p-3">
                <p className="text-sm">How can I help you?</p>
              </div>
              <span className="text-xs leading-none text-gray-500">
                {formatRelativeTime(Date.now())}
              </span>
            </div>
          </div> */}
          {conversationArr}
        </div>
        <span className="bg flex w-full items-center justify-between">
          <div className="flex-grow rounded-l-lg rounded-br-lg p-2">
            <input
              className="flex h-10 w-full items-center rounded-xl bg-blue-200 px-5 text-sm"
              type="text"
              placeholder="Type your message…"
              onChange={handleInputChange}
              value={userInput}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="text-m mx-1 rounded-xl bg-blue-500 px-3 py-1.5 text-slate-200 hover:brightness-90">
            <button onClick={handleSubmit}>Send</button>
          </div>
        </span>
      </div>
    </div>
  );
};

export default Chatbot;
