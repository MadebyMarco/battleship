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

test("test if hit is received", () => {
  expect(gameboard.receiveAttack([1, 1])).toEqual(0);
});
