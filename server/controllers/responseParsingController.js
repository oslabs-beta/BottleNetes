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
      nodeName: "",
      clusterName: "cluster name not configured",
      restartCount: 0,
      containerCount: 0,
      containers: [],
      readiness: false,
      podIp: "",
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
      memoryRequest: 0,
      cpuLimit: 0,
      memoryLimit: 0,
      cpuRequestLimitRatio: 0,
      memoryRequestLimitRatio: 0,
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
