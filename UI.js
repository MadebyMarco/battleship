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
    player2.ai ? (player2.ai = false) : (player2.ai = true);
    console.log(player2.ai);
    document.querySelector(".ai-slider").classList.toggle("off");
    document.querySelector(".slider-circle").classList.toggle("off");
  });

  function startButton(event) {
    if (event.target.id != "startButton") return;
    event.target.remove();
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
    if (event.target != document.getElementById("rotate")) return;
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
    if (event.target.dataset["axis"] == undefined) return;
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
    startButton(event);
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
    }
    if (state == "game is live") {
      if (player2.ai) {
        vsComputer(event);
        return;
      }
      vsPlayer(event);
    }
  }

  function vsPlayer(event) {
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

    const coordinate = Coordinate().toArray(event.target.id.slice(-3));
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
    const dataCoordinate = event.target.id.slice(-3);
    const coordinate = [+dataCoordinate[0], +dataCoordinate[2]];
    return coordinate;
  }

  function startGame() {
    // remove placeships screen
    dom.removeGameboard("player1");

    // set player gameboards
  }
  function placeShipsButton(event, player) {
    if (event.target.id != "placeShipsButton") return;
    if (player == "player1") {
      playerWhoIsPlacing = "player2";
      return;
    }
    startGame();
    console.log(player);
  }
}
