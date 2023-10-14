const Gameboard = require("./gameboard");
const Ship = require("./ship");
const gameboard = Gameboard();
const ship = Ship(3);
test("check gameboard ships and coordinates are being added correctly", () => {
  expect(gameboard.ships).toEqual([]);
  gameboard.placeShip([1, 1], [1, 2], [1, 3]);
  expect(gameboard.ships.length).toEqual(1);
  expect(gameboard.shipCoordinates.length).toEqual(1);
  expect(gameboard.ships[0].length).toBe(ship.length);
  expect(gameboard.shipCoordinates[0].length).toBe(ship.length);
});

test("test receiveAttack hits and misses", () => {
  gameboard.receiveAttack([1, 1]);
  expect(gameboard.ships[0].numberOfHits).toEqual(1);
  gameboard.receiveAttack([2, 2]);
  expect({ coordinate: gameboard.misses[0] }).toEqual({ coordinate: [2, 2] });
});
