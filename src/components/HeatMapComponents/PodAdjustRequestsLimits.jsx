/**
 * This component renders the 'Adjust Resources/Limits' with its Popup
 */

import PropTypes from "prop-types";
import { useState } from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";

const PodAdjustRequestsLimits = ({ clickedPod, backendUrl }) => {
  const [showRequestsLimitsPopup, setShowRequestsLimitsPopup] = useState(false);
  const [newRequests, setNewRequests] = useState({
    memory: "",
    cpu: "",
  });
  const [newLimits, setNewLimits] = useState({
    memory: "",
    cpu: "",
  });
  const [selectedOption, setSelectedOption] = useState("");

  const handleRequestsLimits = async () => {
    if (!clickedPod.podName || !clickedPod.namespace) {
      alert("Please select a pod first");
      return;
    }
    setShowRequestsLimitsPopup(true);
  };

  const proceedAdjustRequestsLimits = async () => {
    if (selectedOption === "Please select a config" || selectedOption === "") {
      alert("Please select a resource configuration first");
      return;
    }
    console.log(`Sending request to '${backendUrl}k8s/requestsLimits'...`);

    try {
      const response = await fetch(backendUrl + "k8s/requestsLimits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          podName: clickedPod.podName,
          namespace: clickedPod.namespace,
          containers: clickedPod.containers,
          newRequests,
          newLimits,
        }),
      });

      const data = await response.json();

      if (data.status !== "success") {
        console.error(`Could not retrieve data: ${data}`);
        alert("Unable to retrieve data...");
      }

      console.log(data.data);
      alert(`${data.message}`);
    } catch (error) {
      console.error(`Failed to send request: ${error}`);
      alert(`Failed to send request`);
    } finally {
      setShowRequestsLimitsPopup(false);
    }
  };

  const cancelRequestsLimits = () => {
    setShowRequestsLimitsPopup(false);
    // reset to default when closed
    setSelectedOption("Please select a config");
    setNewRequests({ memory: "", cpu: "" });
    setNewLimits({ memory: "", cpu: "" });
  };

  const preConfigOptions = [
    {
      configName: "Please select a config",
      requests: {
        memory: "",
        cpu: "",
      },
      limits: {
        memory: "",
        cpu: "",
      },
    },
    {
      configName: "Minimal",
      requests: {
        memory: "128Mi",
        cpu: "100m",
      },
      limits: {
        memory: "256Mi",
        cpu: "200m",
      },
    },

    {
      configName: "Medium",
      requests: {
        memory: "512Mi",
        cpu: "500m",
      },
      limits: {
        memory: "1Gi",
        cpu: "1",
      },
    },

    {
      configName: "Memory-Intensive",
      requests: {
        memory: "4Gi",
        cpu: "1",
      },
      limits: {
        memory: "8Gi",
        cpu: "2",
      },
    },

    {
      configName: "Compute-Intensive",
      requests: {
        memory: "1Gi",
        cpu: "2",
      },
      limits: {
        memory: "2Gi",
        cpu: "4",
      },
    },
    {
      configName: "Custom",
      requests: {
        memory: "",
        cpu: "",
      },
      limits: {
        memory: "",
        cpu: "",
      },
    },
  ];

  const handleSelectedValue = (event) => {
    const selectedPreConfigOption = preConfigOptions.find(
      (option) => option.configName === event.target.value,
    );
    setSelectedOption(event.target.value);
    setNewRequests((prev) => ({
      ...prev,
      memory: selectedPreConfigOption?.requests.memory,
      cpu: selectedPreConfigOption?.requests.cpu,
    }));
    setNewLimits((prev) => ({
      ...prev,
      memory: selectedPreConfigOption?.limits.memory,
      cpu: selectedPreConfigOption?.limits.cpu,
    }));
  };
  // handle input change for custom option
  const handleInputChange = (type, field, value) => {
    if (selectedOption === "Custom") {
      if (type === "requests") {
        setNewRequests((prev) => ({ ...prev, [field]: value }));
      } else {
        setNewLimits((prev) => ({ ...prev, [field]: value }));
      }
    }
  };

  return (
    <div id="pod-adjust-requests-limits">
      <button
        className="w-full rounded-lg border-2 border-slate-200 bg-gradient-to-r from-slate-200 to-slate-100 px-3 py-2 text-sm font-medium text-slate-500 transition duration-200 hover:brightness-90"
        onClick={handleRequestsLimits}
      >
        Adjust Requests/Limits
      </button>

      {/* Requests Limits Popup */}
      <div
        id="requests-limit-popup-display"
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition duration-300 ${showRequestsLimitsPopup ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <div
          id="requests-limits-popup"
          className="w-1/4 rounded-lg bg-slate-200 p-6 text-center text-slate-800"
        >
          <h2>Select a desired resources configuration for your deployment</h2>
          <br />
          <div
            id="replicas-popup-info-display"
            className="border-1 rounded-xl border-slate-300 bg-slate-300 p-4 text-left"
          >
            <p>
              Selected Pod: <strong>{clickedPod.podName}</strong>
            </p>
            <p>
              Namespace: <strong>{clickedPod.namespace}</strong>
            </p>
            <p>
              Deployment: <strong>{clickedPod.deploymentName}</strong>
            </p>
          </div>
          <br />
          <div
            id="requests-limits-specs-display"
            className="relative flex items-center justify-evenly rounded-xl border-2 border-slate-300 bg-slate-300"
          >
            <Tooltip placement="left" title={<ToolTipDescription />} arrow>
              <div
                id="resources-config-help-info"
                className="group absolute left-0 top-2 ml-2 cursor-help rounded-full bg-slate-400/40 px-2 py-0.5 text-sm font-bold text-slate-600"
              >
                ?
              </div>
            </Tooltip>

            <FormControl
              variant="standard"
              sx={{
                minWidth: "25%",
                width: "40%",
                textAlign: "left",
              }}
            >
              <InputLabel id="requests-limits-options-label">
                Resources Config.
              </InputLabel>
              <Select
                labelId="requests-limits-options-label"
                id="requests-limits-options"
                value={selectedOption}
                label="Resources Config."
                onChange={handleSelectedValue}
              >
                {preConfigOptions.map((option, index) => {
                  return (
                    <MenuItem key={index} value={option.configName}>
                      {option.configName}
                    </MenuItem>
                  );
                })}
              </Select>
              <FormHelperText>Preset Configurations</FormHelperText>
            </FormControl>
            <div
              id="memory"
              className="my-2 w-1/4 rounded-xl border-2 border-slate-400/30"
            >
              <p className="leading-10">Memory</p>
              <TextField
                disabled={selectedOption !== "Custom"} // disable input if not custom
                id="memory-requests"
                label="Requests"
                value={newRequests.memory}
                onChange={
                  (e) => handleInputChange("requests", "memory", e.target.value) // handle input change for custom option
                }
                sx={{
                  margin: 1,
                  "& .MuiInputBase-input": {
                    bgcolor: selectedOption === "Custom" ? "white" : "inherit",
                  }, // change input background color if custom option is selected
                }}
              />
              <TextField
                disabled={selectedOption !== "Custom"}
                id="memory-limits"
                label="Limits"
                value={newLimits.memory}
                onChange={(e) =>
                  handleInputChange("limits", "memory", e.target.value)
                }
                sx={{
                  margin: 1,
                  "& .MuiInputBase-input": {
                    bgcolor: selectedOption === "Custom" ? "white" : "inherit",
                  },
                }}
              />
            </div>
            <div
              id="limits"
              className="my-2 w-1/4 rounded-xl border-2 border-slate-400/30"
            >
              <p className="leading-10">CPU</p>
              <TextField
                disabled={selectedOption !== "Custom"}
                id="cpu-requests"
                label="Requests"
                value={newRequests.cpu}
                onChange={(e) =>
                  handleInputChange("requests", "cpu", e.target.value)
                }
                sx={{
                  margin: 1,
                  "& .MuiInputBase-input": {
                    bgcolor: selectedOption === "Custom" ? "white" : "inherit",
                  },
                }}
              />
              <TextField
                disabled={selectedOption !== "Custom"}
                id="cpu-limits"
                label="Limits"
                value={newLimits.cpu}
                onChange={(e) =>
                  handleInputChange("limits", "cpu", e.target.value)
                }
                sx={{
                  margin: 1,
                  "& .MuiInputBase-input": {
                    bgcolor: selectedOption === "Custom" ? "white" : "inherit",
                  },
                }}
              />
            </div>
          </div>
          <br />
          <div id="button-container" className="flex flex-1 justify-around">
            <button
              className="rounded-lg bg-slate-600 px-8 py-2 text-slate-100 hover:bg-slate-700"
              onClick={proceedAdjustRequestsLimits}
            >
              Apply
            </button>
            <button
              className="rounded-lg bg-slate-600 px-8 py-2 text-slate-100 hover:bg-slate-700"
              onClick={cancelRequestsLimits}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

PodAdjustRequestsLimits.propTypes = {
  clickedPod: PropTypes.shape({
    podName: PropTypes.string,
    namespace: PropTypes.string,
    containers: PropTypes.array,
    deploymentName: PropTypes.string,
  }),
  backendUrl: PropTypes.string,
};

const ToolTipDescription = () => {
  return (
    <div className="text-sm">
      <p className="text-center text-base leading-10 text-slate-100">
        Suitability for each Configuration
      </p>
      <ul className="my-2 list-disc pl-4 text-slate-200">
        <li>
          <strong>Minimal (Lightweight):</strong> For small services like simple
          APIs or workers;
        </li>
        <br />
        <li>
          <strong>Medium (Standard):</strong>
          For regular web applications or small microservices;
        </li>
        <br />
        <li>
          <strong>Memory-Intensive:</strong>
          For data processing, ML or in-memory databases;
        </li>
        <br />
        <li>
          <strong>Compute-Intensive:</strong> For video processing or scientific
          computing
        </li>
        <br />
        <li>
          <strong>Custom:</strong> Manually set resources:
          <br />
          Memory format: 100Mi, 512Mi, 1Gi, 2Gi, etc.
          <br />
          CPU format: 100m (0.1 core), 500m (0.5 core), 1 (1 core), etc.
        </li>
      </ul>
    </div>
  );
};

export default PodAdjustRequestsLimits;
