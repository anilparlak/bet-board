/**
 * CSS module stub for Jest.
 * `styles.foo` -> "foo" so class based queries stay readable in tests.
 */
module.exports = new Proxy(
  {},
  {
    get: (_target, key) => (key === "__esModule" ? false : key),
  }
);
