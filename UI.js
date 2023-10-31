import { DOM } from "./DOM.js";
import { Game } from "./game.js";
const dom = DOM();
const game = Game();

export function UI(player1, player2) {
  document.addEventListener("click", handleClick);

  function handleClick(event) {
    if (player2.ai) {
      vsComputer(event);
      return;
    }
    vsPlayer(event);
  }

  function vsPlayer(event) {
    // if click on square and game is not over
    // if player1 turns true
    // get coordinates of attack from square
    // receive attack
    // display misses or attack
    //check if game is over
    if (!eventValidity(event)) return;
    console.log("event valid");

    const coordinate = getCoordinate(event);
    if (!coordinate) return;
    console.log("coordinate valid");

    const round = game.loop(player1, player2, coordinate);
    if (!roundValidity(round)) return;
    console.log("round valid");

    if (round.winner) console.log(round.winner);
    player1.turn = round.player1turn;
    player2.turn = round.player2turn;

    dom.receiveAttack(event.target, round.result);
  }

  function vsComputer(event, player2turn = false) {
    if (!player2turn) {
      if (!eventValidity(event)) return;
      console.log("event valid");
    }

    const coordinate = getCoordinate(event);
    if (!coordinate) return;
    console.log("coordinate valid");
    const round = game.loopAgainstComputer(player1, player2, coordinate);
    dom.receiveAttack(event.target, round.player1result);
    const player2coordinate = player2.moves[player2.moves.length - 1];
    const player1Square = document.querySelector(
      `#player1 div[data-coordinate='${player2coordinate}']`
    );
    setTimeout(() => {
      dom.receiveAttack(player1Square, round.player2result);
    }, 1000);
    player1.turn = round.player1turn;
    player2.turn = round.player2turn;
    if (round.player2turn) setTimeout(() => vsComputer(event, true), 1500);
  }

  function roundValidity(round) {
    if (round === "please enter a new move") {
      return false;
    }
    return true;
  }

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
}
