// create player factory that can take turns playing the game by attacking the enemy Gameboard;
//create property called turn to set to false or true
//make a player not capable of making the same move twice
// make an ai that can attack the other gameboard
function Player() {
  let turn = false;

  function setTurn(boolean) {
    this.turn = boolean;
  }

  const moves = [];

  function getRandomMove(maxGridSize = 10) {
    const coordinate0 = Math.floor(Math.random() * maxGridSize);
    const coordinate1 = Math.floor(Math.random() * maxGridSize);
    return [coordinate0, coordinate1];
  }

  function _isNovelMove(move) {
    let novelStatus = true;
    moves.map((oldMove) => {
      if (oldMove[0] == move[0] && oldMove[1] == move[1]) novelStatus = false;
    });
    return novelStatus;
  }

  function getAttack() {
    let isNovel = false;
    let maxTurns = 10;
    while (!isNovel && maxTurns) {
      const move = getRandomMove();
      if (_isNovelMove(move)) return move;
      maxTurns--;
    }
    return "No move in 10 tries";
  }

  return { turn, setTurn, moves, getAttack };
}

module.exports = Player;
