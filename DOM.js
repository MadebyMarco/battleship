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

  function initialize() {
    const gameboard1 = document.querySelector("#player1.gameboard");
    gameboard1.append(...createGameboard(gameboardSettings));
    const gameboard2 = document.querySelector("#player1.gameboard");
    gameboard2.append(...createGameboard(gameboardSettings));
  }

  return { createElements, createGameboard, receiveAttack, initialize };
}
