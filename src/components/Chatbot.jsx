import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.png"; // AI logo for branding

// Helper function to calculate relative time
const formatRelativeTime = (timestamp) => {
  const secondsAgo = Math.floor((Date.now() - timestamp) / 1000);
  if (secondsAgo < 60) return `${secondsAgo} sec ago`;
  if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} min ago`;
  return `${Math.floor(secondsAgo / 3600)} hr ago`;
};

const Chatbot = ({ allData, fetchData, username }) => {
  const [aiContent, setAiContent] = useState([
    { text: "How can I help you?", timestamp: Date.now() },
  ]);
  const [userInput, setUserInput] = useState("");
  const [historicalUserInput, setHistoricalUserInput] = useState([]);
  const chatRef = useRef(null);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userInput.trim()) return;

    const timestamp = Date.now();
    setHistoricalUserInput((prev) => [...prev, { text: userInput, timestamp }]);

    setUserInput("");

    const body = { userMessage: userInput };

    try {
      const response = await fetchData("POST", "/api/askAi", body);
      const { response: aiResponse } = response;

      setAiContent((prev) => [
        ...prev,
        { text: aiResponse || "No response received", timestamp },
      ]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [aiContent, historicalUserInput]);

  const conversationArr = [];
  for (
    let i = 0;
    i < Math.max(aiContent.length, historicalUserInput.length);
    i++
  ) {
    const userMessage = historicalUserInput[i];
    const aiMessage = aiContent[i];

    conversationArr.push(
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
              {formatRelativeTime(aiMessage.timestamp)}
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
              {formatRelativeTime(userMessage.timestamp)}
            </span>
          </div>
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-800 to-indigo-600 font-bold text-white">
            {username[0].toUpperCase()}
          </div>
        </div>
      )
    );
  }

  return (
    <div className="flex min-h-[500px] flex-col items-center">
      <div className="flex w-full max-w-xl flex-grow flex-col overflow-hidden rounded-lg bg-white p-1.5 shadow-xl">
        <div
          className="flex h-0 flex-grow flex-col overflow-auto p-3"
          ref={chatRef}
        >
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

Chatbot.propTypes = {
  allData: PropTypes.object,
  fetchData: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
};

export default Chatbot;

// import PropTypes from "prop-types";
// import { useState, useEffect, useRef } from "react";
// import logo from "../assets/logo.png"; // Importing the AI logo image for branding purposes

// // Helper function to calculate relative time
// // This version calculates a human-readable timestamp format like "5 min ago"
// const formatRelativeTime = (timestamp) => {
//   const secondsAgo = Math.floor((Date.now() - timestamp) / 1000); // Calculate the difference in seconds
//   if (secondsAgo < 60) return `${secondsAgo} sec ago`; // Less than 1 minute
//   if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} min ago`; // Less than 1 hour
//   return `${Math.floor(secondsAgo / 3600)} hr ago`; // 1 hour or more
// };

// // A previous formatTimestamp function was used, but the relative time approach is more user-friendly.
// // Old code for comparison:
// // const formatTimestamp = (timestamp) => {
// //   const date = new Date(timestamp);
// //   return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
// // };

// const Chatbot = ({ allData, fetchData, username }) => {
//   // State to hold AI responses
//   const [aiContent, setAiContent] = useState([
//     { text: "How can I help you?", timestamp: Date.now() },
//   ]);
//   // State to hold user input text
//   const [userInput, setUserInput] = useState("");
//   // State to store user message history
//   const [historicalUserInput, setHistoricalUserInput] = useState([]);
//   // State to track timestamps for messages
//   const [timestamps, setTimestamps] = useState([]); // Added for displaying relative timestamps
//   // Scrollbar reference for auto-scrolling
//   const chatRef = useRef(null);

//   // Handle input changes for the text field
//   const handleInputChange = (event) => {
//     setUserInput(event.target.value); // Updates the state with user input
//   };

//   // Event handler for pressing Enter to submit
//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault(); // Prevents default form submission
//       handleSubmit(e); // Calls handleSubmit
//     }
//   };

//   // Handle form submission to send user input and fetch AI response
//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!userInput.trim()) return; // Prevent empty submissions

//     const timestamp = Date.now(); // Record the current timestamp

//     // Update historical user input and timestamps states
//     setHistoricalUserInput((prev) => [...prev, { text: userInput, timestamp }]);
//     setTimestamps((prev) => [...prev, timestamp]);

//     setUserInput(""); // Clear the input field after submission

//     // Format request body
//     const body = {
//       // allData: allData,
//       userMessage: userInput,
//     };

//     function pruneArray(arr, targetLength) {
//       const originalLength = arr.length;
//       if (originalLength <= targetLength) return arr;
//       // If the array is already short enough, no need to prune }
//       const step = Math.floor(originalLength / targetLength);
//       const prunedArray = [];
//       for (let i = 0; i < originalLength; i += step) {
//         prunedArray.push(arr[i]);
//         if (prunedArray.length === targetLength) break; // Stop when we have the desired number of elements
//       }
//       // }
//       return prunedArray;
//     }

//     const historicalDataArray = [
//       allData.cpuUsageHistorical.resourceUsageHistorical, // array of 12 elements
//       allData.latencyAppRequestHistorical.latencyAppRequestHistorical, // array of 1 elements
//       allData.memoryUsageHistorical.resourceUsageHistorical, // array of 10 elements
//     ];
//     console.log(
//       allData.latencyAppRequestHistorical.latencyAppRequestHistorical,
//     );

