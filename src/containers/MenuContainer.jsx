import PropTypes from "prop-types";

const MenuContainer = ({
  refreshFrequency,
  setRefreshFrequency,
  showRefreshPopup,
  setShowRefreshPopup,
  refreshInput,
  setRefreshInput,
  manualRefreshCount,
  setManualRefreshCount,
}) => {
  const handleRefreshSubmit = (e) => {
    e.preventDefault();
    const value = parseInt(refreshInput);
    if (value && value > 0) {
      setRefreshFrequency(value * 1000);
      setShowRefreshPopup(false);
      setRefreshInput("");
    }
  };

  return (
    <div className="h-full w-full p-4 text-white">
      <div className="space-y-4">
        <div className="pb-4">
          <h3 className="mb-2 text-lg font-semibold">Refresh Controls</h3>

          {/* Manual Refresh */}
          <div className="mb-4">
            <button
              onClick={() => setManualRefreshCount(manualRefreshCount + 1)}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm hover:bg-blue-700"
            >
              Manual Refresh
            </button>
          </div>

          {/* Refresh Frequency Control */}
          <div>
            <div
              onClick={() => setShowRefreshPopup(true)}
              className="flex cursor-pointer items-center justify-between rounded-lg bg-slate-800 px-4 py-2 hover:bg-slate-700"
            >
              <span className="text-sm">Refresh Rate:</span>
              <span className="text-blue-400">{refreshFrequency / 1000}s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Refresh Frequency Popup */}
      {showRefreshPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative rounded-lg bg-white p-6 shadow-xl">
            <form
              onSubmit={handleRefreshSubmit}
              className="flex flex-col gap-4"
            >
              <input
                type="number"
                min="1"
                value={refreshInput}
                onChange={(e) => setRefreshInput(e.target.value)}
                className="rounded border p-2 text-black"
                placeholder="Enter seconds"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowRefreshPopup(false)}
                  className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
};

export default MenuContainer;
