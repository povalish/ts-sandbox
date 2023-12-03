import fs from 'fs-extra';

//
//

export const createDir = (filepath: string) => {
  const path = filepath.split('/');
  const fileName = path.pop();
  const dir = path.join('/');

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

export const createWriteStream = (imagePath: string) => {
  createDir(imagePath);
  return fs.createWriteStream(imagePath);
};
