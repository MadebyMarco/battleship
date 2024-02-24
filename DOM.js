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

  function createGameboard(callbackFn) {
    const gameboardNodes = createElements("div", 100, callbackFn);
    const coordinateNodes = Coordinate().set(gameboardNodes);
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
    let orientation = Coordinate().getOrientation(elements);
    let shipSize = "size-" + elements.length;
    if (isSecondSize3Ship) shipSize = "size-3-2";
    for (let index = 0; index < elements.length; index++) {
      if (index == 0) elements[index].classList.add("stern");
      if (index == elements.length - 1) elements[index].classList.add("bow");
      elements[index].classList.add(orientation);
      elements[index].classList.add("ship");
      elements[index].classList.add(shipSize);
    }
  }

  function getShipElements(coordinates, player) {
    const shipElements = [];
    for (let index = 0; index < coordinates.length; index++) {
      const currentCoordinate = coordinates[index];
      const currentShipElement = document.querySelector(
        `#${player} div[data-coordinate='${currentCoordinate}']`
      );
      shipElements.push(currentShipElement);
    }
    return shipElements;
  }

  // render out ships
  function renderShips(shipCoordinates, player) {
    let isSecondSize3Ship = false;
    // uses isSecondSize3Ship to add class "size-3-2" to identify the two separately
    shipCoordinates.forEach((coordinate) => {
      if (coordinate.length == 3 && !isSecondSize3Ship)
        isSecondSize3Ship = true;
      placeShip(getShipElements(coordinate, player), isSecondSize3Ship);
    });
    //apply placeSHip func to each set of coordinates
  }

  function renderResultsOfAttack(
    coordinates = [],
    className,
    player = "player1"
  ) {
    for (let index = 0; index < coordinates.length; index++) {
      const currentCoordinate = coordinates[index];
      const square = document.querySelector(
        `#${player} div[data-coordinate='${currentCoordinate}']`
      );
      if (!square.classList.contains(`${className}`))
        square.classList.add(`${className}`);
    }
  }

  function clearResults(className, player) {
    const elements = document.querySelectorAll(`#${player} ${className}`);
    for (let index = 0; index < elements.length; index++) {
      const currentElement = elements[index];
      currentElement.classList.remove(`${className}`);
    }
  }

  function announce(message = "Player 1's turn") {
    document.querySelector(".announcements").textContent = message;
  }

  function renderPlayerGameboard(playerShips, player) {
    // problem with this function is that it expect theres to be an empty gameboard div instead of ret
    const gameboard = document.querySelector("#" + player + ".gameboard");
    gameboard.append(...createGameboard(gameboardSettings));
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
    main.innerHTML = `
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
    gameboard.append(...createGameboard(gameboardSettings));
    document.querySelector(renderTarget).append(gameboard);
    // clicking start will add place-ship class to main, not adding it here is better, less tangling
  }

  function renderControlsForPlacingShips(renderTarget = "main") {
    const main = document.querySelector(renderTarget);
    main.innerHTML += `
      <div class="x controls">
        <h2>X</h2>
        <div class="buttons"></div>
      </div>
      <div class="y controls">
        <h2>Y</h2>
        <div class="buttons"></div>
      </div>
      <div class="rotate controls">
        <h2>Rotate</h2>
        <div class="buttons"></div>
      </div>
      <div class="place controls">
        <h2>Place Ships</h2>
      </div>`;
    // need to code the event handlers listed below in UI.js
  }

  // todo
  // click start -> creates gameboard with ships placed
  // click on ship -> find other divs with same ship class and select them as current ship
  // click on arrow -> change x or y value depending on the arrow direction
  // click on rotate -> use the first coordinate as an anchor, if the ship is vertical, change coordinates from change in y to change in x relative to anchors position, if the ship is horizontal, change coordinates from change in x to change in y relative to anchors position.
  // displays ship to be placed while hovering
  // will then save ships to player1 in storage
  // player2 ships will be autogenerated at random
  // then remove the gameboard
  // display both gameboards
  // add shake transition, using keyframes, if hit
  // firing sounds upon clicking a square, water sounds on miss, explosion sounds on hit
  return {
    createGameboard,
    renderResultsOfAttack,
    clearResults,
    renderPlayerGameboard,
    placeShip,
    receiveAttack,
    announce,
    renderModelShips,
    initializeGame,
    renderControlsForPlacingShips,
    renderGameboardForPlacingShips,
    renderShips,
  };
}
