import { DOM } from "./DOM.js";
import { Game } from "./game.js";
const dom = DOM();
const game = Game();

function eventValidity(event) {
  if (event.target.closest("#player1") && player1.turn) return false;
  if (event.target.closest("#player2") && player2.turn) return false;
  if (!event.target.classList.contains("square")) return false;
  return true;
}

function getCoordinate(event) {
  const dataCoordinate = event.target.dataset.coordinate;
  const coordinate = [+dataCoordinate[0], +dataCoordinate[2]];
  return coordinate;
}

export function UI(player1, player2) {
  document.addEventListener("click", (event) => {
    // if click on square and game is not over
    // if player1 turns true
    // get coordinates of attack from square
    // receive attack
    // display misses or attack
    //check if game is over
    if (!eventValidity(event)) return;
    const coordinate = getCoordinate(event);
    if (!coordinate) return;
    const round = game.loop(player1, player2, coordinate);
    console.log(round);
    dom.receiveAttack(event.target, round.result);
    if (round.winner) console.log(round.winner);
    player1.setTurn(round.player1turn);
    player2.setTurn(round.player2turn);
  });
}
