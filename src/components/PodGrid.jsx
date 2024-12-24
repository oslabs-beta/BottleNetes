import PropTypes from "prop-types";
import Pod from "./Pod";
import PodRestart from "./PodRestart";
import PodLogDisplay from "./PodLogDisplay";
import QueryTimeWindowConfiguration from "./QueryTimeWindowConfiguration";
import PodGridMetricSelection from "./PodGridMetricSelection";

const PodGrid = ({
  setDefaultView,
  clickedPod,
  setClickedPod,
  selectedMetric,
  setSelectedMetric,
  podRestartCount,
  setPodRestartCount,
  podStatuses,
  cpuUsageOneValue,
  memoryUsageOneValue,
  latencyAppRequestOneValue,
  queryTimeWindow,
  setQueryTimeWindow,
  backendUrl,
}) => {
  if (!podStatuses.allPodsStatus) {
    return <div>loading...</div>;
  }

  const podList = podStatuses?.allPodsStatus?.map((pod) => {
    const podObj = {
      podName: pod.podName,
      namespace: pod.namespace,
      status: pod.status,
      readiness: pod.readiness,
      containers: pod.containers,
      service: pod.service,
      selectedMetric,
    };

    const cpuData = cpuUsageOneValue?.resourceUsageOneValue?.find(
      (obj) => obj.name === pod.podName,
    );
    podObj.cpuDataRelative = cpuData?.usageRelativeToRequest;
    podObj.cpuDataAbsolute = cpuData?.usageAbsolute;

    const memoryData = memoryUsageOneValue?.resourceUsageOneValue?.find(
      (obj) => obj.name === pod.podName,
    );
    podObj.memoryDataRelative = memoryData?.usageRelativeToRequest;
    podObj.memoryDataAbsolute = memoryData?.usageAbsolute;

    const latencyData =
      latencyAppRequestOneValue?.latencyAppRequestOneValue?.find(
        (obj) => obj.name === pod.podName,
      );
    podObj.latencyData = latencyData?.avgCombinedLatency;

    return podObj;
  });

  // console.log("PODLIST from grid", podList);

  const buttonArray = [];
  for (const podObj of podList) {
    buttonArray.push(
      <Pod
        podInfo={podObj}
        key={podObj.podName}
        type="button"
        selectedMetric={selectedMetric}
        isClicked={
          clickedPod.podName === podObj.podName &&
          clickedPod.namespace === podObj.namespace &&
          clickedPod.containers === podObj.containers
        }
        onClick={() => {
          setClickedPod({
            podName: podObj.podName,
            namespace: podObj.namespace,
            containers: podObj.containers,
          });
          setDefaultView(false);
        }}
      />,
    );
  }

  // const resetView = () => {
  //   setDefaultView(true);
  //   setClickedPod({ podName: "", namespace: "", containers: [] });
  //   setSelectedMetric("cpu");
  // };

  const gridStyle =
    "grid gap-[2px] mr-2 mt-1 grid-cols-5 overflow-visible md:grid-cols-7 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 3xl:grid-cols-9 relative z-20";
  return (
    <div className="flex h-full flex-col overflow-visible">
      <div id="control-buttons-row" className="mb-4 flex space-x-2 p-4">
        <PodRestart
          clickedPod={clickedPod}
          setClickedPod={setClickedPod}
          podRestartCount={podRestartCount}
          setPodRestartCount={setPodRestartCount}
          backendUrl={backendUrl}
        />

        <PodLogDisplay clickedPod={clickedPod} backendUrl={backendUrl} />

        {/* To be separated into a new component */}
        <button
          className="border-1 rounded-lg border-slate-100 bg-gradient-to-r from-slate-200 to-slate-100 px-3 py-2 text-sm font-medium text-slate-500 transition duration-200 hover:brightness-90"
          disabled
        >
          Modify Replicas
        </button>

        {/* To be separated into a new component */}
        <button
          className="border-1 rounded-lg border-slate-100 bg-gradient-to-r from-slate-200 to-slate-100 px-3 py-2 text-sm font-medium text-slate-500 transition duration-200 hover:brightness-90"
          disabled
        >
          Adjust Resources/Limits
        </button>
      </div>

      {/* Bottom Container */}
      <div className="flex flex-1">
        {/* Left Column - Selection Buttons */}
        <div className="flex w-1/4 min-w-[207px] max-w-[250px] flex-col justify-start gap-4 p-4">
          <QueryTimeWindowConfiguration
            queryTimeWindow={queryTimeWindow}
            setQueryTimeWindow={setQueryTimeWindow}
          />

          <PodGridMetricSelection
            selectedMetric={selectedMetric}
            setSelectedMetric={setSelectedMetric}
          />

          <button
            id="reset-button"
            onClick={() => {
              setDefaultView(true);
              setClickedPod({ podName: "", namespace: "", containers: [] });
              setSelectedMetric("cpu");
              setQueryTimeWindow("1m");
            }}
            className={`rounded-2xl border-4 border-blue-600 bg-slate-100 px-2 py-4 text-lg font-semibold text-blue-600 transition duration-200 hover:bg-blue-600 hover:text-slate-100`}
          >
            Reset
          </button>
        </div>

        {/* Right Column - Pod Heat Map */}
        <div
          id="pod-heat-map"
          className="relative z-10 w-3/4 overflow-visible p-4"
        >
          <div id="pod-grid" className={gridStyle}>
            {buttonArray}
          </div>
        </div>
      </div>
    </div>
  );
};

PodGrid.propTypes = {
  defaultView: PropTypes.bool.isRequired,
  setDefaultView: PropTypes.func.isRequired,
  clickedPod: PropTypes.shape({
    podName: PropTypes.string,
    namespace: PropTypes.string,
    containers: PropTypes.array,
  }).isRequired,
  setClickedPod: PropTypes.func.isRequired,
  selectedMetric: PropTypes.string.isRequired,
  setSelectedMetric: PropTypes.func.isRequired,
  podRestartCount: PropTypes.number.isRequired,
  setPodRestartCount: PropTypes.func.isRequired,
  podStatuses: PropTypes.shape({
    allPodsStatus: PropTypes.array,
  }),
  requestLimits: PropTypes.object,
  cpuUsageOneValue: PropTypes.object,
  memoryUsageOneValue: PropTypes.object,
  latencyAppRequestOneValue: PropTypes.object,
  queryTimeWindow: PropTypes.string.isRequired,
  setQueryTimeWindow: PropTypes.func.isRequired,
  backendUrl: PropTypes.string.isRequired,
};

export default PodGrid;
