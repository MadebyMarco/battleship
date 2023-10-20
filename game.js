// create game loop
// 1. creates players and gameboards - place fake ships for now
// 2. displays player boards and render them using information from the gameboard objects
// 2.1 need methods to render the gameboard and to take user input for attacking, ex: clicking on a square, taking its coordinate, attacking enemy gameboard
// 3.the game loop should step through the game turn by turn using only methods from other objects?
// 3.1 i think this means that the game loop function is a high-order function that should only be executing other functions
// 4. create base case to end loop once all of one player's ships have been sunk in the game module
import { Gameboard } from "./gameboard.js";
import { Player } from "./player.js";
export function Game() {
  const player1 = Player();
  const player2 = Player();

  player1.gameboard = Gameboard();
  player2.gameboard = Gameboard();

  //place ships
  player1.gameboard.placeShip([0, 1], [0, 2], [0, 3], [0, 4], [0, 5]);
  player1.gameboard.placeShip([2, 1], [2, 2], [2, 3], [2, 4]);
  player1.gameboard.placeShip([3, 2], [4, 2], [5, 2]);
  player1.gameboard.placeShip([6, 5], [6, 4], [6, 3]);
  player1.gameboard.placeShip([9, 9], [9, 8]);

  player2.gameboard.placeShip([0, 1], [0, 2], [0, 3], [0, 4], [0, 5]);
  player2.gameboard.placeShip([5, 1], [5, 2], [5, 3], [5, 4]);
  player2.gameboard.placeShip([2, 8], [3, 8], [4, 8]);
  player2.gameboard.placeShip([6, 5], [6, 4], [6, 3]);
  player2.gameboard.placeShip([8, 9], [8, 8]);
  player1.turn = true;

  function start() {
    while (!isOver()) {
      if (player1.turn == true) {
        //1st player attacks
        //get player move
        //verify move
        //push move player1.moves.push(moves)
        //2nd player gameboard receives attack
        //player2.gameboard.receiveAttack(move);
        player1.turn = false;
        player2.turn = true;
        if (isOver()) return "player 1 wins";
      }
      if (player2.turn == true) {
        //2st player attacks
        //get player move
        //verify move
        //push move player2.moves.push(moves)
        //1nd player gameboard receives attack
        //player1.gameboard.receiveAttack(move);
        player2.turn = false;
        player1.turn = true;
        if (isOver()) return "player 2 wins";
      }
    }

    //2nd player attacks
    //1st player gameboard receives attack
    //check if game is over
  }

  function isOver() {
    if (
      player1.gameboard.areAllShipsSunk() ||
      player2.gameboard.areAllShipsSunk()
    ) {
      return true;
    }
    return false;
  }

  return { start, player1, player2 };
}
