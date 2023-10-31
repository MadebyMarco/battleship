// create player factory that can take turns playing the game by attacking the enemy Gameboard;
//create property called turn to set to false or true
//make a player not capable of making the same move twice
// make an ai that can attack the other gameboard
export function Player() {
  let turn = false;

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

  return { turn, moves, getAttack, isNovelMove };
}

// module.exports = Player; uncomment for tests
