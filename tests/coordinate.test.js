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
