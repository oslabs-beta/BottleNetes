import React, { useState, useEffect } from "react";
import "./Overview.css";

const Overview = ({ allPodsStatus, allNodes }) => {
  const [overview, setOverview] = useState({
    clusterName: "Loading...",
    nodes: 0,
    pods: 0,
    containers: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        console.log("🏃💨 Fetching data...");

        /** ---------------------- COMMENTED OUT API CALLS ---------------------- **/
      
        const podsResponse = await fetch("http://localhost:3000/api/all-pods-status");
        if (!podsResponse.ok) throw new Error("❌ Failed to fetch pod data");

        const podsData = await podsResponse.json();
        const podCount = podsData.allPodsStatus.length;
        const containerCount = podsData.allPodsStatus.reduce(
          (acc, pod) => acc + pod.containerCount,
          0
        );
        const clusterName = podsData.allPodsStatus[0]?.clusterName || "Unknown";

        const nodesResponse = await fetch("http://localhost:3000/api/all-nodes");
        if (!nodesResponse.ok) throw new Error("❌ Failed to fetch node data");

        const nodesData = await nodesResponse.json();
        const nodeCount = nodesData.allNodes.length;

        setOverview({
          clusterName,
          nodes: nodeCount,
          pods: podCount,
          containers: containerCount,
        });

        /** ---------------------- FAKE DATA ---------------------- **/
        setTimeout(() => {
          setOverview({
            clusterName: "Dynamic-Cluster-Name-001",
            nodes: 5,
            pods: 12,
            containers: 25,
          });
          console.log("✅ Data successfully loaded!");
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error("😵 Error fetching metrics:", err);
        setError(err.message || "An unknown error occurred.");
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="overview-container fade-in">
        <p className="overview-message blinking">
          ⏳ Loading Cluster Overview...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overview-container fade-in">
        <p className="overview-error">❗❗ Error❗❗ : {error}</p>
      </div>
    );
  }

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
