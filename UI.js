import { DOM } from "./DOM.js";
import { Coordinate } from "./coordinate.js";
import { Game } from "./game.js";
import { Storage } from "./storage.js";
const dom = DOM();
const game = Game();
const storage = Storage();

export function UI(player1, player2) {
  document.addEventListener("click", handleClick);

  document.querySelector(".ai-slider").addEventListener("click", () => {
    document.querySelector(".ai-slider").classList.toggle("off");
    document.querySelector(".slider-circle").classList.toggle("off");
  });
  // todo
  // click on arrow -> change x or y value depending on the arrow direction
  // click on rotate -> use the first coordinate as an anchor, if the ship is vertical, change coordinates from change in y to change in x relative to anchors position, if the ship is horizontal, change coordinates from change in x to change in y relative to anchors position.
  // Need to create these x buttons, y buttons, rotate button, place button

  function placeShipsScreen(event) {
    if (!event.target.classList.contains("startButton")) return;
    event.target.remove();
    const renderTarget = "main";
    document.querySelector(renderTarget).classList.add("place-ships-screen");
    storage.setCoordinates(1, Coordinate().getDefault());
    dom.renderControlsForPlacingShips(renderTarget);
    dom.renderGameboardForPlacingShips(renderTarget, "player1");
    const processedCoordinates = Coordinate().objectTo3DArray(
      storage.getCoordinates(1)
    );
    dom.renderShips(processedCoordinates, "player1");
  }

  function selectShip(event) {
    // selectShip should be a dom function that removes and places new ships using size arg
    // selectShipFromEvent should be a function that verifies its a ship, and retrieves the dataset size to then use into selectShip
    if (!event.target.classList.contains("ship")) return;
    document
      .querySelectorAll(".selected")
      .forEach((ship) => ship.classList.remove("selected"));

    let size = event.target.dataset.size;
    const selectedShip = storage.getCoordinates(1)[size];
    storage.setSelectedShip(size);

    selectedShip.forEach((coordinate) => {
      document
        .querySelector(`.ship[data-coordinate="${coordinate}"]`)
        .classList.add("selected");
    });

    // /////////////////////////

    // this should be two functions, one to remove and one to add
    // also should be in dom
    // and make getSelectedShipSize that would be good/ wrote would be good but not for what so now im not sure what i wanted it for
  }

  function translateShip(event) {
    // take size, get gameboard coordinates of that size, transform coordinates, set gameboard coordinates of that size, rerender selected ships new position,
    if (!document.querySelector(".selected")) return;
    if (!event.target.dataset.axis === undefined) return;
    const axis = +event.target.dataset.axis;
    const translateValue = +event.target.dataset["translateValue"];
    const selectedShip = document.querySelector(".selected");
    const size = selectedShip.dataset.size;
    const playerCoordinates = storage.getCoordinates(1);
    const newShipCoordinates = Coordinate().translate(
      playerCoordinates[size],
      axis,
      translateValue
    );
    playerCoordinates[size] = newShipCoordinates;
    storage.setCoordinates(1, playerCoordinates);
    // below this line should be in dom
    document
      .querySelectorAll(".ship")
      .forEach((ship) =>
        ship.classList.remove("ship", "vertical", "stern", "bow", "selected")
      );
    newShipCoordinates.forEach((coordinate) =>
      document
        .querySelector(`div[data-coordinate = "${coordinate}" ]`)
        .classList.add("selected")
    );
    dom.renderShips(Coordinate().objectTo3DArray(playerCoordinates), "player1");
  }

  function handleClick(event) {
    placeShipsScreen(event);
    selectShip(event);
    translateShip(event);
    // maybe get the players move on the button, send that to renderShip, rerender the ships but send the new coordinates with the input from the user, so if the coordinates are 0,1 0,2 and he hits x up, put 1,1 and 1,2 into placeShips
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
}
