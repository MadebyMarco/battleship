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

  const getDefault = [
    [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5],
    ],
    [
      [1, 1],
      [1, 2],
      [1, 3],
      [1, 4],
    ],
    [
      [2, 1],
      [2, 2],
      [2, 3],
    ],
    [
      [3, 1],
      [3, 2],
      [3, 3],
    ],
    [
      [4, 1],
      [4, 2],
    ],
  ];
  return {
    isVertical,
    toArray,
    getOrientation,
    set,
    getDefault,
  };
}
