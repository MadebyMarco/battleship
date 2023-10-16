// create game loop
// 1. creates players and gameboards - place fake ships for now
// 2. displays player boards and render them using information from the gameboard objects
// 2.1 need methods to render the gameboard and to take user input for attacking, ex: clicking on a square, taking its coordinate, attacking enemy gameboard
// 3.the game loop should step through the game turn by turn using only methods from other objects?
// 3.1 i think this means that the game loop function is a high-order function that should only be executing other functions
// 4. create base case to end loop once all of one player's ships have been sunk in the game module
function Game() {
  const Player = require("./player");
  const Gameboard = require("./gameboard");

  const player1 = Player();
  const player2 = Player();

  player1.gameboard = Gameboard();
  player2.gameboard = Gameboard();

  function start() {}

  function isOver() {
    if (
      player1.gameboard.areAllShipsSunk() ||
      player2.gameboard.areAllShipsSunk()
    ) {
      return true;
    }
    return false;
  }
}
