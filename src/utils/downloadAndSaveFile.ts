import https from 'https';
import fs from 'fs-extra';

import { ImageUrlParams } from "../types/ImageUrlParams.js";
import { Log, LogHandlers } from "../types/Log.js";
import { getImagePath, getImageUrl } from "./imageURLs.js";
import { createWriteStream } from './createWriteStream.js';
import { LOG_PATH } from './saveDownloadLog.js';

//
//

export const downloadAndSaveFile = async (
  { id, size, ext, type }: ImageUrlParams,
  { onError, onSuccess }: LogHandlers,
): Promise<boolean> => {
  const imagePath = getImagePath({ id, size, ext, type });
  const imageUrl = getImageUrl(imagePath);
  const file = createWriteStream(`./build/download-data/${imagePath}`);

  console.log('---------');
  console.info('Start downloading file: ', imagePath);

  return new Promise((resolve, reject) => {
    const req = https.get(imageUrl, (response) => {
      response.pipe(file);

      console.log('Status Code: ', response.statusCode);

      if (response.statusCode < 300) {
        file.on('finish', () => {
          file.close();

          console.info('File saved: ', imagePath);
          console.log('---------');

          onSuccess?.({ id, size, ext, type });
          resolve(true);
        });
      } else {
        file.on('finish', () => {
          file.close();
  
          fs.rmSync(file.path);
  
          onError?.({ id, size, ext, type });
          resolve(false);
        });
      }
    });

    req.on('error', (err) => {
      console.error('Error: ', imagePath);
      console.log('---------');

      file.close();

      fs.rmSync(file.path);

      onError?.({ id, size, ext, type });
      resolve(false);
    });

    req.end();
  });
};

export const retryDownloadAndSaveFiles = async (logFilename: string) => {
  const  logFile: Log = JSON.parse(
    await fs.readFile(
      LOG_PATH(logFilename), 'utf8'
    )
  );

  if (logFile.redownloadParams?.length) {
    console.log('Retry download files...');

    for (const params of logFile.redownloadParams) {
      await downloadAndSaveFile(params, {});
    }
  
    console.log('Download is over.')
  }
};
