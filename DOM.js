import { Coordinate } from "./coordinate.js";
export function DOM() {
  function createElements(element, quantity = 10, callbackFn) {
    const nodeArray = [];
    for (let counter = 0; counter < quantity; counter++) {
      const currentElement = document.createElement(element);
      if (callbackFn) callbackFn(currentElement);
      nodeArray.push(currentElement);
    }
    return nodeArray;
  }

  function setCoordinates(nodes, maxYAxis = 9, player) {
    let xAxis = 0;
    let yAxis = maxYAxis;
    const coordinateNodes = [...nodes];
    coordinateNodes.forEach((node) => {
      if (xAxis > maxYAxis) {
        xAxis = 0;
        yAxis = yAxis - 1;
      }
      node.id = player + "-" + [xAxis, yAxis];
      xAxis++;
    });
    return coordinateNodes;
  }

  function createGameboard(callbackFn, player = "player1") {
    const gameboardNodes = createElements("div", 100, callbackFn);
    const coordinateNodes = setCoordinates(gameboardNodes, 9, player);
    return coordinateNodes;
  }

  function gameboardSettings(element) {
    element.classList.add("square");
  }

  function receiveAttack(element, result) {
    if (result == "hit") element.classList.add("hit");
    if (result == "miss") element.classList.add("miss");
  }
  // stern: back of boat
  // bow: front of boat
  function placeShip(elements, isSecondSize3Ship = false) {
    let orientation = Coordinate().getOrientation([
      elements[0].id.slice(-3),
      elements[1].id.slice(-3),
    ]);
    // size code should not be here
    // todo: instead of isSecond3Ship, use size parameter
    let shipSize = "size-" + elements.length;
    if (isSecondSize3Ship && elements.length == 3) shipSize = "size-3-2";
    for (let index = 0; index < elements.length; index++) {
      if (index == 0) elements[index].classList.add("stern");
      if (index == elements.length - 1) elements[index].classList.add("bow");
      elements[index].classList.add(orientation);
      elements[index].classList.add("ship");
      elements[index].dataset.size = shipSize;
    }
  }

  function getShipElement(coordinate, player) {
    return document.getElementById(player + "-" + coordinate);
  }

  function getShipElements(coordinates, player) {
    const shipElements = [];
    for (let index = 0; index < coordinates.length; index++) {
      const currentCoordinate = coordinates[index];
      const currentShipElement = getShipElement(currentCoordinate, player);
      shipElements.push(currentShipElement);
    }
    return shipElements;
  }

  function renderSelectedShip(coordinates, player) {
    const shipElements = getShipElements(coordinates, player);
    for (let i = 0; i < shipElements.length; i++) {
      shipElements[i].classList.add("selected");
    }
  }
  // render out ships
  function renderShips(shipCoordinates, player) {
    //
    let isSecondSize3Ship = false;
    // uses isSecondSize3Ship to add class "size-3-2" to identify the two separately
    shipCoordinates.forEach((coordinate) => {
      placeShip(getShipElements(coordinate, player), isSecondSize3Ship);
      if (coordinate.length == 3 && !isSecondSize3Ship)
        isSecondSize3Ship = true;
    });
    //apply placeSHip func to each set of coordinates
  }

  function addClassToCoordinates(
    // this shouldnt check for classList contains because it shouldnt exist, it should be freshly rendered
    coordinates = [],
    className,
    player = "player1"
  ) {
    for (let index = 0; index < coordinates.length; index++) {
      const currentCoordinate = coordinates[index];
      const square = getShipElement(currentCoordinate, player);
      square.classList.add(`${className}`);
    }
  }

  function clearResults(className, player) {
    // loops twice through arrays, combine into one
    const elements = document.querySelectorAll(`#${player} ${className}`);
    for (let index = 0; index < elements.length; index++) {
      const currentElement = elements[index];
      currentElement.classList.remove(`${className}`);
    }
  }

  function announce(message = "Player 1's turn") {
    document.querySelector(".announcements").textContent = message;
  }

  function renderGameboard(player) {
    const gameboard = document.querySelector("#" + player + ".gameboard");
    gameboard.append(...createGameboard(gameboardSettings, player));
  }

  function renderPlayerGameboard(playerShips, player) {
    // problem with this function is that it expect theres to be an empty gameboard div instead of ret
    const gameboard = document.querySelector("#" + player + ".gameboard");
    gameboard.append(...createGameboard(gameboardSettings, player));
    renderShips(playerShips, player);
  }

  function renderModelShips(player) {
    const shipSection = document.querySelector("#" + player + ".ships");
    const shipSizesClass = ["size-2", "size-3-2", "size-3", "size-4", "size-5"];
    const shipContainers = createElements("div", 5, (container) => {
      container.classList.add("model-ship-container");
      container.classList.add("model-ship-" + shipSizesClass.pop());
    });
    const shipSizes = [5, 4, 3, 3, 2];
    for (let i = 0; i < 5; i++) {
      // adds model ship square class to each ship in a container
      shipContainers[i].append(
        ...createElements("div", shipSizes[i], (ship) =>
          ship.classList.add("model-ship-square")
        )
      );
      shipSection.append(shipContainers[i]);
    }
  }

  function initializeGame() {
    const main = document.querySelector("main");
    main.classList.remove("place-ships-screen");
    main.classList.add("game-is-live-screen");
    main.innerHTML = `
      <h2 class="announcements"></h2>
      <div id="player1" class="section">
        <div class="ships" id="player1"></div>
        <div class="gameboard" id="player1"></div>
      </div>
      <div id="player2" class="section">
        <div class="gameboard" id="player2"></div>
        <div class="ships" id="player2"></div>
      </div> `;
  }

  function renderGameboardForPlacingShips(renderTarget = "main", player) {
    const gameboard = document.createElement("div");
    gameboard.classList.add("gameboard");
    gameboard.id = player;
    gameboard.append(...createGameboard(gameboardSettings, player));
    document.querySelector(renderTarget).append(gameboard);
  }

  function removeGameboard(player) {
    document.querySelector(`#${player}.gameboard`).remove();
  }

  function clearGameboard(player) {
    document.querySelector(`#${player}.gameboard`).innerHTML = "";
  }

  function renderControlsForPlacingShips(renderTarget = "main") {
    const main = document.querySelector(renderTarget);
    main.classList.add("place-ships-screen");
    main.innerHTML += `
      <div class="x controls">
        <h2>X</h2>
        <div class="buttons">
        <button id="translate-button" data-axis=0 data-translate-value=-1>⬅</button>
        <button id="translate-button" data-axis=0 data-translate-value=1>➡</button>
        </div>
      </div>
      <div class="y controls">
        <h2>Y</h2>
        <div class="buttons">
        <button id="translate-button" data-axis=1 data-translate-value=1>⬆</button>
        <button id="translate-button" data-axis=1 data-translate-value=-1>⬇</button>
        </div>
      </div>
      <div class="rotate controls">
        <h2>Rotate</h2>
        <div class="buttons">
        <button id="rotate-button">🗘</button>
        </div>
      </div>
      <div class="place">
        <button class="place-ships-button" id="place-ships-button">Place Ships</button>
      </div>`;
  }

  // todo
  // add effect to announcements
  // player2 ships will be autogenerated at random
  // add shake transition, using keyframes, if hit
  // firing sounds upon clicking a square, water sounds on miss, explosion sounds on hit
  return {
    createGameboard,
    addClassToCoordinates,
    announce,
    renderModelShips,
    initializeGame,
    renderControlsForPlacingShips,
    renderGameboardForPlacingShips,
    renderShips,
    renderGameboard,
    removeGameboard,
    clearGameboard,
    renderSelectedShip,
  };
}
