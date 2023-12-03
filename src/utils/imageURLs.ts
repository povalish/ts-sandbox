import { ImageUrlParams } from "../types/ImageUrlParams.js";

//
//

export const getImagePath = ({ id, size, ext, type }: ImageUrlParams) => {
  const url = [];

  url.push(type);
  if (!!size) { url.push(size); }
  url.push(`${id}.${ext}`);

  return url.join('/');
  // return `${type}/${size}/${id}.${ext}`;
};

export const getImageUrl = (path: string) => {
  return `https://cdn2.softswiss.net/${path}`;
};
