import { Player } from "./player.js";
import { UI } from "./UI.js";

const [player1, player2] = [Player(), Player()];
player1.turn = true;
player2.ai = true;
UI(player1, player2);
