export const game_state = {
  MENU: "Menu",

  PLAYING: "Playing",

  CALIBRATING: "Calibrating",
};

export let currentGameState = game_state.MENU;

export function setGameState(newState) {
  currentGameState = newState;
}

export function getCurrentGameState() {
  return currentGameState;
}
