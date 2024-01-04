export function Storage() {
  function setPlayer(player = {}, playerNumber = 1) {
    localStorage.setItem("player" + playerNumber, player);
  }

  function setGameboard(gameboard = {}, playerNumber = 1) {
    localStorage.setItem("gameboard" + playerNumber, gameboard);
  }

  function getPlayer(playerNumber = 1) {
    return localStorage.getItem("player" + playerNumber);
  }

  function getGameboard(playerNumber = 1) {
    return localStorage.getItem("gameboard" + playerNumber);
  }

  return {
    setPlayer,
    setGameboard,
    getPlayer,
    getGameboard,
  };
}
