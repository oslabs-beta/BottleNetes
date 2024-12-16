// PodNameDisplay.jsx
import PropTypes from "prop-types";
import "../Overview.css";

const PodNameDisplay = ({ clickedPod }) => {
  if (!clickedPod) return null;

  return (
    <div
      className="overview-container fade-in"
      style={{ backgroundColor: "#1e293b" }}
    >
      <div
        className="overview-card overview-pods slow-spin"
        style={{
          background: "linear-gradient(135deg, #0f172a, #1e40af)",
          width: "100%",
          color: "#ffffff",
        }}
      >
        <h2 className="dynamic-text" style={{ color: "#ffffff" }}>
          Selected Pod
        </h2>
        <p className="overview-value dynamic-text" style={{ color: "#ffffff" }}>
          {clickedPod}
        </p>
      </div>
    </div>
  );
};

PodNameDisplay.propTypes = {
  clickedPod: PropTypes.string,
};

export default PodNameDisplay;
