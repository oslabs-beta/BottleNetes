import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { react } from "react";

const Chatbot = ({ allData, fetchData }) => {
  // State that holds ai response?
  const [aiContent, setAiContent] = useState(null);

  // State that holds user input
  const [userInput, setUserInput] = useState(null);

  //Event handler to handle user input field
  const handleInputChange = (event) => {
    // console.log("New text: ", event.target.value);
    //updates state with current input value
    setUserInput(event.target.value); 
  };
  
  //Event handler for form submission
  const handleSubmit = async (event) => {
    // console.log("Submit button was clicked")
    //Prevent the default form submission (page reload)
    event.preventDefault()

    //stop if input is empty or just spaces //ADD A MESSAGE HERE MAYBE?
    if (!userInput.trim()) return;

    //body for backend req
    const body = {
      //spread operator to include any additional data from props
      allData: allData,
      //Add the user's input to the body
      userMessage: userInput
    };

    try {
      setAiContent("⏳ ⏳ ⏳ Loading...")

      //send data to backend using fetchData func
      const response = await fetchData("POST", "ai/askAi", body);

      //Extract ai res from the  backend's destructured res
      const { analysis } = response;

      //Update the state with response or default message
      setAiContent(analysis || "❌ No response received");
    
      //Clear user input field
      setUserInput(""); 
      
    } catch (error) {
      
      //Log any errors in the console
      console.error("😵 Error:", error);

      //Display error message
      setAiContent ('💀 an error has occurred...') ; 
    }
};


//  // Function to interact with AI
  // const askAi = async () => {
  //   setAiContent(null);
  //   const body = allData;
  //   // Get AI response
  //   const response = await fetchData("POST", "ai/askAi", body);
  //   const { analysis } = response;
  //   console.log(analysis);
  //   setAiContent(analysis);
  // };

//RENDERING CHATBOT COMPONENT
  return (
    <div className="flex min-h-[500px] flex-col items-center">
      <div className="flex w-full max-w-xl flex-grow flex-col overflow-hidden rounded-lg bg-white p-3 shadow-xl">
        <div className="flex h-0 flex-grow flex-col overflow-auto p-4">
          <div className="mt-1 flex w-full max-w-xs space-x-3">
            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"></div>
            <div>
              <div className="rounded-r-lg rounded-bl-lg bg-gray-300 p-3">
                <p className="text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
              <span className="text-xs leading-none text-gray-500">
                2 min ago
              </span>
            </div>
          </div>
          <div className="ml-auto mt-2 flex w-full max-w-xs justify-end space-x-3">
            <div>
              <div className="rounded-l-lg rounded-br-lg bg-blue-600 p-3 text-white">
                <p className="text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod.
                </p>
              </div>
              <span className="text-xs leading-none text-gray-500">
                2 min ago
              </span>
            </div>
            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"></div>
          </div>
          <div className="ml-auto mt-2 flex w-full max-w-xs justify-end space-x-3">
            <div>
              <div className="rounded-l-lg rounded-br-lg bg-blue-600 p-3 text-white">
                <p className="text-sm">Lorem ipsum dolor sit amet.</p>
              </div>
              <span className="text-xs leading-none text-gray-500">
                2 min ago
              </span>
            </div>
            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"></div>
          </div>
          <div className="mt-2 flex w-full max-w-xs space-x-3">
            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"></div>
            <div>
              <div className="rounded-r-lg rounded-bl-lg bg-gray-300 p-3">
                <p className="text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.{" "}
                </p>
              </div>
              <span className="text-xs leading-none text-gray-500">
                2 min ago
              </span>
            </div>
          </div>
          <div className="ml-auto mt-2 flex w-full max-w-xs justify-end space-x-3">
            <div>
              <div className="rounded-l-lg rounded-br-lg bg-blue-600 p-3 text-white">
                <p className="text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.{" "}
                </p>
              </div>
              <span className="text-xs leading-none text-gray-500">
                2 min ago
              </span>
            </div>
            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"></div>
          </div>
          <div className="ml-auto mt-2 flex w-full max-w-xs justify-end space-x-3">
            <div>
              <div className="rounded-l-lg rounded-br-lg bg-blue-600 p-3 text-white">
                <p className="text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt.
                </p>
              </div>
              <span className="text-xs leading-none text-gray-500">
                2 min ago
              </span>
            </div>
            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"></div>
          </div>
          <div className="ml-auto mt-2 flex w-full max-w-xs justify-end space-x-3">
            <div>
              <div className="rounded-l-lg rounded-br-lg bg-blue-600 p-3 text-white">
                <p className="text-sm">Lorem ipsum dolor sit amet.</p>
              </div>
              <span className="text-xs leading-none text-gray-500">
                2 min ago
              </span>
            </div>
            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"></div>
          </div>
          <div className="mt-2 flex w-full max-w-xs space-x-3">
            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"></div>
            <div>
              <div className="rounded-r-lg rounded-bl-lg bg-gray-300 p-3">
                <p className="text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.{" "}
                </p>
              </div>
              <span className="text-xs leading-none text-gray-500">
                2 min ago
              </span>
            </div>
          </div>
          <div className="ml-auto mt-2 flex w-full max-w-xs justify-end space-x-3">
            <div>
              <div className="rounded-l-lg rounded-br-lg bg-blue-600 p-3 text-white">
                <p className="text-sm">{aiContent}</p>
              </div>
              <span className="text-xs leading-none text-gray-500">
                2 min ago
              </span>
            </div>
            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"></div>
          </div>
        </div>
        {/* Input text box */}
        <span className="flex w-full items-center justify-between">
          <div className="rounded-br-lgbg-blue-600 flex-grow rounded-l-lg p-2">
            <input
              className="flex h-10 w-full items-center rounded px-5 text-sm"
              type="text"
              placeholder="Type your message…"
              onChange={(e) => handleInputChange(e)}
            ></input>
          </div>
          <div className="text-m mx-1 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-1 text-slate-200 hover:brightness-90">
            <button onClick={(e) => handleSubmit(e)}>Send</button>
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

// <div className="flex" id="myForm">
//   {/* close button */}
//   <div>
//     <button>
//       CLOSE
//     </button>
//   </div>

//   {/* Textbox div */}
//   <div className="flex column">
//     <p>AI</p>
//   </div>

//   {/* Submit form div */}
//   <div id="submitForm">
//     <form action="/action_page.php" className="form-container">
//       <label>
//         <b>Message</b>
//       </label>
//       <textarea placeholder="Type message.." name="msg" required></textarea>

//       <button
//         type="submit"
//         className="text-s rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-2 py-1 text-slate-200 hover:brightness-90 hover:filter"
//       >
//         Send
//       </button>
//     </form>
//   </div>
// </div>
