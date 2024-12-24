import PropTypes from "prop-types";
import { useState } from "react";

const QueryTimeWindowConfiguration = ({
  queryTimeWindow,
  setQueryTimeWindow,
}) => {
  const [showTimeWindow, setShowTimeWindow] = useState(false);
  const [timeInput, setTimeInput] = useState("");
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
    <div id="query-time-window-configuration" className="flex flex-col gap-4">
      <div
        id="time-window-config-button"
        className="relative mb-4 flex items-center"
      >
        <button
          onClick={() => setShowTimeWindow(true)}
          className="transition-color rounded-2xl border-slate-100 bg-gradient-to-r from-slate-200 to-slate-100 px-4 py-2 text-lg font-semibold text-slate-500 duration-300 hover:brightness-90"
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
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
          showTimeWindow
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div
          id="time-window-popup-content"
          className="rounded-lg bg-slate-200 p-6"
        >
          <form
            onSubmit={handleTimeWindowSubmit}
            className="flex flex-col gap-4"
          >
            <div id="time-window-input" className="flex gap-2">
              <input
                type="number"
                min="1"
                value={timeInput}
                onChange={(e) => setTimeInput(e.target.value)}
                className="w-20 rounded border bg-slate-300 p-2 text-slate-800"
                placeholder="Value"
              />
              <select
                value={timeUnit}
                onChange={(e) => setTimeUnit(e.target.value)}
                className="rounded border bg-slate-300 p-2 text-slate-800"
              >
                <option value="s">Seconds</option>
                <option value="m">Minutes</option>
                <option value="h">Hours</option>
              </select>
            </div>
            <div id="time-window-confirmation-buttons" className="flex gap-2">
              <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 text-slate-100 hover:bg-blue-700"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={() => setShowTimeWindow(false)}
                className="rounded bg-slate-600 px-4 py-2 text-slate-100 hover:bg-slate-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

QueryTimeWindowConfiguration.propTypes = {
  queryTimeWindow: PropTypes.string.isRequired,
  setQueryTimeWindow: PropTypes.func.isRequired,
};

export default QueryTimeWindowConfiguration;