//     const singlePointArray = [
//       allData.podsStatuses.allPodsStatus, // array of 20 elements
//       allData.requestLimits.allPodsRequestLimit, // array of 12 elements
//     ];

//     const prunedHistoricalDataArray = [];
//     //  console.log(singlePointArray)

//     //loop through each individual element of historicalDataArray
//     historicalDataArray.forEach((datasetArray) => {
//       const dataTypeHold = [];
//       // console.log(datasetArray)
//       datasetArray.forEach((node) => {
//         const nodeHold = [];
//         // console.log(Array.isArray(node))
//         node.forEach((dataArray) => {
//           if (Array.isArray(dataArray) && dataArray.length > 100) {
//             nodeHold.push(pruneArray(dataArray, dataArray.length / 3));
//           } else nodeHold.push(dataArray);
//         });
//         dataTypeHold.push(nodeHold);
//       });
//       prunedHistoricalDataArray.push(dataTypeHold);
//     });



//     // Send data to backend and update AI response state
//     try {
//       const response = await fetchData("POST", "ai/askAi", body);
//       const { analysis } = response;

//       // Append the AI response and its timestamp to aiContent state
//       setAiContent((prev) => [
//         ...prev,
//         { text: analysis || "❌ No response received", timestamp },
//       ]);
//     } catch (error) {
//       console.error("😵 Error:", error);
//     }
//   };

//   // Auto-scroll to the bottom when new messages are added
//   useEffect(() => {
//     if (chatRef.current) {
//       chatRef.current.scrollTop = chatRef.current.scrollHeight;
//     }
//   }, [aiContent, historicalUserInput]);

//   // Construct the conversation array dynamically
//   const conversationArr = [];
//   for (
//     let i = 0;
//     i < Math.max(aiContent.length, historicalUserInput.length);
//     i++
//   ) {
//     const userMessage = historicalUserInput[i];
//     const aiMessage = aiContent[i];

//     // Render user messages
//     conversationArr.push(
//       // Render AI messages
//       aiMessage && (
//         <div className="mt-1 flex w-full max-w-xs space-x-3">
//           <div className="h-10 w-10 flex-shrink-0">
//             <img
//               src={logo}
//               alt="AI Logo"
//               className="h-full w-full rounded-full object-cover"
//             />
//           </div>
//           <div>
//             <div className="rounded-r-lg rounded-bl-lg bg-gradient-to-br from-gray-400 to-gray-200 p-2">
//               <p className="text-sm">{aiMessage.text}</p>
//             </div>
//             <span className="text-xs font-bold leading-none text-gray-500">
//               {formatRelativeTime(aiMessage.timestamp)}
//             </span>
//           </div>
//         </div>
//       ),
//       userMessage && (
//         <div className="ml-auto mt-2 flex w-full max-w-xs justify-end space-x-3">
//           <div>
//             <div className="rounded-l-lg rounded-br-lg bg-gradient-to-br from-[#6699e1] to-[#2229f4] p-2 text-white">
//               <p className="text-sm">{userMessage.text}</p>
//             </div>
//             <span className="text-xs leading-none text-gray-500">
//               {formatRelativeTime(userMessage.timestamp)}
//             </span>
//           </div>
//           <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-800 to-indigo-600 font-bold text-white">
//             {username[0].toUpperCase()}{" "}
//             {/* Display the first letter of the username */}
//           </div>
//         </div>
//       ),
//     );
//   }

//   // Render the chatbot component
//   return (
//     <div className="flex min-h-[500px] flex-col items-center">
//       <div className="flex w-full max-w-xl flex-grow flex-col overflow-hidden rounded-lg bg-white p-1.5 shadow-xl">
//         <div
//           className="flex h-0 flex-grow flex-col overflow-auto p-3"
//           ref={chatRef}
//         >
//           {/* <div className="flex w-full max-w-xs space-x-3">
//             <div className="h-20 w-20 flex-shrink-0">
//               <img
//                 src={logo}
//                 alt="AI Logo"
//                 className="h-full w-full rounded-full object-cover"
//               />
//             </div>
//             <div>
//               <div className="rounded-r-lg rounded-bl-lg bg-gray-300 p-3">
//                 <p className="text-sm">How can I help you?</p>
//               </div>
//               <span className="text-xs leading-none text-gray-500">
//                 {formatRelativeTime(Date.now())}
//               </span>
//             </div>
//           </div> */}
//           {conversationArr}
//         </div>
//         <span className="bg flex w-full items-center justify-between">
//           <div className="flex-grow rounded-l-lg rounded-br-lg p-2">
//             <input
//               className="flex h-10 w-full items-center rounded-xl bg-blue-200 px-5 text-sm"
//               type="text"
//               placeholder="Type your message…"
//               onChange={handleInputChange}
//               value={userInput}
//               onKeyDown={handleKeyDown}
//             />
//           </div>
//           <div className="text-m mx-1 rounded-xl bg-blue-500 px-3 py-1.5 text-slate-200 hover:brightness-90">
//             <button onClick={handleSubmit}>Send</button>
//           </div>
//         </span>
//       </div>
//     </div>
//   );
// };

// // PropTypes validation
// Chatbot.propTypes = {
//   allData: PropTypes.object,
//   fetchData: PropTypes.func.isRequired,
//   username: PropTypes.string.isRequired, // New username prop for displaying initials
// };

// export default Chatbot;
