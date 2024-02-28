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

  function setCoordinates(playerNumber, coordinates) {
    localStorage.setItem("player" + playerNumber + "Coordinates", coordinates);
  }

  function getCoordinates(playerNumber) {
    return localStorage.getItem("player" + playerNumber + "Coordinates");
  }

  function clear() {
    localStorage.clear();
  }

  return {
    setPlayer,
    setGameboard,
    setCoordinates,
    getPlayer,
    getGameboard,
    getCoordinates,
    clear,
  };
}
