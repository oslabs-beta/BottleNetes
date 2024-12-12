import PropTypes from "prop-types";
import { useState } from "react";

const Pod = ({
  pod,
  // onClick
}) => {
  // const { metric, pod, fetchInfo, setClickedPod } = props;
  const [isShowing, setIsShowing] = useState(false);

  // function to normalize metric value and return rgb color

  // const getColor = (value, readiness, minVal = 0, maxVal = 100) => {
  //   const numValue = parseInt(value);
  //   if (!numValue) return "red";
  //   // if (!active) return "transparent"
  //   if (readiness == "false") return "red";

  //   const normalizedValue = (numValue - minVal) / (maxVal - minVal);
  //   const r = Math.floor(normalizedValue * 255);

  //   return `rgb(${r}, 255, 0)`;
  // };

    return (
      <div
        id='pod'
        className=""
        onMouseEnter={() => setIsShowing(true)}
        onMouseLeave={() => setIsShowing(false)}
        // onClick={onClick}
        // style={{
        //   backgroundColor: getColor(pod.value, pod.readiness)}}
      >
                {isShowing && ( // Pop up appear on hover for every pod
              <div id="pod-info">
                  <p>Pod Name: {pod.podName}</p>
                  <p>Pod Status: {pod.status}</p>
                  <p>Container in Pod: {pod.containers}</p>
                  <p>Service in Pod: {pod.service}</p>
                  <p>Active/Inactive: {pod.readiness}</p>
              </div>
          )}

      </div>

    );
//   return (
//     <div>
//       <p>Hi</p>
//     </div>
//   );
// };

Pod.propTypes = {
  metric: PropTypes.string,
  pod: PropTypes.object,
  fetchInfo: PropTypes.func,
  setClickedPod: PropTypes.func,
};

export default Pod;
