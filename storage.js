export function Storage() {
  function setPlayer(player = {}, playerNumber = 1) {
    localStorage.setItem("player" + playerNumber, JSON.stringify(player));
  }

  function setGameboard(gameboard = {}, playerNumber = 1) {
    localStorage.setItem("gameboard" + playerNumber, JSON.stringify(gameboard));
  }

  function getPlayer(playerNumber = 1) {
    return JSON.parse(localStorage.getItem("player" + playerNumber));
  }

  function getGameboard(playerNumber = 1) {
    return JSON.parse(localStorage.getItem("gameboard" + playerNumber));
  }

  function setCoordinates(playerNumber, coordinates) {
    localStorage.setItem(
      "player" + playerNumber + "Coordinates",
      JSON.stringify(coordinates)
    );
  }

  function setSelectedShipSize(shipCoordinates) {
    localStorage.setItem("selectedShip", shipCoordinates);
  }

  function getSelectedShipSize() {
    const shipsize = localStorage.getItem("selectedShip");
    return shipsize;
  }

  function getCoordinates(playerNumber) {
    return JSON.parse(
      localStorage.getItem("player" + playerNumber + "Coordinates")
    );
  }

  function clear() {
    localStorage.clear();
  }

  return {
    setPlayer,
    setGameboard,
    setCoordinates,
    setSelectedShipSize,
    getSelectedShipSize,
    getPlayer,
    getGameboard,
    getCoordinates,
    clear,
  };
}
