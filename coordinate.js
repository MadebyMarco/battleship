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

  // should only be array as param
  function getOrientation(elements) {
    let orientation = "horizontal";
    if (isVertical([elements[0].id.slice(-3), elements[1].id.slice(-3)])) {
      orientation = "vertical";
    }
    return orientation;
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

    // error handling should be in a different place or
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

  function rotate(array) {
    // coordinates are in ascending order
    // [1, 2], [1, 3], [1, 4], [1, 5],
    const size = array.length;
    let axisToIncrement = 0;
    let modifier = 1;
    let startingCoordinate = array[size - 1];
    const rotatedArray = [];
    const vertical = isVertical(array);
    // use is vertical to determine which axis or element to acccess from the two element array coordinate
    // if vertical, access x coordinate(0 index), else access y coordinate (1 index)
    if (!vertical) {
      axisToIncrement = 1;
      modifier = -1;
      startingCoordinate = array[0];
    }
    // bow is the last element in the array
    // since bow is front of ship we are decreasing from it
    // idea is to to rotate around the bow. We will check for collisions, if collisions occur, show error and flash boat red?, if not, rotate
    // if vertical, increase the 0 index values by 1 starting from the bows position, which does not change
    // work down from end coordinate for the length of the array/ship arg
    let newValue = startingCoordinate[axisToIncrement];
    for (let i = 0; i < size; i++) {
      if (!vertical) {
        rotatedArray.push([startingCoordinate[0], newValue]);
      } else {
        rotatedArray.push([newValue, startingCoordinate[1]]);
      }
      newValue += modifier;
    }
    if (!vertical) rotatedArray.reverse();
    return rotatedArray;
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

  function isInBounds(array) {
    const firstXCoordinate = array[0][0];
    const lastXCoordinate = array[array.length - 1][0];

    if (
      firstXCoordinate < 0 ||
      firstXCoordinate > 9 ||
      lastXCoordinate < 0 ||
      lastXCoordinate > 9
    )
      return false;
    const firstYCoordinate = array[0][1];
    const lastYCoordinate = array[array.length - 1][1];

    if (
      firstYCoordinate < 0 ||
      firstYCoordinate > 9 ||
      lastYCoordinate < 0 ||
      lastYCoordinate > 9
    )
      return false;
    return true;
  }

  function getShipIndexInFleet(fleet, coordinate) {
    for (let shipIndex = 0; shipIndex < fleet.length; shipIndex++) {
      if (getIndexOfArray(fleet[shipIndex], coordinate) >= 0) {
        return shipIndex;
      }
    }
    return false;
  }

  function isColliding(fleetObject, targetShipArray, targetSize) {
    // removing ship prevents collision check on itself
    fleetObject[targetSize] = [];
    const fleetArray = Coordinate().objectTo3DArray(fleetObject);
    for (let i = 0; i < targetShipArray.length; i++) {
      const index = Coordinate().getShipIndexInFleet(
        fleetArray,
        targetShipArray[i]
      );
      if (index != false) return true;
    }
    return false;
  }

  function getIndexOfArray(arrayWithArrays, targetArray) {
    for (let index = 0; index < arrayWithArrays.length; index++) {
      const currentCoordinate = arrayWithArrays[index];
      if (currentCoordinate[0] != targetArray[0]) {
        continue;
      }
      if (currentCoordinate[1] == targetArray[1]) {
        return index;
      }
    }
    return -1;
  }

  return {
    translate,
    isVertical,
    toArray,
    getOrientation,
    getDefault,
    objectTo3DArray,
    rotate,
    isInBounds,
    getShipIndexInFleet,
    isColliding,
  };
}
