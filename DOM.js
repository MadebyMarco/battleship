function DOM() {
  function createElements(element, gridSize = 10, callbackFn) {
    const nodeArray = [];
    for (let counter = 0; counter < gridSize; counter++) {
      const currentElement = document.createElement(element);
      if (callbackFn) callbackFn(currentElement);
      nodeArray.push(currentElement);
    }
    return nodeArray;
  }

  return { createElements };
}
