// PodNameDisplay.jsx
import PropTypes from "prop-types";
import "./Overview.css";

const PodNameDisplay = ({ clickedPod }) => {
  if (!clickedPod) return null;

  return (
    <div className="overview-container fade-in">
      <div className="overview-card overview-pods">
        <h2 className="dynamic-text">Selected Pod</h2>
        <p className="overview-value dynamic-text">{clickedPod}</p>
      </div>
    </div>
  );
};

PodNameDisplay.propTypes = {
  clickedPod: PropTypes.string,
};

export default PodNameDisplay;
