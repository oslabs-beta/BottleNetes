// PodNameDisplay.jsx
import PropTypes from "prop-types";
import "../Overview.css";

const PodNameDisplay = ({ clickedPod }) => {

  return (
    <div
      className="overview-container fade-in"
    >
      <div
        className="overview-card overview-pods slow-spin"
        style={{
          background: "linear-gradient(135deg, #0f172a, #1e40af)",
          width: "100%",
          color: "#e2e8f0",
          borderRadius: 0,
          boxShadow: "none", 
        }}
      >
        <h2 className="dynamic-text text-slate-100" style={{ color: "#e2e8f0" }}>
          {clickedPod ? "Selected Pod" : "No Pod Selected"}
        </h2>
        <p className="overview-value dynamic-text text-slate-100" style={{ color: "#e2e8f0" }}>
          {clickedPod ? clickedPod : "Displaying Node Averages"}
        </p>
      </div>
    </div>
  );
};

PodNameDisplay.propTypes = {
  clickedPod: PropTypes.string,
};

export default PodNameDisplay;
