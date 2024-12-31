/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Controller contains middleware to parse the responses back with the usable formats
 */

import { Request, Response, NextFunction } from "express";

export const parseResponseAllPodsStatus = (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  const [
    phaseData,
    readinessData,
    containerInfoData,
    restartData,
    podInfoData,
    podReplicaSetOwnerData,
  ] = res.locals.data;

  const podsObj: { [key: string]: any } = {};

  phaseData.forEach(
    (item: {
      metric: { pod: any; namespace: any; phase: any; service: any };
    }) => {
      const { pod, namespace, phase, service } = item.metric;
      // key is the pod name
      // value is an object with pod info
      podsObj[pod] = {
        podName: pod,
        status: phase.toLowerCase(),
        namespace: namespace,
        service: service,

        // placeholder values
        nodeName: "node name not configured",
        clusterName: "cluster name not configured",
        restartCount: 0,
        containerCount: 0,
        containers: [],
        readiness: "cannot fetch readiness",
        podIp: "cannot fetch pod ip",
        deploymentName: "deployment not found",
      };
    },
  );

  readinessData.forEach((item: { metric: { pod: any } }) => {
    const { pod } = item.metric;
    if (podsObj[pod]) {
      podsObj[pod].readiness = true;
    }
  });

  containerInfoData.forEach(
    (item: { metric: { pod: any; container: any } }) => {
      const { pod, container } = item.metric;
      if (podsObj[pod] && container) {
        podsObj[pod].containers.push(container);
        podsObj[pod].containerCount++;
      }
    },
  );

  restartData.forEach((item: { metric: { pod: any }; value: any[] }) => {
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

  podInfoData.forEach(
    (item: { metric: { pod: any; node: any; pod_ip: any; cluster: any } }) => {
      const { pod, node, pod_ip, cluster } = item.metric;
      if (podsObj[pod]) {
        podsObj[pod].nodeName = node;
        podsObj[pod].podIp = pod_ip;
        if (cluster) {
          podsObj[pod].clusterName = cluster;
        }
      }
    },
  );

  podReplicaSetOwnerData.forEach(
    (item: { metric: { replicaset: any; owner_name: any } }) => {
      const { replicaset, owner_name } = item.metric;
      // The relationship between ReplicaSet names and Pod names:
      // ReplicaSet name: deployment-name-hash
      // Pod name: deployment-name-hash-random
      // Example:
      // ReplicaSet: ai-daffy-frontend-deployment-5c9d8c6685
      // Pod: ai-daffy-frontend-deployment-5c9d8c6685-tb55c

      // For each pod in podsObj, check if its name starts with the replicaset name
      Object.keys(podsObj).forEach((podName) => {
        // If the pod name starts with the replicaset name, assign the deployment name to that pod
        if (podName.startsWith(replicaset)) {
          podsObj[podName].deploymentName = owner_name;
        }
      });
    },
  );

  // Convert object values to array
  res.locals.parsedData = {
    allPodsStatus: Object.values(podsObj),
  };

  return next();
};

export const parseResponseAllPodsRequestLimit = (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  const [
    cpuRequestData,
    memoryRequestData,
    cpuLimitData,
    memoryLimitData,
    cpuRatioData,
    memoryRatioData,
  ] = res.locals.data;

  const podsObj: { [key: string]: any } = {};

  cpuRequestData.forEach((item: { metric: { pod: any }; value: any[] }) => {
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

  memoryRequestData.forEach((item: { metric: { pod: any }; value: any[] }) => {
    const { pod } = item.metric;
    const memoryRequest = Number(item.value[1]);
    if (podsObj[pod]) {
      podsObj[pod].memoryRequest = memoryRequest;
    }
  });

  cpuLimitData.forEach((item: { metric: { pod: any }; value: any[] }) => {
    const { pod } = item.metric;
    const cpuLimit = Number(item.value[1]);
    if (podsObj[pod]) {
      podsObj[pod].cpuLimit = cpuLimit;
    }
  });

  memoryLimitData.forEach((item: { metric: { pod: any }; value: any[] }) => {
    const { pod } = item.metric;
    const memoryLimit = Number(item.value[1]);
    if (podsObj[pod]) {
      podsObj[pod].memoryLimit = memoryLimit;
    }
  });

  cpuRatioData.forEach((item: { metric: { pod: any }; value: any[] }) => {
    const { pod } = item.metric;
    const ratio = Number(item.value[1]);
    if (podsObj[pod]) {
      podsObj[pod].cpuRequestLimitRatio = ratio;
    }
  });

  memoryRatioData.forEach((item: { metric: { pod: any }; value: any[] }) => {
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

export const parseResponseResourceUsageOneValue = (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  const [relativeData, absoluteData] = res.locals.data;

  const podsObj: { [key: string]: any } = {};

  relativeData.forEach(
    (item: { metric: { [x: string]: any }; value: any[] }) => {
      const name = item.metric[res.locals.level];
      const relativeValue = Number(item.value[1]);

      podsObj[name] = {
        name,
        usageRelativeToRequest: relativeValue,
        // placeholder value
        usageAbsolute: "cannot fetch absolute value",
      };
    },
  );

  absoluteData.forEach(
    (item: { metric: { [x: string]: any }; value: any[] }) => {
      const name = item.metric[res.locals.level];
      const absoluteValue = Number(item.value[1]);

      if (podsObj[name]) {
        podsObj[name].usageAbsolute = absoluteValue;
      }
    },
  );

  res.locals.parsedData = {
    resourceUsageOneValue: Object.values(podsObj),
  };

  return next();
};

export const parseResponseResourceUsageHistorical = (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  const [relativeData, absoluteData] = res.locals.data;

  const podsObj: { [key: string]: any } = {};

  relativeData.forEach(
    (item: { metric: { [x: string]: any }; values: [any, any][] }) => {
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
    },
  );

  absoluteData.forEach(
    (item: { metric: { [x: string]: any }; values: [any, any][] }) => {
      const name = item.metric[res.locals.level];
      if (podsObj[name]) {
        item.values.forEach(([, value]) => {
          podsObj[name].usageAbsolute.push(Number(value));
        });
      }
    },
  );

  res.locals.parsedData = {
    resourceUsageHistorical: Object.values(podsObj),
  };

  return next();
};

export const parseResponseLatencyAppRequestOneValue = (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  const [
    numRequestsData,
    inboundLatencyData,
    outboundLatencyData,
    combinedLatencyData,
    peakInboundData,
    peakOutboundData,
  ] = res.locals.data;

  // console.log("Raw data from Prometheus:");
  // console.log("Number of requests:", numRequestsData);
  // console.log("Inbound latency:", inboundLatencyData);
  // console.log("Outbound latency:", outboundLatencyData);
  // console.log("Combined latency:", combinedLatencyData);
  // console.log("Peak inbound:", peakInboundData);
  // console.log("Peak outbound:", peakOutboundData);

  const resultObj: { [key: string]: any } = {};

  // // if no data at all, return empty array
  // if (!numRequestsData || numRequestsData.length === 0) {
  //   console.log("No request count data available");
  //   res.locals.parsedData = {
  //     latencyAppRequestOneValue: [],
  //   };
  //   return next();
  // }

  numRequestsData.forEach(
    (item: { metric: { [x: string]: any }; value: any[] }) => {
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
    },
  );

  inboundLatencyData.forEach(
    (item: { metric: { [x: string]: any }; value: any[] }) => {
      const name = item.metric[res.locals.level];
      const avgInboundLatency = Number(item.value[1]);
      if (resultObj[name]) {
        resultObj[name].avgInboundLatency = avgInboundLatency;
      }
    },
  );

  outboundLatencyData.forEach(
    (item: { metric: { [x: string]: any }; value: any[] }) => {
      const name = item.metric[res.locals.level];
      const avgOutboundLatency = Number(item.value[1]);
      if (resultObj[name]) {
        resultObj[name].avgOutboundLatency = avgOutboundLatency;
      }
    },
  );

  combinedLatencyData.forEach(
    (item: { metric: { [x: string]: any }; value: any[] }) => {
      const name = item.metric[res.locals.level];
      const avgCombinedLatency = Number(item.value[1]);
      if (resultObj[name]) {
        resultObj[name].avgCombinedLatency = avgCombinedLatency;
      }
    },
  );

  peakInboundData.forEach(
    (item: { metric: { [x: string]: any }; value: any[] }) => {
      const name = item.metric[res.locals.level];
      const peakInboundLatency = Number(item.value[1]);
      if (resultObj[name]) {
        resultObj[name].peakInboundLatency = peakInboundLatency;
      }
    },
  );

  peakOutboundData.forEach(
    (item: { metric: { [x: string]: any }; value: any[] }) => {
      const name = item.metric[res.locals.level];
      const peakOutboundLatency = Number(item.value[1]);
      if (resultObj[name]) {
        resultObj[name].peakOutboundLatency = peakOutboundLatency;
      }
    },
  );

  // console.log("Final processed data:", Object.values(resultObj));
  res.locals.parsedData = {
    latencyAppRequestOneValue: Object.values(resultObj),
  };

  return next();
};

export const parseResponseLatencyAppRequestHistorical = (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  const [
    inboundLatencyData,
    outboundLatencyData,
    combinedLatencyData,
    peakInboundData,
    peakOutboundData,
  ] = res.locals.data;

  const resultObj: { [key: string]: any } = {};

  inboundLatencyData.forEach(
    (item: { metric: { [x: string]: any }; values: [any, any][] }) => {
      const name = item.metric[res.locals.level];
      if (!resultObj[name]) {
        resultObj[name] = {
          name,
          timestampsUnix: [],
          timestampsReadable: [],
          avgInboundLatency: [],
          avgOutboundLatency: [],
          avgCombinedLatency: [],
          peakInboundLatency: [],
          peakOutboundLatency: [],
        };
      }

      item.values.forEach(([timestamp, value]) => {
        resultObj[name].timestampsUnix.push(timestamp.toString());
        resultObj[name].timestampsReadable.push(
          new Date(timestamp * 1000).toISOString(),
        );
        resultObj[name].avgInboundLatency.push(Number(value));
      });
    },
  );

  outboundLatencyData.forEach(
    (item: { metric: { [x: string]: any }; values: [any, any][] }) => {
      const name = item.metric[res.locals.level];
      if (resultObj[name]) {
        item.values.forEach(([, value]: any, index: string | number) => {
          resultObj[name].avgOutboundLatency[index] = Number(value);
        });
      }
    },
  );

  combinedLatencyData.forEach(
    (item: { metric: { [x: string]: any }; values: [any, any][] }) => {
      const name = item.metric[res.locals.level];
      if (resultObj[name]) {
        item.values.forEach(([, value]: any, index: string | number) => {
          resultObj[name].avgCombinedLatency[index] = Number(value);
        });
      }
    },
  );

  peakInboundData.forEach(
    (item: { metric: { [x: string]: any }; values: [any, any][] }) => {
      const name = item.metric[res.locals.level];
      if (resultObj[name]) {
        item.values.forEach(([, value]: any, index: string | number) => {
          resultObj[name].peakInboundLatency[index] = Number(value);
        });
      }
    },
  );

  peakOutboundData.forEach(
    (item: { metric: { [x: string]: any }; values: [any, any][] }) => {
      const name = item.metric[res.locals.level];
      if (resultObj[name]) {
        item.values.forEach(([, value]: any, index: string | number) => {
          resultObj[name].peakOutboundLatency[index] = Number(value);
        });
      }
    },
  );

  res.locals.parsedData = {
    latencyAppRequestHistorical: Object.values(resultObj),
  };

  return next();
};
