import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Pod from "./Pod";

// const PodGrid = (props) => {
//   const {
//     defaultView,
//     setDefaultView,
//     setClickedPod,
//     podStatuses,
//     requestLimits,
//     cpuUsageOneValue,
//     memoryUsageOneValue,
//     latencyAppRequestOneValue,
//   } = props;

const PodGrid = ({
  defaultView,
  setDefaultView,
  setClickedPod,
  podStatuses,
  requestLimits,
  cpuUsageOneValue,
  memoryUsageOneValue,
  latencyAppRequestOneValue,
}) => {
  // As buttons are clicked, displayedData state will be updated to hold the correct information
  // const [displayedData, setDisplayedData] = useState([]);

  const [selectedMetric, setSelectedMetric] = useState("cpu");

  // Loop over pod statuses and populate podList with pod names
  // const podList = [];
  // console.log(podStatuses);
  // for (const pod of podStatuses.allPodsStatus) {
  //   const podObj = {
  //     podName: pod.podName,
  //   };
  //   podList.push({ podName: pod.podName, color: "" });

  // }
  // // console.log("PodList:", podList)

  // podList.forEach((pod) => {
  //   // Search for the same pod by pod name in resourceUsageOneValue array of objects
  //   const cpuData = cpuUsageOneValue.resourceUsageOneValue.find(
  //     (item) => item.name === pod.podName,
  //   );
  //   if (cpuData) {
  //     pod.cpuUsageOneValue = cpuData.usageRelativeToRequest;
  //   }
  //   const memoryData = memoryUsageOneValue.resourceUsageOneValue.find(
  //     (item) => item.name === pod.podName,
  //   );
  //   if (memoryData) {
  //     pod.memoryUsageOneValue = memoryData.usageRelativeToRequest;
  //   }
  //   // const latencyData = latencyAppRequestOneValue.resourceUsageOneValue.find(
  //   //   (item) => item.name === pod.podName,
  //   // );
  //   // if (latencyData) {
  //   //   pod.latencyAppRequestOneValue = latencyData.usageRelativeToRequest;
  //   // }
  // });

  if (!podStatuses.allPodsStatus) {
    return <div>loading...</div>;
  }

  // useEffect(() => {
  const podList = podStatuses?.allPodsStatus?.map((pod) => {
    const podObj = {
      podName: pod.podName,
      status: pod.status,
      readiness: pod.readiness,
      containers: pod.containers,
      service: pod.service,
      selectedMetric,
    };

    const cpuData = cpuUsageOneValue?.resourceUsageOneValue?.find(
      (obj) => obj.name === pod.podName,
    );
    podObj.cpuData = cpuData?.usageRelativeToRequest;
    // podObj.value = cpuData?.usageRelativeToRequest;

    const memoryData = memoryUsageOneValue?.resourceUsageOneValue?.find(
      (obj) => obj.name === pod.podName,
    );
    podObj.memoryData = memoryData?.usageRelativeToRequest;
    // podObj.value = memoryData?.usageRelativeToRequest;

    const latencyData =
      latencyAppRequestOneValue?.latencyAppRequestOneValue?.find(
        (obj) => obj.name === pod.podName,
      );
    podObj.latencyData = latencyData?.avgCombinedLatency;
    // podObj.value = latencyData?.avgCombinedLatency;

    return podObj;
  });
  // }, [selectedMetric, podStatuses])

  // console.log(podList);

  // Update the color factor everytime the selectedMetric changes
  // useEffect(() => {
  //   const getColor = (value) => {
  //     // CSS linear gradient ranging from green (0) to red (1)
  //     return `linear-gradient(90deg, green ${value * 100}%, yellow ${value * 100}%, orange ${value * 100}%, red ${value * 100}%)`;
  //   };

  //   switch (selectedMetric) {
  //     case "cpu":
  //       for (let pod of podList) {
  //         pod.color = getColor(pod.cpuData / 100);
  //       }
  //       break;
  //     case "memory":
  //       for (let pod of podList) {
  //         pod.color = getColor(pod.memoryData / 100);
  //       }
  //       break;
  //     case "latency":
  //       for (let pod of podList) {
  //         pod.color = getColor(pod.latencyData / 100);
  //       }
  //       break;
  //     default:
  //       for (let pod of podList) {
  //         pod.color = getColor(pod.cpuData / 100);
  //       }
  //       break;
  //   }
  // }, [selectedMetric]);

  // return (
  //   <div id="pod-grid">
  //     {/* Render the grid of pods as a list */}
  //     <ul id="pod-list">
  //       {podList.map((pod, index) => (
  //         <li key={index} >
  //           <Pod
  //             pod={pod}
  //             type="button"
  //             selectedMetric={selectedMetric}
  //             onClick={() => {
  //               setClickedPod(pod.podName);
  //               setDefaultView(false);
  //             }}/>
  //         </li>
  //       ))}
  //     </ul>
  //     {/* Render the change metric buttons */}
  //     <div>
  //       <button onClick={() => setSelectedMetric("cpu")}>
  //         {"CPU Usage (%)"}
  //       </button>
  //       <button onClick={() => setSelectedMetric("memory")}>
  //         {"RAM Usage (%)"}
  //       </button>
  //       <button onClick={() => setSelectedMetric("latency")}>
  //         {"Latency(ms)"}
  //       </button>
  //     </div>
  //   </div>
  // );

  // const color = (value, minVal = 0, maxVal) => {
  //   const normalizedValue = (value - minVal) / (maxVal - minVal);
  //   const r = 238 - Math.floor(normalizedValue * 204);

  //   return `rgb(${r}, 197, 94, 1)`;
  // };
  console.log("PODLIST from grid", podList);
  
  const buttonArray = [];
  for (let i = 1; i < podList.length; i++) {
    // randomStatus();
    const podObj = podList[i];

    buttonArray.push(
      <Pod
        key={i}
        pod={podObj}
        type="button"
        selectedMetric={selectedMetric}
        onClick={() => {
          setClickedPod(podObj.podName);
          setDefaultView(false);
      }}/>
    )
    // if (podObj.readiness == "true") {
    //   buttonArray.push(
    //     <Pod
    //       pod={podObj}
    //       type="button"
    //       selectedMetric={selectedMetric}
    //       onClick={() => {
    //         setClickedPod(podObj.podName);
    //         setDefaultView(false);
    //     }}/>
    //     // <button
    //     //   key={i}
    //     //   className="m-0.5 aspect-square rounded-xl border-blue-600 brightness-90 transition hover:border-[5px] hover:filter"
    //     //   style={{
    //     //     backgroundColor: color(podObj.cpuData, 0, 100), // to be updated!!
    //     //   }}
    //     // >
    //     // </button>,
    //   );
    // } else if (podObj.readiness == "false") {
    //   buttonArray.push(
    //     <button
    //       key={i}
    //       className="m-0.5 aspect-square rounded-xl border-blue-600 bg-[#db6451] transition hover:border-[5px] hover:filter"
    //     ></button>,
    //   );
    // } else {
    //   buttonArray.push(
    //     <button
    //       key={i}
    //       className="m-0.5 aspect-square rounded-xl border-4 border-slate-600 brightness-90 transition hover:border-[5px] hover:border-blue-500 hover:filter"
    //     ></button>,
    //   );
    // }
  }

  return (
    <div className="align-space-between flex h-full overflow-scroll">
      <div className="w-3/4 overflow-auto p-4">
        <div
          id="test-grid"
          className="grid h-screen gap-0 grid-cols-5 overflow-scroll md:grid-cols-7 lg:grid-cols-4 xl:grid-cols-5 xl-2xl:grid-cols-7 3xl:grid-cols-9"
        >
          {buttonArray}
        </div>
      </div>
      <div className="flex w-1/4 min-w-[203px] max-w-[250px] flex-col justify-start gap-4 p-4">
        <button
          onClick={() => setSelectedMetric("cpu")}
          className="rounded-2xl bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] px-4 py-2 py-5 text-lg font-semibold text-slate-200 hover:brightness-90 hover:filter"
        >
          CPU Usage (%)
        </button>
        <button
          onClick={() => setSelectedMetric("memory")}
          className="rounded-2xl bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] px-4 py-2 py-5 text-lg font-semibold text-slate-200 hover:brightness-90 hover:filter"
        >
          Mem. Usage (%)
        </button>
        <button
          onClick={() => setSelectedMetric("latency")}
          className="rounded-2xl bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] px-4 py-2 py-5 text-lg font-semibold text-slate-200 hover:brightness-90 hover:filter"
        >
          Latency (ms)
        </button>
      </div>
    </div>
  );
};

PodGrid.propTypes = {
  setClickedPod: PropTypes.func,
  metric: PropTypes.string,
  setMetric: PropTypes.func,
  podData: PropTypes.array,
  setPodData: PropTypes.func,
};

PodGrid.propTypes = {
  defaultView: PropTypes.bool.isRequired,
  setDefaultView: PropTypes.func.isRequired,
  setClickedPod: PropTypes.func.isRequired,
  podStatuses: PropTypes.shape({
    allPodsStatus: PropTypes.array,
  }),
  requestLimits: PropTypes.object,
  cpuUsageOneValue: PropTypes.object,
  memoryUsageOneValue: PropTypes.object,
  latencyAppRequestOneValue: PropTypes.object,
};

export default PodGrid;
