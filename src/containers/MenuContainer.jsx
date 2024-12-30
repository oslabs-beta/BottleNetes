/**
 * This component renders the menu sidebar
 */

import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import userStore from '../stores/userStore.ts';

const MenuContainer = ({
  refreshFrequency,
  setRefreshFrequency,
  showRefreshPopup,
  setShowRefreshPopup,
  refreshInput,
  setRefreshInput,
  manualRefreshCount,
  setManualRefreshCount,
  backendUrl,
}) => {
  const navigate = useNavigate();
  const signOut = userStore((state) => state.signOut);

  const handleRefreshSubmit = (e) => {
    e.preventDefault();
    const value = parseInt(refreshInput);
    if (value && value > 0) {
      setRefreshFrequency(value * 1000);
      setShowRefreshPopup(false);
      setRefreshInput("");
    }
  };

  const handleSignOut = async (e) => {
    console.log(`Now sending request to '${backendUrl}user/signout'...`);
    e.preventDefault();

    try {
      const response = await fetch(backendUrl + "user/signout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Unable to send request");
      } else {
        const data = await response.json();
        console.log(data);
        signOut();
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      alert("Unable to sign out");
    }
  };

  return (
    <div
      id="menu-bar"
      className="flex h-full w-full flex-col justify-between overflow-y-auto p-4 text-slate-200"
    >
      <div className="space-y-4">
        <div className="pb-4">
          <h3 className="mb-2 text-lg font-semibold">Refresh Controls</h3>

          {/* Manual Refresh */}
          <div id="manual-refresh-button" className="mb-4">
            <button
              onClick={() => setManualRefreshCount(manualRefreshCount + 1)}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm transition duration-300 hover:brightness-110 active:brightness-90"
            >
              Force Refresh
            </button>
          </div>

          {/* Refresh Frequency Control */}
          <div id="refresh-frequency-display">
            <div
              id="refresh-frequency-config-button"
              onClick={() => setShowRefreshPopup(true)}
              className="flex cursor-pointer items-center justify-between rounded-lg bg-slate-800 px-4 py-2 transition duration-300 hover:brightness-110 active:brightness-90"
            >
              <span className="text-sm">Set Refresh Frequency:</span>
              <span className="text-blue-400">{refreshFrequency / 1000}s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Refresh Frequency Popup */}
      <div
        id="refresh-frequency-config-popup"
        className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-200 ${showRefreshPopup ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <div className="absolute top-40 rounded-lg bg-slate-200 p-6 shadow-xl">
          <form onSubmit={handleRefreshSubmit} className="flex flex-col gap-4">
            <input
              type="number"
              min="1"
              value={refreshInput}
              onChange={(e) => setRefreshInput(e.target.value)}
              className="rounded-lg border bg-slate-300 p-2 text-slate-800"
              placeholder="Enter seconds"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded bg-blue-500 px-4 py-2 text-white transition duration-300 hover:brightness-110 active:brightness-90"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => setShowRefreshPopup(false)}
                className="rounded bg-gray-500 px-4 py-2 text-white transition duration-300 hover:brightness-110 active:brightness-90"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <button
        id="signout-button"
        className="mb-28 rounded-lg border-2 border-slate-600 bg-slate-700 py-2 text-slate-300 transition duration-300 hover:brightness-110 active:brightness-90"
        onClick={handleSignOut}
      >
        Sign Out
      </button>
    </div>
  );
};

MenuContainer.propTypes = {
  refreshFrequency: PropTypes.number.isRequired,
  setRefreshFrequency: PropTypes.func.isRequired,
  showRefreshPopup: PropTypes.bool.isRequired,
  setShowRefreshPopup: PropTypes.func.isRequired,
  refreshInput: PropTypes.string.isRequired,
  setRefreshInput: PropTypes.func.isRequired,
  manualRefreshCount: PropTypes.number.isRequired,
  setManualRefreshCount: PropTypes.func.isRequired,
  backendUrl: PropTypes.string,
};

export default MenuContainer;
