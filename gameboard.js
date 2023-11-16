import { Ship } from "./ship.js";
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
    const shipIndex = getShipIndex(this.shipCoordinates, coordinate);
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
    const index = getShipIndex(this.shipCoordinates, coordinate);
    if (index === false) {
      this.misses.push(coordinate);
      return "miss";
    }
    this.hits.push(coordinate);
    this.ships[index].hit();
    return "hit";
  }

  function getShipIndex(shipCoordinates, coordinate) {
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
    getShipIndex,
    getShip,
    receiveAttack,
    areAllShipsSunk,
    getSunkShipsCoordinates,
  };
}

export { Gameboard };
// module.exports = Gameboard; uncomment for tests
