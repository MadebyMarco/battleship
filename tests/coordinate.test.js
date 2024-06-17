import { Coordinate } from "../coordinate.js";
test("Translate ship coordinates", () => {
  const translatedCoordinates = Coordinate().translate(
    [
      [0, 1],
      [0, 2],
    ],
    0,
    1
  );

  expect(translatedCoordinates[0][0]).toEqual(1);
  expect(translatedCoordinates[1][0]).toEqual(1);
});

test("Rotate 3d coordinate arrays", () => {
  const rotatedCoordinates = Coordinate().rotate([
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
  ]);
  const rotatedCoordinatesVertically = Coordinate().rotate(rotatedCoordinates);

  expect(rotatedCoordinates.join()).toBe("1,5,2,5,3,5,4,5");
  expect(rotatedCoordinatesVertically.join()).toBe("1,2,1,3,1,4,1,5");
  //end of test
});

test("Coordinate is in bounds", () => {
  expect(
    Coordinate().isInBounds([
      [1, 2],
      [1, 3],
      [1, 4],
      [1, 5],
    ])
  ).toEqual(true);

  expect(
    Coordinate().isInBounds([
      [-1, 2],
      [-1, 3],
      [-1, 4],
      [-1, 5],
    ])
  ).toEqual(false);

  expect(
    Coordinate().isInBounds([
      [1, 7],
      [1, 8],
      [1, 9],
      [1, 10],
    ])
  ).toEqual(false);
});

test("Get index of a ship from in fleet", () => {
  const testFleet = [
    [
      [1, 5],
      [1, 6],
      [1, 7],
      [1, 8],
    ],
    [
      [2, 6],
      [3, 6],
      [4, 6],
      [5, 6],
    ],
  ];
  expect(Coordinate().getShipIndexInFleet(testFleet, [1, 6])).toEqual(0);

  expect(Coordinate().getShipIndexInFleet(testFleet, [3, 6])).toEqual(1);
});

test("Collision check", () => {
  const testFleetObject = {
    "size-5": [
      [1, 5],
      [1, 6],
      [1, 7],
      [1, 8],
    ],
    "size-4": [
      [1, 1],
      [1, 2],
      [1, 3],
      [1, 4],
    ],
    "size-3": [
      [1, 4],
      [2, 4],
      [3, 4],
      [4, 4],
    ],
  };
  const testShipArray1 = [
    [1, 4],
    [2, 4],
    [3, 4],
    [4, 4],
  ];

  const testShipArray2 = [
    [1, 5],
    [1, 6],
    [1, 7],
    [1, 8],
  ];

  const collision1 = Coordinate().isColliding(
    testFleetObject,
    testShipArray1,
    "size-3"
  );
  const collision2 = Coordinate().isColliding(
    testFleetObject,
    testShipArray2,
    "size-3"
  );

  expect(collision1).toBe(true);
  expect(collision2).toBe(false);
});
