import { Game } from "./game.js";

function DOM() {
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
    const coordinateNodes = setCoordinates(gameboardNodes);
    return coordinateNodes;
  }
  function setCoordinates(nodes, maxYAxis = 9) {
    let xAxis = 0;
    let yAxis = maxYAxis;
    const coordinateNodes = [...nodes];
    coordinateNodes.forEach((node) => {
      if (xAxis > maxYAxis) {
        xAxis = 0;
        yAxis = yAxis - 1;
      }
      node.dataset.coordinate = [xAxis, yAxis];
      xAxis++;
    });
    return coordinateNodes;
  }

  function gameboardSettings(element) {
    element.classList.add("square");
  }

  function receiveAttack(element, result) {
    if (result == "hit") element.classlist.add("hit");
    if (result == "miss") element.classlist.add("miss");
  }
  // stern: back of boat
  // bow: front of boat
  function placeShip(elements, isVertical = false) {
    let orientation = "horizontal";
    if (isVertical) orientation = "vertical";
    for (let index = 0; index < elements.length; index++) {
      if (index == 0) elements[index].classList.add("stern");
      if (index == elements.length - 1) elements[index].classList.add("bow");
      elements[index].classList.add(orientation);
      elements[index].classList.add("ship");
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
    const shipElements = getShipElements(shipCoordinates, player);
    placeShip(shipElements, true);
    //apply placeSHip func to each set of coordinates
  }

  function initialize() {
    const gameboard1 = document.querySelector("#player1.gameboard");
    gameboard1.append(...createGameboard(gameboardSettings));
    const gameboard2 = document.querySelector("#player2.gameboard");
    gameboard2.append(...createGameboard(gameboardSettings));
    renderShips(Game().player1.gameboard.shipCoordinates[0], "player1");
  }

  return { receiveAttack, initialize, placeShip };
}

DOM().initialize();
