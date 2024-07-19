import { DOM } from "./DOM.js";
import { Coordinate } from "./coordinate.js";
import { Game } from "./game.js";
import { Storage } from "./storage.js";
const dom = DOM();
const game = Game();
const storage = Storage();

export function UI(player1, player2) {
  document.addEventListener("click", handleClick);

  // player2.ai ? (player2.ai = false) : (player2.ai = true);

  function mainMenuButtons(event) {
    if (
      event.target.id != "vs-player-button" &&
      event.target.id != "vs-computer-button"
    )
      return;
    if (event.target.id == "vs-computer-button") player2.ai = true;
    const main = document.querySelector("main");
    main.classList.remove("main-menu-screen");
    main.innerHTML = "";
    storage.setCoordinates("player1", Coordinate().getDefault());
    storage.setCoordinates("player2", Coordinate().getDefault());
    placeShipsScreen("player1");
    state = "place ships";
  }

  function placeShipsScreen(player) {
    const renderTarget = "main";
    dom.renderControlsForPlacingShips(renderTarget);
    dom.renderGameboardForPlacingShips(renderTarget, player);
    console.log(player);
    const processedCoordinates = Coordinate().objectTo3DArray(
      storage.getCoordinates(player)
    );
    dom.renderShips(processedCoordinates, player);
  }

  function selectShip(event, player) {
    if (!event.target.classList.contains("ship")) return;
    let size = event.target.dataset.size;
    const selectedShip = storage.getCoordinates(player)[size];
    storage.setSelectedShipSize(size);
    dom.renderSelectedShip(selectedShip, player);
    console.log("ship selected");
  }

  function rotateShip(event, player) {
    if (event.target.id != "rotate-button") return;
    let size = storage.getSelectedShipSize();
    const playerShip = storage.getCoordinates(player)[size];
    const rotatedCoordinates = Coordinate().rotate(playerShip);
    console.log(playerShip, rotatedCoordinates);
    if (!Coordinate().isInBounds(rotatedCoordinates)) return;
    const fleetObject = storage.getCoordinates(player);
    const collision = Coordinate().isColliding(
      fleetObject,
      rotatedCoordinates,
      size
    );
    if (collision) return;
    const newPlayerCoordinates = storage.getCoordinates(player);
    newPlayerCoordinates[size] = rotatedCoordinates;
    storage.setCoordinates(player, newPlayerCoordinates);
  }

  function translateShip(event, player) {
    // take size, get gameboard coordinates of that size, transform coordinates, set gameboard coordinates of that size, rerender selected ships new position,
    if (event.target.id != "translate-button") return;
    const axis = +event.target.dataset.axis;
    const translateValue = +event.target.dataset["translateValue"];
    const size = storage.getSelectedShipSize();
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

  let state = "start game";
  let playerWhoIsPlacing = "player1";

  function handleClick(event) {
    mainMenuButtons(event);
    if (state == "place ships") {
      selectShip(event, playerWhoIsPlacing);
      translateShip(event, playerWhoIsPlacing);
      rotateShip(event, playerWhoIsPlacing);
      dom.removeGameboard(playerWhoIsPlacing);
      placeShipsButton(event, playerWhoIsPlacing);
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
      if (state == "game is live") startGame();
    }

    if (state == "game is live") {
      if (player2.ai) {
        vsComputer(event);
        return;
      }
      vsPlayer(event);
    }
  }

  let player1turn = true;
  function vsPlayer(event) {
    // should decide players based off player1 and player2, not by dom
    // click -> validate -> check turn to assign playerReceiving -> run gameloop ->
    //when clicking on invalid coordinate, turns get fucked up
    if (!eventValidity(event)) return;
    console.log("event valid");

    const coordinate = getCoordinate(event);
    if (!coordinate) return;
    console.log("coordinate valid");

    let playerAttacking;
    let playerReceiving;

    if (player1turn) {
      playerAttacking = player1;
      playerReceiving = player2;
      console.log("p1turn ", player1turn);
    } else {
      playerAttacking = player2;
      playerReceiving = player1;
      console.log("p1turn ", player1turn);
    }

    if (!playerAttacking.isNovelMove(coordinate)) {
      console.log(playerAttacking);
      dom.announce("Please enter a new move");
      return;
    }

    player1turn ? (player1turn = false) : (player1turn = true);
    const round = {};

    playerAttacking.moves.push(coordinate);
    round.result = playerReceiving.gameboard.receiveAttack(coordinate);
    if (round.result === "hit")
      round.sunkShip = playerReceiving.gameboard.getShip(coordinate).isSunk();
    if (playerReceiving.gameboard.areAllShipsSunk()) {
      round.winner = playerAttacking.name + " WINS";
    }

    dom.renderShips(
      playerAttacking.gameboard.shipCoordinates,
      playerAttacking.name
    );
    dom.clearGameboard(playerReceiving.name);
    dom.renderGameboard(playerReceiving.name);
    dom.addClassToCoordinates(
      playerReceiving.gameboard.hits,
      "hit",
      playerReceiving.name
    );
    dom.addClassToCoordinates(
      playerReceiving.gameboard.misses,
      "miss",
      playerReceiving.name
    );
    dom.addClassToCoordinates(
      playerReceiving.gameboard.getSunkShipsCoordinates(),
      "sunk",
      playerReceiving.name
    );
    dom.announce(playerAttacking.name + " " + round.result);
    if (round.sunkShip) dom.announce(playerAttacking.name + " " + "sunk ship");
    if (round.winner) {
      dom.announce(round.winner);
      state = "game over";
    }
  }
  // todo: turn vs computer to use turns
  function vsComputer(event) {
    if (!eventValidity(event)) return;
    console.log("event valid");

    const coordinate = Coordinate().toArray(event.target.id.slice(-3));
    if (!coordinate) return;
    console.log("coordinate valid");

    const round = game.loopAgainstComputer(player1, player2, coordinate);

    if (round.error) {
      dom.announce(round.error);
      return;
    }

    dom.addClassToCoordinates(player2.gameboard.hits, "hit", "player2");
    dom.addClassToCoordinates(player2.gameboard.misses, "miss", "player2");
    dom.addClassToCoordinates(
      player2.gameboard.getSunkShipsCoordinates(),
      "sunk",
      "player2"
    );
    dom.announce("Player 1 " + round.player1result);
    if (round.player1SunkShip) dom.announce("Player 1 sunk ship");
    if (round.winner) dom.announce(round.winner);

    document.removeEventListener("click", handleClick);
    // hopefully be able to play a round just with this one func
    if (player2.ai && !round.winner) {
      setTimeout(() => {
        dom.addClassToCoordinates(player1.gameboard.hits, "hit", "player1");
        dom.addClassToCoordinates(player1.gameboard.misses, "miss", "player1");
        dom.addClassToCoordinates(
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
  }

  function eventValidity(event) {
    if (!event.target.classList.contains("square")) return false;
    if (event.target.id.slice(0, 7) == "player2" && player1turn) return true;
    if (event.target.id.slice(0, 7) == "player1" && !player1turn) return true;
    return false;
  }

  function getCoordinate(event) {
    const dataCoordinate = event.target.id.slice(-3);
    const coordinate = [+dataCoordinate[0], +dataCoordinate[2]];
    return coordinate;
  }

  function startGame() {
    const player1FleetArray = Coordinate().objectTo3DArray(
      storage.getCoordinates("player1")
    );
    const player2FleetArray = Coordinate().objectTo3DArray(
      storage.getCoordinates("player2")
    );
    // add player ships to the gameboard
    for (let i = 0; i < player1FleetArray.length; i++) {
      player1.gameboard.placeShip(...player1FleetArray[i]);
      player2.gameboard.placeShip(...player2FleetArray[i]);
    }
    console.log(
      player1.gameboard.shipCoordinates,
      player2.gameboard.shipCoordinates
    );
    dom.initializeGame();
    dom.renderGameboard("player1");
    dom.renderShips(player1.gameboard.shipCoordinates, "player1");
    dom.renderGameboard("player2");
  }

  function placeShipsButton(event, player) {
    if (event.target.id != "place-ships-button") return;
    if (player == "player1") {
      playerWhoIsPlacing = "player2";
      console.log(playerWhoIsPlacing, state);
      return;
    }
    state = "game is live";
    console.log(player);
  }
}
