const Ship = require("./ship").ship;

let myShip = Ship(4);

afterEach(() => {
  myShip = Ship(4);
});

test("length and hits", () => {
  expect(myShip.length).toEqual(4);
  expect(myShip.numberOfHits).toEqual(0);
});

test("increase hits", () => {
  myShip.hit();
  expect(myShip.numberOfHits).toEqual(1);
});

test("sink ship", () => {
  myShip.hit();
  myShip.hit();
  myShip.hit();
  myShip.hit();
  expect(myShip.isSunk()).toBeTruthy();
});
