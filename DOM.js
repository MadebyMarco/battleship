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
    if (result == "hit") element.classList.add("hit");
    if (result == "miss") element.classList.add("miss");
  }
  // stern: back of boat
  // bow: front of boat
  function placeShip(elements) {
    let orientation = getOrientation(elements);
    for (let index = 0; index < elements.length; index++) {
      if (index == 0) elements[index].classList.add("stern");
      if (index == elements.length - 1) elements[index].classList.add("bow");
      elements[index].classList.add(orientation);
      elements[index].classList.add("ship");
    }
  }

  function isVertical(coordinates) {
    const xAxis1 = parseInt(coordinates[0][0]);
    const xAxis2 = parseInt(coordinates[1][0]);
    if (xAxis1 == xAxis2) return true;
    return false;
  }

  function getOrientation(elements) {
    let orientation = "horizontal";
    if (
      isVertical([
        elements[0].dataset.coordinate,
        elements[1].dataset.coordinate,
      ])
    ) {
      orientation = "vertical";
    }
    return orientation;
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
    shipCoordinates.forEach((coordinate) => {
      placeShip(getShipElements(coordinate, player));
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

  function renderGameboard(playerShips, player) {
    const gameboard = document.querySelector("#" + player + ".gameboard");
    gameboard.append(...createGameboard(gameboardSettings));
    renderShips(playerShips, player);
  }

  function renderModelShips(player) {
    const shipSection = document.querySelector("#" + player + ".ships");
    const shipSizesClass = ["size-2", "size-3", "size-3", "size-4", "size-5"];
    const shipContainers = createElements("div", 5, (container) => {
      container.classList.add("model-ship-container");
      container.classList.add(shipSizesClass.pop());
    });
    const shipSizes = [5, 4, 3, 3, 2];
    for (let i = 0; i < 5; i++) {
      shipContainers[i].append(
        ...createElements("div", shipSizes[i], (ship) =>
          ship.classList.add("model-ship-square")
        )
      );
      shipSection.append(shipContainers[i]);
    }
  }

  return {
    renderResultsOfAttack,
    clearResults,
    renderGameboard,
    placeShip,
    receiveAttack,
    announce,
    renderModelShips,
  };
}
