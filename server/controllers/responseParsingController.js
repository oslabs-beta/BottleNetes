export const parseResponseAllPodsStatus = (req, res, next) => {
  const [
    phaseData,
    readinessData,
    containerInfoData,
    restartData,
    podInfoData,
  ] = res.locals.data;

  const podsObj = {};

  phaseData.forEach((item) => {
    const { pod, namespace, phase, service } = item.metric;

    podsObj[pod] = {
      podName: pod,
      status: phase.toLowerCase(),
      namespace: namespace,
      service: service,

      // Default values
      nodeName: "node name not configured",
      clusterName: "cluster name not configured",
      restartCount: 0,
      containerCount: 0,
      containers: [],
      readiness: "cannot fetch readiness",
      podIp: "cannot fetch pod ip",
    };
  });

  readinessData.forEach((item) => {
    const { pod } = item.metric;
    if (podsObj[pod]) {
      podsObj[pod].readiness = true;
    }
  });

  containerInfoData.forEach((item) => {
    const { pod, container } = item.metric;
    if (podsObj[pod] && container) {
      podsObj[pod].containers.push(container);
      podsObj[pod].containerCount++;
    }
  });

  restartData.forEach((item) => {
    const { pod } = item.metric;
    const restartCount = Number(item.value[1]);
    // sample data from postman:
    // "value": [
    //                 1733859277.866,
    //                 "0"
    //             ]
    if (podsObj[pod]) {
      podsObj[pod].restartCount = restartCount;
    }
  });

  podInfoData.forEach((item) => {
    const { pod, node, pod_ip, cluster } = item.metric;
    if (podsObj[pod]) {
      podsObj[pod].nodeName = node;
      podsObj[pod].podIp = pod_ip;
      if (cluster) {
        podsObj[pod].clusterName = cluster;
      }
    }
  });

  // Convert object values to array
  res.locals.parsedData = {
    allPodsStatus: Object.values(podsObj),
  };

  return next();
};

export const parseResponseAllPodsRequestLimit = (req, res, next) => {
  const [
    cpuRequestData,
    memoryRequestData,
    cpuLimitData,
    memoryLimitData,
    cpuRatioData,
    memoryRatioData,
  ] = res.locals.data;

  const podsObj = {};

  cpuRequestData.forEach((item) => {
    const { pod } = item.metric;
    const cpuRequest = Number(item.value[1]);

    podsObj[pod] = {
      podName: pod,
      cpuRequest,
      // placeholder values
      memoryRequest: "cannot fetch memory request",
      cpuLimit: "cannot fetch cpu limit",
      memoryLimit: "cannot fetch memory limit",
      cpuRequestLimitRatio: "cannot fetch cpu request limit ratio",
      memoryRequestLimitRatio: "cannot fetch memory request limit ratio",
    };
  });

  memoryRequestData.forEach((item) => {
    const { pod } = item.metric;
    const memoryRequest = Number(item.value[1]);
    if (podsObj[pod]) {
      podsObj[pod].memoryRequest = memoryRequest;
    }
  });

  cpuLimitData.forEach((item) => {
    const { pod } = item.metric;
    const cpuLimit = Number(item.value[1]);
    if (podsObj[pod]) {
      podsObj[pod].cpuLimit = cpuLimit;
    }
  });

  memoryLimitData.forEach((item) => {
    const { pod } = item.metric;
    const memoryLimit = Number(item.value[1]);
    if (podsObj[pod]) {
      podsObj[pod].memoryLimit = memoryLimit;
    }
  });

  cpuRatioData.forEach((item) => {
    const { pod } = item.metric;
    const ratio = Number(item.value[1]);
    if (podsObj[pod]) {
      podsObj[pod].cpuRequestLimitRatio = ratio;
    }
  });

  memoryRatioData.forEach((item) => {
    const { pod } = item.metric;
    const ratio = Number(item.value[1]);
    if (podsObj[pod]) {
      podsObj[pod].memoryRequestLimitRatio = ratio;
    }
  });

  res.locals.parsedData = {
    allPodsRequestLimit: Object.values(podsObj),
  };

  return next();
};

