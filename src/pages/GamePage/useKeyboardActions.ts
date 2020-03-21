/* eslint-disable jsx-a11y/anchor-is-valid */
import { useCallback, useEffect } from 'react';
import { Store } from '../../lib/Store';

/* eslint-disable  react-hooks/exhaustive-deps */
export const useKeyboardActions = (store: Store): void => {
  const onKeyDown = useCallback((event: KeyboardEvent) => {
    const { game } = store;
    const pressedKey = event.key;
    const pacMan = game.pacMan;
    switch (pressedKey) {
      case 'ArrowLeft':
        pacMan.setNextDirection('LEFT');
        break;
      case 'ArrowRight':
        pacMan.setNextDirection('RIGHT');
        break;
      case 'ArrowUp':
        pacMan.setNextDirection('UP');
        break;
      case 'ArrowDown':
        pacMan.setNextDirection('DOWN');
        break;
      case ' ':
        game.toggleGamePaused();
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  });
};
