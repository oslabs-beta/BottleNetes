/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import { useEffect, useRef } from "react";
import Draggable from "react-draggable";

import logo from "../assets/logo.png";
import dataStore from "../stores/dataStore";
import userStore from "../stores/userStore";
import chatBotStore, { Message } from "../stores/chatBotStore";

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

const Chatbot = ({
  setAiVisibility,
}: {
  setAiVisibility: (visible: boolean) => void;
}) => {
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const backendUrl = dataStore((state) => state.backendUrl);
  const username = userStore((state) => state.username);
  const allData = dataStore((state) => state.allData);
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
    resetChat,
  } = chatBotStore();

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
  const handleSubmit = async (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();
    if (!userInput.trim()) return;

    const timestamp = Date.now();
    const currentUserInput = userInput;

    // Fixed typing issues
    setHistoricalUserInput({ text: currentUserInput, timestamp });
    setTimestamps(timestamp);
    setUserInput("");

    // Prune helper function
    function pruneArray(arr: object[], targetLength: number) {
      const originalLength = arr.length;
      if (originalLength <= targetLength) return arr;
      const step = Math.floor(originalLength / targetLength);
      const prunedArray = [];
      for (let i = 0; i < originalLength; i += step) {
        prunedArray.push(arr[i]);
        if (prunedArray.length === targetLength) break;
      }
      // }
      return prunedArray;
    }

    // Loop through nested structures and prune
    function loopedPrune(arrOfArrs: object[] | undefined) {
      const prunedArray: object[] = [];
      arrOfArrs?.forEach((node) => {
        const prunedNode: { [key: string]: object[] } = {};
        for (const key in node as Record<string, object[]>) {
          // HARD CODE ALERT
          prunedNode[key] = pruneArray(
            (node as Record<string, object[]>)[key] as object[],
            // HARD CODE ALERT
            Math.floor((node as Record<string, object[]>)[key].length / 50),
          );
        }
        prunedArray.push(prunedNode);
      });
      return prunedArray;
    }

    // Prune data
    const prunedCpuUsageHistorical = Array.isArray(allData.cpuUsageHistorical)
      ? []
      : loopedPrune(allData.cpuUsageHistorical?.resourceUsageHistorical);
    const prunedLatencyAppRequestHistorical = Array.isArray(
      allData.latencyAppRequestHistorical,
    )
      ? []
      : loopedPrune(
          allData.latencyAppRequestHistorical?.latencyAppRequestHistorical,
        );
    const prunedMemoryUsageHistorical = Array.isArray(
      allData.memoryUsageHistorical,
    )
      ? []
      : loopedPrune(allData.memoryUsageHistorical?.resourceUsageHistorical);

    // Format data to send back with pruned data
    const dataToSendBack = {
      prunedCpuUsageHistorical: prunedCpuUsageHistorical,
      prunedLatencyAppRequestHistorical: prunedLatencyAppRequestHistorical,
      prunedMemoryUsageHistorical: prunedMemoryUsageHistorical,
      rawAllPodsStatus: Array.isArray(allData.podsStatuses)
        ? undefined
        : allData.podsStatuses.allPodsStatus,
      rawAllPodsRequestLimit: Array.isArray(allData.requestLimits)
        ? undefined
        : allData.requestLimits.allPodsRequestLimit,
    };

    // Format request body
    const body = {
      data: dataToSendBack,
      userMessage: userInput,
    };

    setIsWaitingForResponse(true);

    // Send data to backend and update AI response state
    try {
      const response = await fetch(backendUrl + "ai/askAi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Fixed typing issue
      setAiContent({
        text: data.analysis || "❌ No response received",
        timestamp,
      });
      setIsWaitingForResponse(false);
    } catch (error) {
      console.error("😵 Error:", error);
      setIsWaitingForResponse(false);
    }
  };

  const handleNewConversation = () => {
    resetChat(); // This will clear all conversation history and reset to initial state
    setUserInput(""); // Clear current input field
    setIsWaitingForResponse(false); // Reset loading state if active
  };

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [aiContent, historicalUserInput]);

  // Initialize with welcome message
  useEffect(() => {
    if (aiContent.length === 0) {
      setAiContent([
        { text: "How can I help you?", timestamp: Date.now() },
      ] as Message[]);
    }
  }, []);

  // Render conversation messages
  const conversationArr: JSX.Element[] = [];

  // Add initial AI greeting
  if (aiContent[0]) {
    conversationArr.push(
      <div key="greeting" className="mt-1 flex w-full max-w-xs space-x-3">
        <div className="h-10 w-10 flex-shrink-0">
          <img
            src={logo}
            alt="AI Logo"
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        <div>
          <div className="rounded-r-lg rounded-bl-lg bg-gradient-to-br from-gray-400 to-gray-200 p-2">
            <p className="text-sm">{aiContent[0].text}</p>
          </div>
          <span className="text-xs font-bold leading-none text-gray-500">
            {formatRelativeTime(aiContent[0].timestamp)}
          </span>
        </div>
      </div>,
    );
  }

  // Add conversation history
  for (let i = 0; i < historicalUserInput.length; i++) {
    const userMessage = historicalUserInput[i];
    const aiMessage = aiContent[i + 1];

    if (userMessage) {
      conversationArr.push(
        <div key={`message-${i}`}>
          {/* User message */}
          <div className="ml-auto mt-2 flex w-full max-w-xs justify-end space-x-3">
            <div>
              <div className="rounded-l-lg rounded-br-lg bg-gradient-to-br from-[#6699e1] to-[#2229f4] p-2 text-white">
                <p className="text-sm">{userMessage.text}</p>
              </div>
              <span className="text-xs leading-none text-gray-500">
                {formatRelativeTime(userMessage.timestamp)}
              </span>
            </div>
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-800 to-indigo-600 font-bold text-white">
              {username[0].toUpperCase()}
            </div>
          </div>

          {/* AI response */}
          {aiMessage && (
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
                  {formatRelativeTime(aiMessage.timestamp)}
                </span>
              </div>
            </div>
          )}
        </div>,
      );
    }
  }

  // Add loading message if waiting for response
  if (isWaitingForResponse) {
    conversationArr.push(
      <div key="loading" className="mt-1 flex w-full max-w-xs space-x-3">
        <div className="h-10 w-10 flex-shrink-0">
          <img
            src={logo}
            alt="AI Logo"
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        <div>
          <div className="rounded-r-lg rounded-bl-lg bg-gradient-to-br from-gray-400 to-gray-200 p-2">
            <p className="flex items-center text-sm">
              Thinking
              <svg className="ml-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            </p>
          </div>
        </div>
      </div>,
    );
  }

  // Render the chatbot component
  return (
    <Draggable handle=".drag-handle">
      <div
        className="text-gradient font-poppins relative flex min-h-[500px] flex-col items-center text-2xl font-bold shadow-lg"
        style={{ zIndex: 9999 }}
      >
        <div className="drag-handle flex w-full cursor-move items-center justify-between rounded-t-lg bg-gradient-to-r from-blue-500 to-blue-600 p-2">
          <span className="text-sm text-white">BottleNetes AI Assistant</span>
          <div className="mr-2 flex items-center gap-3">
            <button
              onClick={handleNewConversation}
              className="rounded border border-white/30 px-2 py-1 text-sm text-white hover:text-gray-200"
            >
              New Conversation
            </button>
            <button
              onClick={() => setAiVisibility(false)}
              className="text-white hover:text-gray-200"
            >
              &#10005;
            </button>
          </div>
        </div>
        <div className="flex w-full max-w-xl flex-grow flex-col overflow-hidden rounded-lg bg-white shadow-xl">
          <div
            className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 flex h-[400px] flex-col overflow-y-auto p-3"
            ref={chatRef}
          >
            {conversationArr}
          </div>
          <span className="bg flex w-full items-center justify-between p-2">
            <div className="flex-grow rounded-l-lg rounded-br-lg">
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
    </Draggable>
  );
};

export default Chatbot;
