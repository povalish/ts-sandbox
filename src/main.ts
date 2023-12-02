import fs from 'fs-extra';
import https from 'https';


//
// Types

type ImageUrlParams = {
  id: string;
  size: string;
  ext: string;
};

type GameData = {
  identifier: string;
}

//
// Utils

const getImagePath = ({ id, size, ext }: ImageUrlParams) => {
  return `i/${size}/${id}.${ext}`;
};

const getImageUrl = (path: string) => {
  return `https://cdn2.softswiss.net/${path}`;
};

const createWriteStream = (imagePath: string) => {
  const path = imagePath.split('/');
  const fileName = path.pop();
  const dir = path.join('/');

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  return fs.createWriteStream(imagePath);
};

//
// Requests

const downloadAndSaveFile = async ({ id, size, ext }: ImageUrlParams): Promise<boolean> => {
  const imagePath = getImagePath({ id, size, ext });
  const imageUrl = getImageUrl(imagePath);
  const file = createWriteStream(`./build/download-data/${imagePath}`);

  console.info('Start downloading file: ', getImagePath({ id, size, ext }));

  return new Promise((resolve, reject) => {
    const req = https.get(imageUrl, (response) => {
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.info('File saved: ', getImagePath({ id, size, ext }));
        resolve(true);
      });
    });

    req.on('error', (err) => {
      console.log('Error: ', err);
      resolve(false);
    });

    req.end();
  });
};

const getGames = async () => {
  const response = await fetch('https://ethplay.io/api/games');
  return (await response.json()) as GameData[];
};

export async function main() {
  fs.rmSync('./build/download-data/', { recursive: true, force: true });

  const allGames = await getGames();  
  console.info('Games count: ', allGames.length);

  await Promise.all(allGames.slice(0, allGames.length / 2).map(async (game) => {
    await downloadAndSaveFile({ ext: 'webp', id: game.identifier, size: 's1' });
    await downloadAndSaveFile({ ext: 'png', id: game.identifier, size: 's1' });
  }));

  console.log('S1 size successfully downlaoded!');

  await Promise.all(allGames.slice(0, allGames.length / 2).map(async (game) => {
    await downloadAndSaveFile({ ext: 'webp', id: game.identifier, size: 's2' });
    await downloadAndSaveFile({ ext: 'png', id: game.identifier, size: 's2' });
  }));

  console.log('S2 size successfully downlaoded!');

  await Promise.all(allGames.slice(0, allGames.length / 2).map(async (game) => {
    await downloadAndSaveFile({ ext: 'webp', id: game.identifier, size: 's3' });
    await downloadAndSaveFile({ ext: 'png', id: game.identifier, size: 's3' });
  }));

  console.log('S3 size successfully downlaoded!');

  await Promise.all(allGames.slice(0, allGames.length / 2).map(async (game) => {
    await downloadAndSaveFile({ ext: 'webp', id: game.identifier, size: 's4' });
    await downloadAndSaveFile({ ext: 'png', id: game.identifier, size: 's4' });
  }));

  console.log('S4 size successfully downlaoded!');
}

await main();
