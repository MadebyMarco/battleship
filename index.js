import { DOM } from "./DOM.js";
import { Game } from "./game.js";
// import { Player } from "./player";
// import { Ship } from "./ship";
import { UI } from "./UI.js";

const game = Game();
const dom = DOM();
game.player2.ai = true;
// dom.initializeGame();
document.querySelector(".startButton").onclick = () => {
  dom.renderPlayerGameboard([], "player1");
  dom.renderModelShips("player1");
};
UI(game.player1, game.player2);
