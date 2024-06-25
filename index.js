import { Player } from "./player.js";
// import { Ship } from "./ship";
import { UI } from "./UI.js";

const [player1, player2] = [Player(), Player()];
// dom.initializeGame();
UI(player1, player2);
