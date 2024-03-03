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
    if (typeof axis != "number" || typeof difference != "number") {
      return coordinateArray;
    }
    const translatedValueFirst = coordinateArray[0][axis] + difference;
    const translatedValueLast =
      coordinateArray[coordinateArray.length - 1][axis] + difference;
    if (
      translatedValueFirst < 0 ||
      translatedValueFirst > 9 ||
      translatedValueLast < 0 ||
      translatedValueLast > 9
    )
      return coordinateArray;

    const translatedArray = [...coordinateArray];
    translatedArray.forEach((array) => {
      array[axis] += difference;
    });
    return translatedArray;
  }

  function objectTo3DArray(shipCoordinatesObject) {
    const processedCoordinates = [
      shipCoordinatesObject["size-5"],
      shipCoordinatesObject["size-4"],
      shipCoordinatesObject["size-3"],
      shipCoordinatesObject["size-3-2"],
      shipCoordinatesObject["size-2"],
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
    objectTo3DArray,
  };
}
