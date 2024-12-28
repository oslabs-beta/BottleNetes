/**
 * This component renders the overview such as Cluster Name, number of Nodes, Pods and Containers in that cluster
 */

import PropTypes from "prop-types";
import { useMemo } from "react";

import "../Overview.css";

const Overview = ({ podsStatuses, allNodes }) => {
  const overview = useMemo(() => {
    if (!podsStatuses?.allPodsStatus || !allNodes?.allNodes) {
      return {
        clusterName: "Not Connected",
        nodes: 0,
        pods: 0,
        containers: 0,
      };
    }

    return {
      clusterName: allNodes.allNodes[0]?.clusterName || "Unknown Cluster",
      nodes: allNodes.allNodes.length,
      pods: podsStatuses.allPodsStatus.length,
      containers: podsStatuses.allPodsStatus.reduce(
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

Overview.propTypes = {
  podsStatuses: PropTypes.object,
  allNodes: PropTypes.object,
};

export default Overview;
