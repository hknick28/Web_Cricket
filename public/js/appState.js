export const game_state = {
  MENU: "Menu",

  PLAYING: "Playing",

  CALIBRATING: "Calibrating",

  GAME_OVER: "Game Over",
};

export let currentGameState = game_state.MENU;

export function setGameState(newState) {
  currentGameState = newState;

  const gameOverContainer = document.getElementById("gameOverModal");
  if (gameOverContainer) {
    gameOverContainer.style.display =
      newState === game_state.GAME_OVER ? "flex" : "none";
  }
}

export function getCurrentGameState() {
  return currentGameState;
}
