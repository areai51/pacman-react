import { Game } from './Game';
import { onTimeElapsed } from './onTimeElapsed';
import { MilliSeconds, SPEED } from './Types';
import { SCREEN_TILE_SIZE } from './Coordinates';

const FRAME_LENGTH: MilliSeconds = Math.ceil(1000 / 60);

const FRAMES_PER_TILE = SCREEN_TILE_SIZE / SPEED;

export const simulateTimeElapsed = (milliSeconds: MilliSeconds, game: Game) => {
  onTimeElapsed({
    game,
    timestamp: game.timestamp + milliSeconds,
  });
};

export const simulateFrames = (numberOfFrames: number, game: Game) => {
  for (let frames = 0; frames < numberOfFrames; frames++) {
    simulateTimeElapsed(1 + frames * FRAME_LENGTH, game);
  }
};

export const simulateFramesToMoveNTiles = (
  numberOfTiles: number,
  game: Game
) => {
  const numberOfFrames = numberOfTiles * FRAMES_PER_TILE;
  simulateFrames(numberOfFrames, game);
};
