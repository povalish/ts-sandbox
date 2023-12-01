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

type GameResponse = {
  data: GameData[];
  pagination: { next_page: number };
};

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

const downloadAndSaveFile = ({ id, size, ext }: ImageUrlParams) => {
  const imagePath = getImagePath({ id, size, ext });
  const imageUrl = getImageUrl(imagePath);
  const file = createWriteStream(`./build/download-data/${imagePath}`);

  https.get(imageUrl, (response) => {
    console.log('Downloaded file: ', getImagePath({ id, size, ext }));
    response.pipe(file);

    file.on('finish', () => {
      file.close();
      console.log('File saved: ', getImagePath({ id, size, ext }));
    });
  });
};

const getGames = async () => {
  const result: GameData[] = [];

  let nextPage = 1;

  // while (nextPage) {
    const response = await fetch('https://ethplay.io/api/games_filter', {
      method: 'POST',
      body: JSON.stringify({ page: nextPage, page_size: 10 }),
    });

    
    const parsedResponse = await response.json() as GameResponse;
    
    result.push(...parsedResponse.data);
    nextPage = parsedResponse.pagination.next_page;
  // }

  return result;
};

export async function main() {
  const allGames = await getGames();
  allGames.forEach((game) => {
    downloadAndSaveFile({
      ext: 'webp',
      id: game.identifier,
      size: 's2',
    });
  });
}

await main();
