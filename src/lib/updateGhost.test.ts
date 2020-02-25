import { TILE_SIZE } from './Coordinates';
import { Game } from './Game';
import { onTimeElapsed } from './onTimeElapsed';
import { SPEED } from './Types';
import { getNewDirection } from './updateGhost';

const MILLISECONDS_PER_FRAME = 17;

const FRAMES_PER_TILE = TILE_SIZE / SPEED;

const simulateFrames = (numberOfFrames: number, game: Game) => {
  for (let frames = 0; frames < numberOfFrames; frames++) {
    onTimeElapsed({
      game,
      timestamp: 1 + frames * MILLISECONDS_PER_FRAME,
    });
  }
};

const simulateFramesToMoveNTiles = (numberOfTiles: number, game: Game) => {
  const numberOfFrames = numberOfTiles * FRAMES_PER_TILE;
  simulateFrames(numberOfFrames, game);
};

describe('updateGhost', () => {
  describe('getNewDirection()', () => {
    it('returns the new direction to take', () => {
      const game = new Game();
      const ghost = game.ghosts[0];
      ghost.send('PHASE_END');
      expect(ghost.state).toBe('chase');
      ghost.targetTile = { x: 6, y: 1 };
      ghost.setTileCoordinates({ x: 1, y: 1 });
      ghost.direction = 'UP';
      expect(getNewDirection(ghost)).toBe('RIGHT');
    });

    it('walks throught the tunnel to the RIGHT', () => {
      // Arrange
      const game = new Game();
      const ghost = game.ghosts[0];
      ghost.send('PHASE_END');
      expect(ghost.state).toBe('chase');
      ghost.targetTile = { x: 4, y: 14 };
      ghost.setTileCoordinates({ x: 27, y: 14 });
      ghost.direction = 'RIGHT';

      // Act / Asset
      expect(getNewDirection(ghost)).toBe('RIGHT');

      // Arrange

      ghost.setTileCoordinates({ x: 26, y: 14 });
      ghost.direction = 'RIGHT';
      expect(getNewDirection(ghost)).toBe('RIGHT');
    });

    it('walks throught the tunnel to the LEFT', () => {
      // Arrange
      const game = new Game();
      const ghost = game.ghosts[0];
      ghost.send('PHASE_END');
      expect(ghost.state).toBe('chase');
      ghost.targetTile = { x: 26, y: 14 };
      ghost.setTileCoordinates({ x: 0, y: 14 });
      ghost.direction = 'LEFT';

      // Act / Asset
      expect(getNewDirection(ghost)).toBe('LEFT');

      // Arrange

      ghost.setTileCoordinates({ x: 1, y: 14 });
      ghost.direction = 'LEFT';
      expect(getNewDirection(ghost)).toBe('LEFT');
    });
  });

  describe('updateGhost()', () => {
    it('advances ghost positions', () => {
      // Arrange
      const game = new Game();
      game.pacMan.setTileCoordinates({ x: 1, y: 1 });
      expect(game.pacMan.screenCoordinates.x).toBe(30);
      game.pacMan.direction = 'LEFT';
      game.pacMan.nextDirection = 'LEFT';

      const ghost = game.ghosts[0];
      ghost.send('PHASE_END');
      expect(ghost.state).toBe('chase');
      ghost.setTileCoordinates({ x: 1, y: 3 });
      ghost.ghostPaused = false;
      expect(ghost.screenCoordinates).toEqual({ x: 30, y: 70 });

      // Act
      onTimeElapsed({ game, timestamp: MILLISECONDS_PER_FRAME });

      expect(ghost.screenCoordinates).toEqual({ x: 30, y: 68 });
    });

    describe('in chase mode', () => {
      it('lets ghost 0 chase pacman', () => {
        // Arrange
        const game = new Game();
        game.pacMan.setTileCoordinates({ x: 1, y: 8 });

        game.pacMan.direction = 'LEFT';
        game.pacMan.nextDirection = 'LEFT';

        const ghost = game.ghosts[0];
        ghost.send('PHASE_END');
        ghost.direction = 'LEFT';
        expect(ghost.state).toBe('chase');

        ghost.setTileCoordinates({ x: 3, y: 5 });
        ghost.ghostPaused = false;
        expect(ghost.screenCoordinates).toEqual({ x: 70, y: 110 });

        // Act
        simulateFramesToMoveNTiles(1, game);

        expect(ghost.screenCoordinates).toEqual({ x: 50, y: 110 });
        expect(ghost.tileCoordinates).toEqual({ x: 2, y: 5 });
        expect(ghost.targetTile).toEqual({ x: 1, y: 8 });
        expect(ghost.wayPoints).toEqual([
          { x: 2, y: 5 },
          { x: 1, y: 5 },
          { x: 1, y: 6 },
          { x: 1, y: 7 },
          { x: 1, y: 8 },
        ]);
        simulateFrames(200, game);
        expect(ghost.state).toBe('chase');
        expect(game.pacMan.state).toBe('dead');
        expect(ghost.tileCoordinates).toEqual({ x: 1, y: 7 });
      });

      it('lets ghost 0 go through the tunnel', () => {
        // Arrange
        const game = new Game();
        game.pacMan.setTileCoordinates({ x: 27, y: 14 });

        game.pacMan.direction = 'RIGHT';
        game.pacMan.nextDirection = 'RIGHT';

        const ghost = game.ghosts[0];
        ghost.send('PHASE_END');
        expect(ghost.state).toBe('chase');

        ghost.setTileCoordinates({ x: 25, y: 14 });
        ghost.direction = 'RIGHT';
        ghost.ghostPaused = false;

        // Act
        onTimeElapsed({ game, timestamp: MILLISECONDS_PER_FRAME });

        // Assert
        expect(ghost.targetTile).toEqual({ x: 27, y: 14 });
        expect(ghost.tileCoordinates).toEqual({ x: 25, y: 14 });
        expect(ghost.direction).toBe('RIGHT');

        // Act
        simulateFramesToMoveNTiles(1, game);

        // Assert
        expect(ghost.direction).toBe('RIGHT');
        expect(ghost.tileCoordinates).toEqual({ x: 26, y: 14 });

        // Act
        simulateFramesToMoveNTiles(2, game);

        // Assert
        expect(ghost.tileCoordinates).toEqual({ x: 27, y: 14 });

        // Act
        simulateFramesToMoveNTiles(2, game);

        // Assert
        expect(ghost.tileCoordinates).toEqual({ x: 0, y: 14 });

        // Act
        simulateFramesToMoveNTiles(2, game);

        // Assert
        expect(ghost.tileCoordinates).toEqual({ x: 1, y: 14 });
        expect(game.pacMan.tileCoordinates).toEqual({ x: 6, y: 14 });
        expect(ghost.targetTile).toEqual({ x: 5, y: 14 });
        expect(ghost.state).toBe('chase');
      });
    });

    describe('in scatter mode', () => {
      it('lets ghost 0 go to the lower right corner', () => {
        // Arrange
        const game = new Game();
        game.pacMan.setTileCoordinates({ x: 1, y: 8 });
        game.pacMan.direction = 'LEFT';
        game.pacMan.nextDirection = 'LEFT';

        const ghost = game.ghosts[0];
        expect(ghost.state).toBe('scatter');
        ghost.setTileCoordinates({ x: 24, y: 1 });
        ghost.direction = 'RIGHT';
        ghost.ghostPaused = false;

        // Act
        onTimeElapsed({ game, timestamp: MILLISECONDS_PER_FRAME });

        expect(ghost.targetTile).toEqual({ x: 26, y: 1 });
        expect(ghost.wayPoints).toEqual([
          { x: 24, y: 1 },
          { x: 25, y: 1 },
          { x: 26, y: 1 },
        ]);

        expect(ghost.tileCoordinates).toEqual({ x: 24, y: 1 });
        simulateFramesToMoveNTiles(2, game);

        expect(ghost.tileCoordinates).toEqual({ x: 26, y: 1 });
        expect(ghost.direction).toBe('DOWN');
      });
    });

    it('lets the ghost pause when pac man is dead', () => {
      // Arrange
      const game = new Game();
      game.pacMan.setTileCoordinates({ x: 1, y: 1 });
      expect(game.pacMan.screenCoordinates.x).toBe(30);
      game.pacMan.direction = 'LEFT';
      game.pacMan.nextDirection = 'LEFT';

      const ghost = game.ghosts[0];
      ghost.setTileCoordinates({ x: 3, y: 1 });
      ghost.ghostPaused = false;
      expect(ghost.screenCoordinates).toEqual({ x: 70, y: 30 });

      // Act
      simulateFrames(20, game);

      expect(game.pacMan.state === 'dead');
      expect(ghost.ghostPaused).toBeTruthy();
    });
  });
});
