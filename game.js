// create game loop
// 1. creates players and gameboards - place fake ships for now
// 2. displays player boards and render them using information from the gameboard objects
// 2.1 need methods to render the gameboard and to take user input for attacking, ex: clicking on a square, taking its coordinate, attacking enemy gameboard
// 3.the game loop should step through the game turn by turn using only methods from other objects?
// 3.1 i think this means that the game loop function is a high-order function that should only be executing other functions
// 4. create base case to end loop once all of one player's ships have been sunk in the game module
export function Game() {
  function loop(player1, player2, coordinate) {
    const round = {};
    if (player1.turn) {
      if (!player1.isNovelMove(coordinate)) return "please enter a new move";
      player1.moves.push(coordinate);
      round.result = player2.gameboard.receiveAttack(coordinate);
      if (isOver(player1, player2)) {
        round.result = "hit";
        round.winner = "player1";
      }
      if (round.result === "hit") {
        round.player1turn = true;
        round.player2turn = false;
        return round;
      }
      round.player1turn = false;
      round.player2turn = true;
      return round;
    }
    if (player2.turn) {
      if (!player2.isNovelMove(coordinate)) return "please enter a new move";
      player2.moves.push(coordinate);
      round.result = player1.gameboard.receiveAttack(coordinate);
      if (isOver(player1, player2)) {
        round.result = "hit";
        round.winner = "player2";
        return round;
      }
      if (round.result === "hit") {
        round.player2turn = true;
        round.player1turn = false;
        return round;
      }
      round.player2turn = false;
      round.player1turn = true;
      return round;
    }
  }

  function loopAgainstComputer(player1, player2, coordinate) {
    const round = {};

    if (!player1.isNovelMove(coordinate)) {
      round.error = "Please enter a new move";
      return round;
    }
    player1.moves.push(coordinate);
    round.player1result = player2.gameboard.receiveAttack(coordinate);
    if (round.player1result === "hit")
      round.player1SunkShip = player2.gameboard.getShip(coordinate).isSunk();

    if (isOver(player1, player2)) {
      round.winner = "player1";
      return round;
    }

    const player2Coordinate = player2.getAttack();
    player2.moves.push(player2Coordinate);
    round.player2result = player1.gameboard.receiveAttack(player2Coordinate);
    if (round.player2result === "hit")
      round.player2SunkShip = player1.gameboard
        .getShip(player2Coordinate)
        .isSunk();
    if (isOver(player1, player2)) round.winner = "player2";
    return round;
  }

  function isOver(player1, player2) {
    if (
      player1.gameboard.areAllShipsSunk() ||
      player2.gameboard.areAllShipsSunk()
    ) {
      return true;
    }
    return false;
  }

  return { loop, loopAgainstComputer, player1, player2 };
}
