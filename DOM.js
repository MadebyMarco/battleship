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
    return gameboardNodes;
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
  function placeShip(isVertical, ...elements) {
    let orientation = "horizontal";
    if (isVertical) orientation = "vertical";
    for (let index = 0; index < elements.length; index++) {
      if (index == 0) elements[index].classList.add("stern");
      if (index == elements.length - 1) elements[index].classList.add("bow");
      elements[index].classList.add(orientation);
      elements[index].classList.add("ship");
    }
  }

  function initialize() {
    const gameboard1 = document.querySelector("#player1.gameboard");
    gameboard1.append(...createGameboard(gameboardSettings));
    const gameboard2 = document.querySelector("#player2.gameboard");
    gameboard2.append(...createGameboard(gameboardSettings));
  }

  return { receiveAttack, initialize, placeShip };
}

DOM().initialize();
