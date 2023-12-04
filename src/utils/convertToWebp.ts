import path from 'path';
import sharp from 'sharp';
import { getFilesInsideDir } from "./getFilesInsideDir.js";
import { ConvertOptions } from '../types/ConvertOptions.js';


const convert = async (imagePath: string) => {
  const imageDir = path.parse(imagePath).dir;
  const imageName = path.parse(imagePath).name;

  await sharp(imagePath).webp().toFile(`${imageDir}/${imageName}.webp`);
  console.log(`Converted ${imagePath} to WebP`);
};

export async function convertToWebp({ dir }: ConvertOptions) {
  const pngList = getFilesInsideDir(dir, /\.png$/);
  const jpgList = getFilesInsideDir(dir, /\.jpg$/);

  for (const png of pngList) {
    await convert(png);
  }

  for (const jpg of jpgList) {
    await convert(jpg);
  }
};
