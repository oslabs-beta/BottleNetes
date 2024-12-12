import { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa"; // Icons for light and dark mode

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check user's preferred theme or default to light mode
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    // Add or remove the `dark` class on the HTML element
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark"); // Persist preference
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light"); // Persist preference
    }
  }, [darkMode]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white text-black dark:bg-gray-900 dark:text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Toggle Dark Mode</h1>
        <p className="mt-2">Current mode: {darkMode ? "Dark" : "Light"}</p>

        {/* Toggle Switch */}
        <div
          className={`mt-4 flex h-8 w-14 cursor-pointer items-center rounded-full p-1 ${
            darkMode ? "bg-gray-700" : "bg-gray-300"
          }`}
          onClick={() => setDarkMode(!darkMode)}
        >
          {/* Knob with Icon */}
          <div
            className={`flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow-md transition-transform ${
              darkMode ? "translate-x-6" : "translate-x-0"
            }`}
          >
            {darkMode ? (
              <FaMoon className="text-blue-500" size={16} />
            ) : (
              <FaSun className="text-yellow-500" size={16} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
