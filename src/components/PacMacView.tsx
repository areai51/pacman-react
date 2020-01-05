import React, { FC, Fragment } from 'react';
import { Sprite } from './Sprite';
import { Direction } from './Types';
import { observer } from 'mobx-react-lite';
import { useStore } from '../lib/StoreContext';
import { TILE_SIZE, screenFromTileCoordinate } from '../lib/Coordinates';
import { getPacManHitBox } from '../lib/onTimeElapsed';
import { Box } from './Box';

export type PacManPhase = 0 | 1 | 2;

export const PacManPhases: PacManPhase[] = [0, 1, 2];

const PAC_MAN_WIDTH = TILE_SIZE * 2;
const PAC_MAN_HEIGHT = TILE_SIZE * 2;

const PAC_MAN_OFFSET_X = PAC_MAN_WIDTH / 2 - 2;
const PAC_MAN_OFFSET_Y = PAC_MAN_HEIGHT / 2 - 2;

const HIT_BOX_VISIBLE = false;

export const PacManView: FC<{}> = observer(() => {
  const store = useStore();
  const pacMan = store.pacMan;
  const { x, y, direction, phase } = pacMan;
  return (
    <Fragment>
      {HIT_BOX_VISIBLE && <PacManHitBox x={x} y={y} />}
      <PacManSprite
        direction={direction}
        phase={phase}
        x={x - PAC_MAN_OFFSET_X}
        y={y - PAC_MAN_OFFSET_Y}
      />
    </Fragment>
  );
});

export const PacManSprite: FC<{
  direction: Direction;
  phase: PacManPhase;
  x: number;
  y: number;
  style?: { [key: string]: any };
}> = ({ direction, phase, x, y, style }) => {
  return (
    <Sprite
      className="Sprite-pacman"
      name={`pacman-direction-${direction}-phase-${phase}`}
      x={x}
      y={y}
      style={style}
    />
  );
};

export type DyingPacManPhase = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export const DyingPacManPhases: DyingPacManPhase[] = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
];

export const DyingPacManSprite: FC<{
  phase: DyingPacManPhase;
  x: number;
  y: number;
  style?: { [key: string]: any };
}> = ({ phase, x, y, style }) => {
  return (
    <Sprite
      className="Sprite-dying-pacman"
      name={`dying-pacman-phase-${phase}`}
      x={x}
      y={y}
      style={style}
    />
  );
};

export const PacManHitBox: FC<{ x: number; y: number }> = ({ x, y }) => {
  const rect = getPacManHitBox(x, y);
  return <Box rect={rect} color="green" />;
};
