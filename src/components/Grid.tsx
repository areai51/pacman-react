import React, { FC, useState, Fragment } from 'react';
import {
  TILE_SIZE,
  TileCoordinates,
  ScreenCoordinates,
} from '../lib/Coordinates';

import './Grid.css';
import { waysMatrix, getPillsMatrix } from '../lib/MazeData';

const ROWS = 31;
const COLUMNS = 28;

export const GridWithHoverCoordinates: FC<{
  screenCoordinates: ScreenCoordinates;
  onClick?: (
    coordinates: TileCoordinates,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void; // eslint-disable-next-line @typescript-eslint/no-empty-function
}> = ({ screenCoordinates, onClick }) => {
  const [coordinates, setCoordinates] = useState<TileCoordinates | null>(null);
  const pillsMatrix = getPillsMatrix();
  const { x, y } = screenCoordinates;
  return (
    <Fragment>
      <Grid x={x} y={y} onHover={setCoordinates} onClick={onClick} />
      <div
        style={{
          position: 'absolute',
          left: `${x}px`,
          top: `${y + ROWS * TILE_SIZE}px`,
          height: '20px',
        }}
      >
        {coordinates &&
          `${coordinates.x} / ${coordinates.y} - ways layer id: ${
            waysMatrix[coordinates.y][coordinates.x]
          } - pills layer id: ${
            pillsMatrix[coordinates.y][coordinates.x]
          }`}{' '}
        &nbsp;
      </div>
    </Fragment>
  );
};

export const Grid: FC<{
  x: number;
  y: number;
  onClick?: (
    coordinates: TileCoordinates,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
  onHover: (coordinates: TileCoordinates | null) => void;
}> = ({ x, y, onClick, onHover }) => {
  return (
    <div
      className={'Grid'}
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        gridTemplateColumns: `repeat(${COLUMNS}, ${TILE_SIZE}px)`,
        gridTemplateRows: `repeat(${ROWS}, ${TILE_SIZE}PX)`,
      }}
    >
      {Array(ROWS)
        .fill(null)
        .map((_, rowIndex) =>
          Array(COLUMNS)
            .fill(null)
            .map((_, columnIndex) => (
              <div
                className="GridCell"
                key={`${columnIndex}/${rowIndex}`}
                onClick={(
                  event: React.MouseEvent<HTMLDivElement, MouseEvent>
                ) => {
                  if (onClick) {
                    onClick({ x: columnIndex, y: rowIndex }, event);
                  }
                }}
                onMouseEnter={() => onHover({ x: columnIndex, y: rowIndex })}
                onMouseLeave={() => onHover(null)}
              />
            ))
        )}
    </div>
  );
};
