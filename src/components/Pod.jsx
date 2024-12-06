import PropTypes from "prop-types";
import { useState } from "react";

const Pod = (props) => {
  const { metric, pod, fetchInfo } = props;
  const [isShowing, setIsShowing] = useState(false);

  // function to normalize metric value and return rgb color
  const color = (value /*value[1]*/, minVal = 0, maxVal /*value[0]*/) => {
    const numValue = parseInt(value);
    if (!numValue) return "red";
    if (!active) return "transparent"

    const normalizedValue = (numValue - minVal) / (maxVal - minVal);
    const r = Math.floor(normalizedValue * 255);

    return `rgb(${r}, 255, 0)`;
  };

  return (
    <div
      id='pod'
      className=""
      onMouseEnter={() => setIsShowing(true)}
      onMouseLeave={() => setIsShowing(false)}
      onClick={() => {
        fetchInfo(metric, "1h", "pod");
        setClickedPod(pod.metric.pod)
      }}
    >
        {isShowing && ( // Pop up appear on hover for every pod 
            <div id="pod-info">
                <p>Pod Name: {pod.metric.pod}</p>
                <p>Microservices: </p>
                <p>Container: </p>
                <p>Active/Inactive: </p>
                <p>Error Rate: </p>
            </div>
        )}
    </div>
    
  );
};

Pod.propTypes = {
  metric: PropTypes.string,
  pod: PropTypes.object,
  fetchInfo: PropTypes.func
};

export default Pod;
