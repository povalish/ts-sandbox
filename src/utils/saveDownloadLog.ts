import fs from "fs-extra";
import { Log, LogParams } from "../types/Log.js";
import { getImagePath, getImageUrl } from "./imageURLs.js";
import { createDir } from "./createWriteStream.js";

//
//

export const LOG_PATH = (filename: string) => `./build/logs/${filename}.json`;

//
//

export const saveDownloadLog = async ({ filename, success, failed, all }: LogParams) => {
  if (failed.length === 0) { return; }

  const path = LOG_PATH(filename);

  const log: Log = {
    type: failed[0].type,
    all,
    success,
    failed: {},
    redownloadParams: failed,
  };

  failed.forEach((image) => {
    if (!log.failed[image.id]) {
      log.failed[image.id] = new Set();
    }

    const imagePath = getImagePath(image);
    const imageUrl = getImageUrl(imagePath);

    log.failed[image.id].add(imageUrl);
  });

  // Convert Sets to plain array
  Object.keys(log.failed).forEach((key) => {
    const array = log.failed[key];
    // @ts-ignore
    log.failed[key] = [...array];
  });

  createDir(path);
  await fs.writeFile(path, JSON.stringify(log, null, 2));
};
