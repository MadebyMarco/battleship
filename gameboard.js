// import { Ship } from "./ship"; cant use import with jest tests
const Ship = require("./ship");
function Gameboard() {
  // there will be two gameBoards. One for the player, one for the computer
  //tracks coordinates
  const ships = [];
  const shipCoordinates = [];
  //can place ships on the board at specific coordinates
  function placeShip(...coordinates) {
    const ship = Ship(coordinates.length);

    this.ships.push(ship);
    this.shipCoordinates.push(coordinates);
  }
  //determines which attacks are hits and misses, then sends the hit to the right ship or records the miss
  //reports whether all ships of one side have been sunk
  return { ships, shipCoordinates, placeShip };
}
module.exports = Gameboard;
