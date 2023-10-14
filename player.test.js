const Player = require("./player");
const player = Player();
player.moves.push([1, 1]);

test("random attack by computer", () => {
  expect(player.getAttack()).toBeTruthy();
});
