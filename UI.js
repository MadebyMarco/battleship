import { DOM } from "./DOM.js";
import { Coordinate } from "./coordinate.js";
import { Game } from "./game.js";
const dom = DOM();
const game = Game();

export function UI(player1, player2) {
  document.addEventListener("click", handleClick);
  document.querySelector(".ai-slider").addEventListener("click", () => {
    document.querySelector(".ai-slider").classList.toggle("off");
    document.querySelector(".slider-circle").classList.toggle("off");
  });

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

  function vsComputer(event) {
    if (!eventValidity(event)) return;
    console.log("event valid");

    const coordinate = Coordinate().toArray(event.target.dataset.coordinate);
    if (!coordinate) return;
    console.log("coordinate valid");

    const round = game.loopAgainstComputer(player1, player2, coordinate);

    if (round.error) {
      dom.announce(round.error);
      return;
    }

    dom.renderResultsOfAttack(player2.gameboard.hits, "hit", "player2");
    dom.renderResultsOfAttack(player2.gameboard.misses, "miss", "player2");
    dom.renderResultsOfAttack(
      player2.gameboard.getSunkShipsCoordinates(),
      "sunk",
      "player2"
    );
    dom.announce("Player 1 " + round.player1result);
    if (round.player1SunkShip) dom.announce("Player 1 sunk ship");
    if (round.winner) dom.announce(round.winner);

    document.removeEventListener("click", handleClick);

    setTimeout(() => {
      dom.renderResultsOfAttack(player1.gameboard.hits, "hit", "player1");
      dom.renderResultsOfAttack(player1.gameboard.misses, "miss", "player1");
      dom.renderResultsOfAttack(
        player1.gameboard.getSunkShipsCoordinates(),
        "sunk",
        "player1"
      );
      dom.announce("Player 2 " + round.player2result);
      if (round.player2SunkShip) dom.announce("Player 2 sunk ship");
      if (round.winner) dom.announce(round.winner);
      document.addEventListener("click", handleClick);
    }, 2000);
  }

  function roundValidity(round) {
    if (round.error === "Please enter a new move") {
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

  function getPlayerShipCoordinates() {
    // todo
    // create gameboard to get player coordinates
    // I think if each rendered ship had classes associated with them, it would be easier to find
    // Need to create these x buttons, y buttons, rotate button, place button
    // This top half should be in DOM.js
    // click start -> creates gameboard with ships placed
    // click on ship -> find other divs with same ship class and select them as current ship
    // click on arrow -> change x or y value depending on the arrow direction
    // click on rotate -> use the first coordinate as an anchor, if the ship is vertical, change coordinates from change in y to change in x relative to anchors position, if the ship is horizontal, change coordinates from change in x to change in y relative to anchors position.
  }
}
