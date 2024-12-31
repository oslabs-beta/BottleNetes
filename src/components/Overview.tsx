/**
 * This component renders the overview such as Cluster Name, number of Nodes, Pods and Containers in that cluster
 */
import { useMemo } from "react";

import "../Overview.css";

import dataStore from "../stores/dataStore";

const Overview = () => {
  const podsStatuses = dataStore((state) => state.allData.podsStatuses);
  const allNodes = dataStore((state) => state.allData.allNodes);

  const overview = useMemo(() => {
    if (
      (!Array.isArray(podsStatuses) && !podsStatuses?.allPodsStatus) ||
      (!Array.isArray(allNodes) && !allNodes?.allNodes)
    ) {
      return {
        clusterName: "Not Connected",
        nodes: 0,
        pods: 0,
        containers: 0,
      };
    }

    return {
      clusterName: Array.isArray(allNodes)
        ? "Unknown Cluster"
        : allNodes.allNodes[0]?.clusterName,
      nodes: Array.isArray(allNodes) ? 0 : allNodes.allNodes.length,
      pods: Array.isArray(podsStatuses) ? 0 : podsStatuses.allPodsStatus.length,
      containers: Array.isArray(podsStatuses)
        ? 0
        : podsStatuses.allPodsStatus.reduce(
            (acc, pod) => acc + pod.containerCount,
            0,
          ),
    };
  }, [podsStatuses, allNodes]);

  return (
    <div className="overview-container fade-in">
      <div className="overview-cluster thin-line">
        <h2 style={{ fontWeight: 600 }}>Cluster Name</h2>
        <p className="overview-value dynamic-text">{overview.clusterName}</p>
      </div>

      <div className="overview-metrics-row">
        <div className="overview-card overview-nodes">
          <h2>No. of Nodes</h2>
          <p className="overview-value">{overview.nodes}</p>
        </div>

        <div className="overview-card overview-pods">
          <h2>No. of Pods</h2>
          <p className="overview-value">{overview.pods}</p>
        </div>

        <div className="overview-card overview-containers">
          <h2>No. of Containers</h2>
          <p className="overview-value">{overview.containers}</p>
        </div>
      </div>
    </div>
  );
};

export default Overview;
