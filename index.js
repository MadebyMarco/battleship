import { Player } from "./player.js";
import { UI } from "./UI.js";

const [player1, player2] = [Player("player1"), Player("player2")];
player1.turn = true;
UI(player1, player2);
