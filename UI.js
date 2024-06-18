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

  function placeShipsScreen(event, player) {
    if (!event.target.classList.contains("startButton")) return;
    event.target.remove();
    const renderTarget = "main";
    document.querySelector(renderTarget).classList.add("place-ships-screen");
    storage.setCoordinates(player, Coordinate().getDefault());
    dom.renderControlsForPlacingShips(renderTarget);
    dom.renderGameboardForPlacingShips(renderTarget, player);
    const processedCoordinates = Coordinate().objectTo3DArray(
      storage.getCoordinates("player1")
    );
    dom.renderShips(processedCoordinates, "player1");
  }

  function selectShip(event, player) {
    // selectShip should be a dom function that removes and places new ships using size arg
    // selectShipFromEvent should be a function that verifies its a ship, and retrieves the dataset size to then use into selectShip
    if (!event.target.classList.contains("ship")) return;
    //document
    //.querySelectorAll(".selected")
    //.forEach((ship) => ship.classList.remove("selected"));

    let size = event.target.dataset.size;
    const selectedShip = storage.getCoordinates(player)[size];
    storage.setSelectedShipSize(size);
    //should have storage func outside of this

    selectedShip.forEach((coordinate) => {
      document
        .querySelector(`.ship[data-coordinate="${coordinate}"]`)
        .classList.add("selected");
    });
    console.log("ship selected");

    // /////////////////////////

    // this should be two functions, one to remove and one to add
    // also should be in dom
    // and make getSelectedShipSize that would be good/ wrote would be good but not for what so now im not sure what i wanted it for
  }
  function rotateShip(event, player) {
    if (event.target != document.getElementById("rotate")) return;
    let size = storage.getSelectedShipSize();
    const playerShip = storage.getCoordinates(player)[size];
    const rotatedCoordinates = Coordinate().rotate(playerShip);
    console.log(playerShip, rotatedCoordinates);
    if (!Coordinate().isInBounds(rotatedCoordinates)) return;
    // needs collision check
    const fleetObject = storage.getCoordinates(player);
    // removing ship prevents collision check on itself
    fleetObject[size] = [];
    console.log(fleetObject);
    const fleetArray = Coordinate().objectTo3DArray(fleetObject);
    for (let i = 0; i < rotatedCoordinates.length; i++) {
      const index = Coordinate().getShipIndexInFleet(
        fleetArray,
        rotatedCoordinates[i]
      );
      if (index != false) return;
    }
    const newPlayerCoordinates = storage.getCoordinates(player);
    newPlayerCoordinates[size] = rotatedCoordinates;
    storage.setCoordinates(player, newPlayerCoordinates);
  }

  function translateShip(event, player) {
    // take size, get gameboard coordinates of that size, transform coordinates, set gameboard coordinates of that size, rerender selected ships new position,
    if (event.target.dataset["axis"] == undefined) return;
    const axis = +event.target.dataset.axis;
    const translateValue = +event.target.dataset["translateValue"];
    const size = storage.getSelectedShipSize();
    // maybe set/get to placeScreenCoordinates and once place is pressed, player1/2 coordinates = placeScreenCoordinates
    const playerCoordinates = storage.getCoordinates(player);
    const newShipCoordinates = Coordinate().translate(
      playerCoordinates[size],
      axis,
      translateValue
    );
    const fleetObject = storage.getCoordinates(player);
    const collision = Coordinate().isColliding(
      fleetObject,
      newShipCoordinates,
      size
    );
    if (collision) return;
    playerCoordinates[size] = newShipCoordinates;
    storage.setCoordinates(player, playerCoordinates);
    console.log("ship translated");
  }
  let state = "place ships";
  let playerWhoIsPlacing = "player1";
  // reassign playerWhoIsPlacing once place ships button is pressed
  // if place ships button is pressed and playerwhoIsplacing is player 2, start game :)
  // ui function runs once on load
  console.log("UI", state);
  // handle drag by hovering over coordinate, making a using middle as point, rendering out coordinates in bound over the gameboard,
  function handleClick(event) {
    placeShipsScreen(event);
    if (state == "place ships") {
      selectShip(event, playerWhoIsPlacing);
      translateShip(event, playerWhoIsPlacing);
      rotateShip(event, playerWhoIsPlacing);
      dom.removeGameboard(playerWhoIsPlacing);
      dom.renderGameboardForPlacingShips("main", playerWhoIsPlacing);
      const processedCoordinates = Coordinate().objectTo3DArray(
        storage.getCoordinates(playerWhoIsPlacing)
      );
      dom.renderShips(processedCoordinates, playerWhoIsPlacing);
      dom.renderSelectedShip(
        storage.getCoordinates(playerWhoIsPlacing)[
          storage.getSelectedShipSize()
        ],
        playerWhoIsPlacing
      );
    }
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
