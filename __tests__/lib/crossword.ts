import crossword from "../../src/lib/crossword";

test("crossword returns word of size passed in parameter", () => {
  expect(crossword(1)).toBe("a");
});
