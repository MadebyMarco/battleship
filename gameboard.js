// import { Ship } from "./ship"; cant use import with jest tests
const Ship = require("./ship");
function Gameboard() {
  // there will be two gameBoards. One for the player, one for the computer
  //tracks coordinates
  const ships = [];
  const shipCoordinates = [];
  const misses = [];
  //can place ships on the board at specific coordinates
  function placeShip(...coordinates) {
    const ship = Ship(coordinates.length);

    this.ships.push(ship);
    this.shipCoordinates.push(coordinates);
  }
  //determines which attacks are hits and misses, then sends the hit to the right ship or records the miss
  function receiveAttack(coordinate) {
    const index = _isHit(this.shipCoordinates, coordinate);
    if (index === false) {
      this.misses.push(coordinate);
      return;
    }
    this.ships[index].hit();
  }

  function _isHit(shipCoordinates, coordinate) {
    for (let shipIndex = 0; shipIndex < shipCoordinates.length; shipIndex++) {
      //   // first loop will go over each COLLECTION of coordinates
      //   //This index will be used to identify which ship will be hit.
      for (
        let coordinatesIndex = 0;
        coordinatesIndex < shipCoordinates[shipIndex].length;
        coordinatesIndex++
      ) {
        //     //Second loop checks each pair of coordinates and compares their values to target coordinate
        const currentCoordinate = shipCoordinates[shipIndex][coordinatesIndex];
        if (
          currentCoordinate[0] == coordinate[0] &&
          currentCoordinate[1] == coordinate[1]
        ) {
          return shipIndex;
        }
      }
    }
    return false;
  }
  //reports whether all ships of one side have been sunk
  return { ships, shipCoordinates, misses, placeShip, receiveAttack };
}
module.exports = Gameboard;
