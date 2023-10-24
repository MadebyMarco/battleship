import { Player } from "./player";
const player = Player();
player.moves.push([1, 1]);

test("random attack by computer", () => {
  expect(player.getAttack()).toBeTruthy();
});
