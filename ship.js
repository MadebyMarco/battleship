export function Ship(length) {
  const numberOfHits = 0;

  function hit() {
    this.numberOfHits++;
  }

  function isSunk() {
    if (this.numberOfHits >= this.length) return true;
    return false;
  }
  return { length, numberOfHits, isSunk, hit };
}
// module.exports = Ship; uncomment for tests