export const parseResponseResourceUsageOneValue = (req, res, next) => {
  const [relativeData, absoluteData] = res.locals.data;

  const podsObj = {};

  relativeData.forEach((item) => {
    const name = item.metric[res.locals.level];
    const relativeValue = Number(item.value[1]);

    podsObj[name] = {
      name,
      usageRelativeToRequest: relativeValue,
      // placeholder value
      usageAbsolute: "cannot fetch absolute value",
    };
  });

  absoluteData.forEach((item) => {
    const name = item.metric[res.locals.level];
    const absoluteValue = Number(item.value[1]);

    if (podsObj[name]) {
      podsObj[name].usageAbsolute = absoluteValue;
    }
  });

  res.locals.parsedData = {
    resourceUsageOneValue: Object.values(podsObj),
  };

  return next();
};

export const parseResponseResourceUsageHistorical = (req, res, next) => {
  const [relativeData, absoluteData] = res.locals.data;

  const podsObj = {};

  relativeData.forEach((item) => {
    const name = item.metric[res.locals.level];
    if (!podsObj[name]) {
      podsObj[name] = {
        name,
        timestampsUnix: [],
        timestampsReadable: [],
        usageRelative: [],
        usageAbsolute: [],
      };
    }
    item.values.forEach(([timestamp, value]) => {
      // convert unix stamp to human readable date
      const date = new Date(timestamp * 1000);
      podsObj[name].timestampsUnix.push(timestamp.toString());
      podsObj[name].timestampsReadable.push(date);
      podsObj[name].usageRelative.push(Number(value));
    });
  });

  absoluteData.forEach((item) => {
    const name = item.metric[res.locals.level];
    if (podsObj[name]) {
      item.values.forEach(([timestamp, value]) => {
        podsObj[name].usageAbsolute.push(Number(value));
      });
    }
  });

  res.locals.parsedData = {
    resourceUsageHistorical: Object.values(podsObj),
  };

  return next();
};

export const parseResponseLatencyAppRequestOneValue = (req, res, next) => {
  const [
    numRequestsData,
    inboundLatencyData,
    outboundLatencyData,
    combinedLatencyData,
    peakInboundData,
    peakOutboundData,
  ] = res.locals.data;

  console.log("Raw data from Prometheus:");
  console.log("Number of requests:", numRequestsData);
  console.log("Inbound latency:", inboundLatencyData);
  console.log("Outbound latency:", outboundLatencyData);
  console.log("Combined latency:", combinedLatencyData);
  console.log("Peak inbound:", peakInboundData);
  console.log("Peak outbound:", peakOutboundData);

  const resultObj = {};

  // // if no data at all, return empty array
  // if (!numRequestsData || numRequestsData.length === 0) {
  //   console.log("No request count data available");
  //   res.locals.parsedData = {
  //     latencyAppRequestOneValue: [],
  //   };
  //   return next();
  // }

  numRequestsData.forEach((item) => {
    const name = item.metric[res.locals.level];
    const numRequest = Number(item.value[1]);

    resultObj[name] = {
      name,
      numRequest,

      // Default values
      avgInboundLatency: 0,
      avgOutboundLatency: 0,
      avgCombinedLatency: 0,
      peakInboundLatency: 0,
      peakOutboundLatency: 0,
    };
  });

  inboundLatencyData.forEach((item) => {
    const name = item.metric[res.locals.level];
    const avgInboundLatency = Number(item.value[1]);
    if (resultObj[name]) {
      resultObj[name].avgInboundLatency = avgInboundLatency;
    }
  });

  outboundLatencyData.forEach((item) => {
    const name = item.metric[res.locals.level];
    const avgOutboundLatency = Number(item.value[1]);
    if (resultObj[name]) {
      resultObj[name].avgOutboundLatency = avgOutboundLatency;
    }
  });

  combinedLatencyData.forEach((item) => {
    const name = item.metric[res.locals.level];
    const avgCombinedLatency = Number(item.value[1]);
    if (resultObj[name]) {
      resultObj[name].avgCombinedLatency = avgCombinedLatency;
    }
  });

  peakInboundData.forEach((item) => {
    const name = item.metric[res.locals.level];
    const peakInboundLatency = Number(item.value[1]);
    if (resultObj[name]) {
      resultObj[name].peakInboundLatency = peakInboundLatency;
    }
  });

  peakOutboundData.forEach((item) => {
    const name = item.metric[res.locals.level];
    const peakOutboundLatency = Number(item.value[1]);
    if (resultObj[name]) {
      resultObj[name].peakOutboundLatency = peakOutboundLatency;
    }
  });

  console.log("Final processed data:", Object.values(resultObj));
  res.locals.parsedData = {
    latencyAppRequestOneValue: Object.values(resultObj),
  };

  return next();
};
