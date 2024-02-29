export function Coordinate() {
  function isVertical(coordinates) {
    const xAxis1 = parseInt(coordinates[0][0]);
    const xAxis2 = parseInt(coordinates[1][0]);
    if (xAxis1 == xAxis2) return true;
    return false;
  }

  function toArray(string) {
    const coordinate = [+string[0], +string[2]];
    return coordinate;
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

  function set(nodes, maxYAxis = 9) {
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

  function getDefault() {
    return {
      "size-5": [
        [0, 1],
        [0, 2],
        [0, 3],
        [0, 4],
        [0, 5],
      ],
      "size-4": [
        [1, 1],
        [1, 2],
        [1, 3],
        [1, 4],
      ],
      "size-3": [
        [2, 1],
        [2, 2],
        [2, 3],
      ],
      "size-3-2": [
        [3, 1],
        [3, 2],
        [3, 3],
      ],
      "size-2": [
        [4, 1],
        [4, 2],
      ],
    };
  }
  function translate(coordinateArray = [[], []], axis, difference) {
    const translatedArray = [...coordinateArray];
    const translatedValue = translatedArray[0][axis] + difference;
    if (translatedValue < 0 || translatedValue > 9) return [];
    translatedArray.forEach((array) => {
      array[axis] += difference;
    });
    return translatedArray;
  }

  function processJSON(JSONCoordinates) {
    const shipsCoordinates = JSON.parse(JSONCoordinates);
    const processedCoordinates = [
      shipsCoordinates["size-5"],
      shipsCoordinates["size-4"],
      shipsCoordinates["size-3"],
      shipsCoordinates["size-3-2"],
      shipsCoordinates["size-2"],
    ];
    return processedCoordinates;
  }
  return {
    translate,
    isVertical,
    toArray,
    getOrientation,
    set,
    getDefault,
    processJSON,
  };
}
