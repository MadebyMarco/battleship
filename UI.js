import { DOM } from "./DOM.js";
import { Game } from "./game.js";
const dom = DOM();
const game = Game();

export function UI() {
  let coordinate;
  let gameboard;

  document.addEventListener("click", (event) => {
    // if click on square and game is not over
    // if player1 turns true
    // get coordinates of attack from square
    // receive attack
    // display misses or attack
    //check if game is over
    if (!eventValidity(event)) return;
    coordinate = getCoordinate(event);
    gameboard = event.target.closest(".gameboard");
  });

  function getCoordinate(event) {
    const dataCoordinate = event.target.dataset.coordinate;
    const coordinate = [+dataCoordinate[0], +dataCoordinate[2]];
    return coordinate;
  }
  function eventValidity(event) {
    if (!event.target.classList.contains("square")) return false;
    return true;
  }

  function getRoundInfo() {
    return { coordinate, gameboard };
  }

  return { getRoundInfo };
}
