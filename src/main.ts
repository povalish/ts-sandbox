import fs from 'fs-extra';
import { getGames } from './utils/getGamesData.js';
import { downloadCovers } from './download-covers.js';
import { downloadBackgrounds } from './download-backgrounds.js';

//
//

export async function main() {
  // fs.rmSync('./build/download-data/', { recursive: true, force: true });
  // fs.rmSync('./build/logs/', { recursive: true, force: true });

  const allGames = await getGames();  

  // await downloadCovers(allGames);
  await downloadBackgrounds(allGames);

  console.log('Log successfully saved in /build/logs/');
}

await main();
