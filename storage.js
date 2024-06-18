export function Storage() {
  function setPlayer(playerObject = {}, player = "player1") {
    localStorage.setItem(player, JSON.stringify(playerObject));
  }

  function setGameboard(gameboard = {}, player = "player1") {
    localStorage.setItem("gameboard" + player, JSON.stringify(gameboard));
  }

  function getPlayer(player = "player1") {
    return JSON.parse(localStorage.getItem(player));
  }

  function getGameboard(player = "player1") {
    return JSON.parse(localStorage.getItem("gameboard" + player));
  }

  function setCoordinates(player, coordinates) {
    localStorage.setItem(player + "Coordinates", JSON.stringify(coordinates));
  }

  function setSelectedShipSize(shipCoordinates) {
    localStorage.setItem("selectedShip", shipCoordinates);
  }

  function getSelectedShipSize() {
    const shipsize = localStorage.getItem("selectedShip");
    return shipsize;
  }

  function getCoordinates(player) {
    return JSON.parse(localStorage.getItem(player + "Coordinates"));
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
