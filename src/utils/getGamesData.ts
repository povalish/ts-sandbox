import { GameData } from "../types/GameData.js";

//
//

export const getGames = async () => {
  const response = await fetch('https://ethplay.io/api/games');
  return (await response.json()) as GameData[];
};
