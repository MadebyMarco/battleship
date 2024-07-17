// create player factory that can take turns playing the game by attacking the enemy Gameboard;
//create property called turn to set to false or true
//make a player not capable of making the same move twice
// make an ai that can attack the other gameboard

import { Gameboard } from "./gameboard.js";
export function Player(name) {
  // player should not track turn, the controller(ui) should control state
  const gameboard = Gameboard();
  let turn = false;
  const ai = false;

  const moves = [];

  function getRandomMove(maxGridSize = 10) {
    const coordinate0 = Math.floor(Math.random() * maxGridSize);
    const coordinate1 = Math.floor(Math.random() * maxGridSize);
    return [coordinate0, coordinate1];
  }

  function isNovelMove(move) {
    let novel = true;
    moves.map((oldMove) => {
      if (oldMove[0] == move[0] && oldMove[1] == move[1]) novel = false;
    });
    return novel;
  }
  // todo:
  // once gameboard is imported, check if last move was a hit, if it was, hit the 4 adjacent squares, if last two were hits, find out if vertical, continue in provided direction,
  // some way for ai to know it sunk a ship
  function getAttack() {
    let isNovel = false;
    let maxTurns = 10;
    while (!isNovel && maxTurns) {
      const move = getRandomMove();
      if (isNovelMove(move)) return move;
      maxTurns--;
    }
    return "No move in 10 tries";
  }

  return { turn, moves, getAttack, isNovelMove, gameboard, ai, name };
}

// module.exports = Player; uncomment for tests
