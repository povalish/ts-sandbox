import { GameData } from "./types/GameData.js";
import { ImageUrlParams } from "./types/ImageUrlParams.js";
import { downloadAndSaveFile, retryDownloadAndSaveFiles } from "./utils/downloadAndSaveFile.js";
import { saveDownloadLog } from "./utils/saveDownloadLog.js";

//
//


export const downloadBackgrounds = async (games: GameData[]) => {
  let failedImages = [];
  const onError = (image: ImageUrlParams) => {
    failedImages.push(image);
  };

  let successImages = 0;
  const onSuccess = () => {
    successImages += 1;
  };

  for (const game of games) {
    await downloadAndSaveFile({ ext: 'png', id: game.identifier, type: 'b' }, { onError, onSuccess });
  }

  await saveDownloadLog({
    filename: 'game-backgrounds',
    success: successImages,
    failed: failedImages,
    all: games.length,
  });

  // await retryDownloadAndSaveFiles('game-backgrounds');
}