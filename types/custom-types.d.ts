// This file stores all custom types and interfaces

declare module "github-oauth-types" {
  // Interfaces for GitHub OAuth Profile and Done params
  export interface GitHubProfile {
    id: string;
    displayName: string;
    username: string;
    profileUrl: string;
    emails: { value: string }[];
    photos: { value: string }[];
  }

  export interface GitHubDone {
    (error: any, user?: { profile: GitHubProfile; accessToken: string }): void;
  }

  // Interface for extending Request in express
  export interface User {
    profile: {
      id: string;
      displayName: string;
      provider: string;
    };
  }
}

declare module "controller-types" {
  import { Request, Response, NextFunction } from "express";
  // Interface for cookieController
  export interface CookieController {
    createCookie: (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => Promise<void>;
    verifyCookie: (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => Promise<void>;
    deleteCookie: (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => Promise<void>;
  }

  // Interface for k8sController
  export interface K8sController {
    checkClickedPod: (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => Promise<void>;
    softDeletePod: (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => Promise<void>;
    fetchPodLogs: (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => Promise<void>;
    formatLogs: (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => Promise<void>;
    getDeployment: (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => Promise<void>;
    readDeployment: (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => Promise<void>;
    scaleReplicas: (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => Promise<void>;
    adjustRequestLimit: (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => Promise<void>;
  }

  // Interface for prometheusController
  export interface PrometheusController {
    runSinglePromQLQuery: (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => Promise<void>;
    runMultiplePromQLQueries: (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => Promise<void>;
  }

  // Interface for promqlController
  export interface PromQLController {
    generateQueryAllPodsStatus: (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => Promise<void>;
    generateQueryAllPodsRequestLimit: (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => Promise<void>;
    generateQueryResourceUsage: (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => Promise<void>;
    generateQueryLatencyAppRequest: (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => Promise<void>;
  }

  // Interface for requestParsingController
  export interface RequestParsingController {
    parseRequestAllPodsStatus: (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => void;
    parseRequestAllPodsRequestLimit: (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => void;
    parseRequestResourceUsageOneValue: (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => void;
    parseRequestResourceUsageHistorical: (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => void;
    parseRequestLatencyAppRequestOneValue: (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => void;
    parseRequestLatencyAppRequestHistorical: (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => void;
  }

  // Interface for responseParsingController
  export interface ResponseParsingController {
    parseResponseAllPodsStatus: (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => void;
    parseResponseAllPodsRequestLimit: (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => void;
    parseResponseResourceUsageOneValue: (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => void;
    parseResponseResourceUsageHistorical: (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => void;
    parseResponseLatencyAppRequestOneValue: (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => void;
    parseResponseLatencyAppRequestHistorical: (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => void;
  }

  // Interface for userController
  export interface UserController {
    createNewUser: (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => Promise<void>;
    verifyUser: (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => Promise<void>;
  }
}
