export function Storage() {
  function setPlayer(player = {}, playerNumber = 1) {
    localStorage.setItem("player" + playerNumber, player);
  }

  function setGameboard(gameboard = {}, playerNumber = 1) {
    localStorage.setItem("gameboard" + playerNumber, gameboard);
  }

  return {
    setPlayer,
    setGameboard,
  };
}
