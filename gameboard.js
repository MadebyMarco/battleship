import { Ship } from "./ship.js";
import { Coordinate } from "./coordinate.js";
// cant use import with jest tests
// const Ship = require("./ship");
function Gameboard() {
  // there will be two gameBoards. One for the player, one for the computer
  //tracks coordinates
  const ships = [];
  const shipCoordinates = [];
  const misses = [];
  const hits = [];
  //can place ships on the board at specific coordinates
  function placeShip(...coordinates) {
    const ship = Ship(coordinates.length);
    const sortedCoordinates = sortCoordinates(coordinates);
    this.ships.push(ship);
    this.shipCoordinates.push(sortedCoordinates);
  }

  function getShip(coordinate) {
    const shipIndex = Coordinate().getShipIndexInFleet(
      this.shipCoordinates,
      coordinate
    );
    const ship = this.ships[shipIndex];
    return ship;
  }

  function getSunkShipsCoordinates() {
    const sunkShipsCoordinates = [];
    for (let i = 0; i < 5; i++) {
      if (this.ships[i].isSunk())
        sunkShipsCoordinates.push(...this.shipCoordinates[i]);
    }
    return sunkShipsCoordinates;
  }

  // should be in coordinate.js
  function sortCoordinates(coordinates) {
    // sets coordinates in ascending order
    const sortedCoordinates = [...coordinates];
    const firstCoordinate = sortedCoordinates[0];
    const lastCoordinate = sortedCoordinates[sortedCoordinates.length - 1];
    if (
      firstCoordinate[0] != lastCoordinate[0] &&
      firstCoordinate[0] > lastCoordinate[0]
    ) {
      sortedCoordinates.reverse();
    }
    if (
      firstCoordinate[1] != lastCoordinate[1] &&
      firstCoordinate[1] > lastCoordinate[1]
    ) {
      sortedCoordinates.reverse();
    }
    return sortedCoordinates;
  }
  //determines which attacks are hits and misses, then sends the hit to the right ship or records the miss
  function receiveAttack(coordinate) {
    const index = Coordinate().getShipIndexInFleet(
      this.shipCoordinates,
      coordinate
    );
    if (index === false) {
      this.misses.push(coordinate);
      return "miss";
    }
    this.hits.push(coordinate);
    this.ships[index].hit();
    return "hit";
  }

  //reports whether all ships of one side have been sunk
  function areAllShipsSunk() {
    const sunkShips = this.ships.filter((ship) => ship.isSunk() == true);
    if (sunkShips.length == this.ships.length) return true;
    return false;
  }
  return {
    ships,
    shipCoordinates,
    misses,
    hits,
    placeShip,
    getShip,
    receiveAttack,
    areAllShipsSunk,
    getSunkShipsCoordinates,
  };
}

export { Gameboard };
// module.exports = Gameboard; uncomment for tests
