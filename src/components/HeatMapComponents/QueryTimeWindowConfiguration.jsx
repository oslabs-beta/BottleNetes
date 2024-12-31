/**
 * This component renders 'Time Window' button with its Popup
 */

import PropTypes from "prop-types";
import { Fragment, useState } from "react";

const QueryTimeWindowConfiguration = ({
  queryTimeWindow,
  setQueryTimeWindow,
}) => {
  // State to determine the visibility of the popup when clicking the button
  const [showTimeWindow, setShowTimeWindow] = useState(false);
  // State to set the inputted time in the popup
  const [timeInput, setTimeInput] = useState("1");
  /**
   * State to set the selected time unit in the popup
   * Available unit: Seconds, Minutes, Hours
   **/
  const [timeUnit, setTimeUnit] = useState("m");

  const handleTimeWindowSubmit = (e) => {
    e.preventDefault();
    const value = parseInt(timeInput);
    if (value && value > 0) {
      setQueryTimeWindow(`${value}${timeUnit}`);
      setShowTimeWindow(false);
      setTimeInput("");
    }
  };

  return (
    <Fragment>
      <div id="time-window-config-button" className="flex items-center">
        <button
          onClick={() => setShowTimeWindow(true)}
          className="transition-color rounded-2xl border-2 border-transparent bg-transparent border-2 px-4 py-2 text-lg font-semibold text-slate-500 underline duration-100 hover:brightness-50 w-full dark:text-slate-300"
        >
          Time Window: {queryTimeWindow}
        </button>

        <div
          id="time-window-help-info"
          className="group relative ml-2 cursor-help rounded-full bg-slate-300 px-2 py-0.5 text-sm font-bold text-slate-600"
        >
          ?
          <div className="pointer-events-none absolute left-1/2 top-0 z-[99999] mt-[-120px] w-64 -translate-x-1/2 rounded-lg bg-slate-200/95 p-4 text-xs text-slate-900/90 opacity-0 shadow-xl transition-opacity duration-300 group-hover:opacity-100">
            <p>Select a time window that best suits your monitoring needs:</p>
            <ul className="mt-2 list-disc pl-4">
              <li>Short (e.g., 30s, 1m): More responsive, real-time metrics</li>
              <li>Medium (e.g., 5m, 10m): Balanced view of pod behavior</li>
              <li>
                Long (e.g., 30m, 1h): Statistical average of pod performance
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Time Window Popup */}
      <div
        id="time-window-popup"
        className={`fixed inset-0 z-50 flex items-center justify-center text-center bg-black/50 transition-opacity duration-300 ${
          showTimeWindow
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div
          id="time-window-popup-content"
          className="flex size-1/6 flex-col items-center justify-center rounded-lg bg-slate-200 p-6 h-[250px] text-slate-700"
        >
          <p>Select a Monitoring Time Window</p>
          <br />
          <form
            onSubmit={handleTimeWindowSubmit}
            className="flex flex-col gap-4"
          >
            <div id="time-window-input" className="flex w-full gap-2">
              <input
                type="number"
                min={1}
                value={timeInput}
                onChange={(e) => setTimeInput(e.target.value)}
                className="w-20 rounded-md border border-slate-300 bg-slate-300 p-2 text-slate-800 hover:brightness-105 focus:brightness-90 transition duration-300"
                placeholder="Value"
              />
              <select
                value={timeUnit}
                onChange={(e) => setTimeUnit(e.target.value)}
                className="rounded-md border border-slate-300 bg-slate-300 p-3 text-slate-800 w-28 hover:brightness-105 focus:brightness-90 transition duration-300"
              >
                <option value="s">
                  {parseInt(timeInput) <= 1 ? "Second" : "Seconds"}
                </option>
                <option value="m">
                  {parseInt(timeInput) <= 1 ? "Minute" : "Minutes"}
                </option>
                <option value="h">
                  {parseInt(timeInput) <= 1 ? "Hour" : "Hours"}
                </option>
              </select>
            </div>
            <div id="time-window-confirmation-buttons" className="flex gap-2 justify-evenly w-full">
              <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 text-slate-100 hover:brightness-110 active:brightness-90 transition duration-300 w-full"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={() => setShowTimeWindow(false)}
                className="rounded bg-slate-600 px-4 py-2 text-slate-100 hover:brightness-110 active:brightness-90 transition duration-300 w-full"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

QueryTimeWindowConfiguration.propTypes = {
  queryTimeWindow: PropTypes.string.isRequired,
  setQueryTimeWindow: PropTypes.func.isRequired,
};

export default QueryTimeWindowConfiguration;
