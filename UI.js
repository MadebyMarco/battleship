import { DOM } from "./DOM.js";
import { Coordinate } from "./coordinate.js";
import { Storage } from "./storage.js";
const dom = DOM();
const storage = Storage();

export function UI(player1, player2) {
  document.addEventListener("click", handleClick);
  let previousHover;
  let dragOverCoordinate;
  document.addEventListener("dragover", (event) => {
    if (!event.target.classList.contains("square")) return;
    if (previousHover == event.target) return;
    previousHover = event.target;
    dragOverCoordinate = getCoordinate(event);
  });
  document.addEventListener("dragend", (event) => {
    if (!event.target.classList.contains("ship")) return;
    selectShip(event, playerWhoIsPlacing);
    translateShip(event, playerWhoIsPlacing);
    dom.removeGameboard(playerWhoIsPlacing);
    dom.renderGameboardForPlacingShips("main", playerWhoIsPlacing);
    const processedCoordinates = Coordinate().objectTo3DArray(
      storage.getCoordinates(playerWhoIsPlacing)
    );
    dom.renderShips(processedCoordinates, playerWhoIsPlacing);
    dom.addClassToCoordinates(
      storage.getCoordinates(playerWhoIsPlacing)[storage.getSelectedShipSize()],
      "selected",
      playerWhoIsPlacing
    );
  });

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
    dom.addClassToCoordinates(selectedShip, "selected", player);
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
    if (
      event.target.id == "vs-player-button" ||
      event.target.id == "vs-computer-button"
    )
      state = "place ships";
    if (state == "place ships") {
      selectShip(event, playerWhoIsPlacing);
      translateShip(event, playerWhoIsPlacing);
      rotateShip(event, playerWhoIsPlacing);
      dom.removeGameboard(playerWhoIsPlacing);
      placeShipsButton(event, playerWhoIsPlacing);

      if (playerWhoIsPlacing === "None") {
        state = "game is live";
        startGame();
        return;
      }

      dom.renderGameboardForPlacingShips("main", playerWhoIsPlacing);
      const processedCoordinates = Coordinate().objectTo3DArray(
        storage.getCoordinates(playerWhoIsPlacing)
      );
      dom.renderShips(processedCoordinates, playerWhoIsPlacing);
      dom.addClassToCoordinates(
        storage.getCoordinates(playerWhoIsPlacing)[
          storage.getSelectedShipSize()
        ],
        "selected",
        playerWhoIsPlacing
      );
    }

    if (state == "game is live") {
      if (player2.ai) {
        if (!eventValidity(event)) return;
        console.log("event valid");
        const coordinate = getCoordinate(event);
        console.log("testing coordinate...");
        if (coordinate.length <= 0) return;
        console.log("coordinate valid");
        vsComputer(coordinate);
        console.log("vs ai");
        return;
      }
      // run first round, show result of attack, pop up screen, click pop up screen button that says players have switched,
      console.log("testing event...");
      switchTurnButton(event);
      if (!eventValidity(event)) return;
      console.log("event valid");
      const coordinate = getCoordinate(event);
      console.log("testing coordinate...");
      if (coordinate.length <= 0) return;
      console.log("coordinate valid");
      vsPlayer(coordinate);
      console.log(event);
    }
  }

  let player1turn = true;
  function vsPlayer(coordinate) {
    // should decide players based off player1 and player2, not by dom
    // click -> validate -> check turn to assign playerReceiving -> run gameloop ->

    let playerAttacking = player1;
    let playerReceiving = player2;

    if (!player1turn) {
      playerAttacking = player2;
      playerReceiving = player1;
    }

    if (!playerAttacking.isNovelMove(coordinate)) {
      console.log(playerAttacking);
      dom.announce("Please enter a new move");
      return;
    }

    player1turn ? (player1turn = false) : (player1turn = true);
    playerAttacking.moves.push(coordinate);

    const round = {};
    round.result = playerReceiving.gameboard.receiveAttack(coordinate);

    if (round.result === "hit")
      round.sunkShip = playerReceiving.gameboard.getShip(coordinate).isSunk();

    if (playerReceiving.gameboard.areAllShipsSunk()) {
      round.winner = playerAttacking.name + " WINS";
    }

    dom.rerenderGameboardWithResults(playerReceiving);
    dom.announce(playerAttacking.name + " " + round.result);
    if (round.sunkShip) dom.announce(playerAttacking.name + " " + "sunk ship");
    if (round.winner) {
      dom.announce(round.winner);
      state = "game over";
    }
    setTimeout(() => {
      // now create a popup screen after vs player, make these functions run when that pop up screen's button is pressed
      dom.renderSwitchTurnScreen(playerReceiving.name);
    }, 2000);
  }

  function switchTurnButton(event) {
    if (event.target.id != "switch-turn-button") return;
    document.getElementById("switch-turn-screen").remove();

    let playerAttacking = player1;
    let playerReceiving = player2;

    if (!player1turn) {
      playerAttacking = player2;
      playerReceiving = player1;
    }

    dom.rerenderGameboardWithResults(playerAttacking);
    dom.rerenderGameboardWithResults(playerReceiving);
    dom.renderShips(
      playerAttacking.gameboard.shipCoordinates,
      playerAttacking.name
    );
  }
  // todo: turn vs computer to use turns
  function vsComputer(coordinate, aiTurn = false) {
    // const round = game.loopAgainstComputer(player1, player2, coordinate);
    console.log(coordinate);
    let playerAttacking = player1;
    let playerReceiving = player2;

    if (!player1turn) {
      playerAttacking = player2;
      playerReceiving = player1;
    }
    console.log(playerAttacking, playerReceiving);

    if (!playerAttacking.isNovelMove(coordinate)) {
      console.log(playerAttacking);
      dom.announce("Please enter a new move");
      return;
    }

    player1turn ? (player1turn = false) : (player1turn = true);
    playerAttacking.moves.push(coordinate);

    const round = {};
    round.result = playerReceiving.gameboard.receiveAttack(coordinate);

    if (round.result === "hit")
      round.sunkShip = playerReceiving.gameboard.getShip(coordinate).isSunk();

    if (playerReceiving.gameboard.areAllShipsSunk()) {
      round.winner = playerAttacking.name + " WINS";
    }

    dom.rerenderGameboardWithResults(playerReceiving);
    dom.renderShips(player1.gameboard.shipCoordinates, "player1");
    dom.announce(playerAttacking.name + " " + round.result);
    if (round.sunkShip) dom.announce(playerAttacking.name + " " + "sunk ship");
    if (round.winner) {
      dom.announce(round.winner);
      state = "game over";
    }

    document.removeEventListener("click", handleClick);
    // hopefully be able to play a round just with this one func
    if (!aiTurn && !round.winner) {
      setTimeout(() => {
        const coordinate = player2.getAttack();
        console.log("player2attack", coordinate);
        vsComputer(coordinate, true);
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
    if (Number.isNaN(coordinate[0]) || Number.isNaN(coordinate[1])) return [];
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
    playerWhoIsPlacing = "None";
    console.log(playerWhoIsPlacing);
  }
}
