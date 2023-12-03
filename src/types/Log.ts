import { ImageUrlParams } from "./ImageUrlParams.js";

//
//


export type Log = {
  type: string;
  all: number;
  failed: Record<string, Set<string>>; // string - identifier, string[] - failed to fetch URLs
  success: number;
  redownloadParams?: ImageUrlParams[];
};

export type LogParams = {
  filename: string;
  failed: ImageUrlParams[];
  success: number;
  all: number;
};

export type LogHandlers = {
  onSuccess?: (data?: ImageUrlParams) => void;
  onError?: (data?: ImageUrlParams) => void;
};
