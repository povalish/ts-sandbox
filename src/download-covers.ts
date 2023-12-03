import { GameData } from "./types/GameData.js";
import { ImageUrlParams } from "./types/ImageUrlParams.js";
import { downloadAndSaveFile, retryDownloadAndSaveFiles } from "./utils/downloadAndSaveFile.js";
import { saveDownloadLog } from "./utils/saveDownloadLog.js";

//
//


export const downloadCovers = async (games: GameData[]) => {
  let failedImages = [];
  const onError = (image: ImageUrlParams) => {
    failedImages.push(image);
  }

  let successImages = 0;
  const onSuccess = () => {
    successImages += 1;
  };

  for (const game of games) {
    await downloadAndSaveFile({ ext: 'webp', id: game.identifier, size: 's1', type: 'i' }, { onError, onSuccess });
    await downloadAndSaveFile({ ext: 'webp', id: game.identifier, size: 's2', type: 'i' }, { onError, onSuccess });
    await downloadAndSaveFile({ ext: 'webp', id: game.identifier, size: 's3', type: 'i' }, { onError, onSuccess });
    await downloadAndSaveFile({ ext: 'webp', id: game.identifier, size: 's4', type: 'i' }, { onError, onSuccess });
    await downloadAndSaveFile({ ext: 'png', id: game.identifier, size: 's1', type: 'i' }, { onError, onSuccess });
    await downloadAndSaveFile({ ext: 'png', id: game.identifier, size: 's2', type: 'i' }, { onError, onSuccess });
    await downloadAndSaveFile({ ext: 'png', id: game.identifier, size: 's3', type: 'i' }, { onError, onSuccess });
    await downloadAndSaveFile({ ext: 'png', id: game.identifier, size: 's4', type: 'i' }, { onError, onSuccess });
  }

  await saveDownloadLog({
    filename: 'game-covers',
    success: successImages,
    failed: failedImages,
    all: games.length,
  });

  // retryDownloadAndSaveFiles('game-covers');
}