import Dictionary, { Positions, Dict } from "./dictionary";
import dictionaryData from "./dictDataLoader";

export class Cell {
  readonly i: number;
  readonly j: number;

  constructor(i: number, j: number) {
    this.i = i;
    this.j = j;
  }

  toString() {
    return this.i + "x" + this.j;
  }
}

export enum Direction {
  VERTICAL,
  HORIZONTAL,
  DIAGONAL
}

export class Letter {
  static EMPTY = "";
  private cell: Cell;
  private letter: string;
  private discovered: boolean;

  constructor(cell: Cell, letter: string) {
    this.letter = letter;
    this.cell = cell;
    this.discovered = false;
  }

  isEmpty() {
    return this.letter === Letter.EMPTY;
  }

  getCell() {
    return this.cell;
  }

  getLetter() {
    return this.letter;
  }

  getDiscovered() {
    return this.discovered;
  }

  turnDiscovered() {
    this.discovered = true;
  }
}

class Word {
  private letters: Array<Letter>;
  private discovered: boolean;
  constructor(letters: Array<Letter>) {
    this.letters = letters;
    this.discovered = false;
  }

  getLetters(): Array<Letter> {
    return this.letters;
  }

  getDiscovered(): boolean {
    if (this.discovered) {
      return this.discovered;
    }
    this.discovered =
      this.letters.filter(letter => letter.getDiscovered()).length ==
      this.letters.length;

    return this.discovered;
  }

  getWord(): string {
    return this.letters
      .map(letter => letter.getLetter())
      .reduce((p, c) => p + c);
  }
}

interface Map<T> {
  [propName: string]: Array<T>;
}

class CellMap {
  private cellMap: Map<Word> = {};

  get(cell: Cell): Array<Word> {
    return this.cellMap[cell.toString()];
  }

  put(cell: Cell, word: Word): void {
    if (!this.cellMap[cell.toString()]) {
      this.cellMap[cell.toString()] = [];
    }
    this.cellMap[cell.toString()].push(word);
  }
}

export class CrossWord {
  private board: Array<Array<Letter>>;
  private completed: boolean;
  private readonly cellMap: CellMap;
  private dict: Dictionary;
  private config: CrossWordConfig;
  private points: number;
  private currentCells: {
    [propName: string]: boolean;
  };

  constructor(config: CrossWordConfig, dict: Dictionary) {
    this.config = config;
    this.dict = dict;
    [this.board, this.cellMap] = this.createBoard(config);
    this.fillGaps();
    this.completed = false;
    this.points = 0;
    this.currentCells = {};
  }

  private fillGaps() {
    const size = this.config.size;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (!this.board[i]) {
          this.board[i] = [];
        }
        if (!this.board[i][j]) {
          this.board[i][j] = new Letter(new Cell(i, j), Letter.EMPTY);
        }
      }
    }
  }

  private createBoard(
    config: CrossWordConfig
  ): [Array<Array<Letter>>, CellMap] {
    const cellMap = new CellMap();
    const letters: Array<Array<Letter>> = [];

    config.wordsConfig.forEach(wc => {
      this.addToMapAndArray(wc, cellMap, letters);
    });

    return [letters, cellMap];
  }

  private addToMapAndArray(
    wordConfig: WordConfig,
    cellMap: CellMap,
    letters: Array<Array<Letter>>
  ) {
    const positions = this.getPositions(wordConfig, letters);
    const wordStr = this.dict.getBySizeAndPosition(wordConfig.size, positions);
    const tempLetters: Array<Letter> = this.createLetters(wordConfig, wordStr);
    const word = new Word(tempLetters);
    tempLetters
      .map(letter => letter.getCell())
      .forEach(cell => cellMap.put(cell, word));
    this.fill(letters, tempLetters);
  }

  private getPositions(
    wordConfig: WordConfig,
    letters: Array<Array<Letter>>
  ): Positions {
    const positions: Positions = {};
    let previousCell = this.createCell(
      wordConfig.start,
      wordConfig.direction,
      -1
    );
    for (let i = 1; i <= wordConfig.size; i++) {
      const cell = this.createCell(previousCell, wordConfig.direction, 1);
      if (letters[cell.i] && letters[cell.i][cell.j]) {
        if (!positions[letters[cell.i][cell.j].getLetter()]) {
          positions[letters[cell.i][cell.j].getLetter()] = [];
        }
        positions[letters[cell.i][cell.j].getLetter()].push(i - 1);
      }
      previousCell = cell;
    }
    return positions;
  }

  private fill(letters: Array<Array<Letter>>, tempLetters: Array<Letter>) {
    tempLetters.forEach(letter => {
      if (!letters[letter.getCell().i]) {
        letters[letter.getCell().i] = [];
      }
      if (!letters[letter.getCell().i][letter.getCell().j]) {
        letters[letter.getCell().i][letter.getCell().j] = letter;
      }
    });
  }

  private createCell(cell: Cell, direction: Direction, x: number): Cell {
    if (direction === Direction.DIAGONAL) {
      return new Cell(cell.i + x, cell.j + x);
    }

    if (direction === Direction.HORIZONTAL) {
      return new Cell(cell.i, cell.j + x);
    }

    return new Cell(cell.i + x, cell.j);
  }

  private createLetters(wordConfig: WordConfig, word: string): Array<Letter> {
    const letters: Array<Letter> = [];
    let previousCell = this.createCell(
      wordConfig.start,
      wordConfig.direction,
      -1
    );
    for (let i = 0; i < word.length; i++) {
      const letter = word.charAt(i);
      const cell = this.createCell(previousCell, wordConfig.direction, 1);
      letters.push(new Letter(cell, letter));
      previousCell = cell;
    }
    return letters;
  }

  getWords(cell: Cell): Array<Word> {
    return this.cellMap.get(cell);
  }

  print(): void {
    console.log("Board");
    console.log("size: " + this.board.length + " x " + this.board[1].length);
    this.board.forEach(letters => {
      let row = "";
      letters.forEach(letter => {
        if (letter.getLetter() === Letter.EMPTY) {
          row += "# ";
        } else {
          row += letter.getLetter() + " ";
        }
      });
      console.log(row);
    });
  }

  getCompleted(): boolean {
    if (this.completed) {
      return this.completed;
    }
    let c = true;
    this.board.forEach(letters => {
      letters.forEach(letter => {
        if (letter.getLetter() !== Letter.EMPTY) {
          c = c && letter.getDiscovered();
        }
      });
    });
    this.completed = c;
    return this.completed;
  }

  guessCell(cell: Cell, letter: string): boolean {
    if (!this.board[cell.i] || !this.board[cell.i][cell.j]) {
      throw new Error("No letter in cell");
    }
    const boardLetter = this.board[cell.i][cell.j];
    if (boardLetter.getDiscovered()) {
      throw new Error("Letter in cell already discovered");
    }
    if (boardLetter.getLetter() === letter) {
      this.points += 3;
      boardLetter.turnDiscovered();
    } else {
      this.points--;
    }
    return boardLetter.getDiscovered();
  }

  getPoints(): number {
    return this.points;
  }

  getBoard(): Array<Array<Letter>> {
    return this.board;
  }

  getCurrentCells(): { [propName: string]: boolean } {
    return this.currentCells;
  }

  private addCurrentCell(cell: Cell): void {
    if (!this.currentCells[cell.toString()]) {
      this.currentCells[cell.toString()] = true;
    }
  }

  setCurrentCells(cell: Cell): void {
    const words = this.getWords(cell);

    words.forEach(w => {
      w.getLetters().forEach(l => {
        this.addCurrentCell(l.getCell());
      });
    });
  }

  clearCurrentCells(): void {
    this.currentCells = {};
  }

  isCurrentCell(cell: Cell): boolean {
    const onlyOneCell = Object.keys(this.getCurrentCells()).filter(
      c => cell.toString() === c
    );
    return onlyOneCell.length == 1;
  }

  getWordsMeaning(cell: Cell): string {
    const words = this.getWords(cell);
    return words
      .map(w => w.getWord())
      .map(w => this.dict.getMeaning(w))
      .reduce((p, c, i) => p + " " + (i + 1) + ". " + c, "");
  }
}

export interface CrossWordConfig {
  size: number;
  wordsConfig: Array<WordConfig>;
}

export interface WordConfig {
  start: Cell;
  size: number;
  direction: Direction;
}

export class CrossWordFactory {
  private static dict = new Dictionary(dictionaryData as Dict);
  static createWithDefaulConfig(): CrossWord {
    const cwc = {
      size: 10,
      wordsConfig: [
        {
          start: new Cell(0, 0),
          size: 7,
          direction: Direction.HORIZONTAL
        },
        {
          start: new Cell(0, 0),
          size: 8,
          direction: Direction.VERTICAL
        },
        {
          start: new Cell(0, 6),
          size: 6,
          direction: Direction.VERTICAL
        },
        {
          start: new Cell(3, 0),
          size: 8,
          direction: Direction.HORIZONTAL
        },
        {
          start: new Cell(0, 2),
          size: 8,
          direction: Direction.VERTICAL
        },
        {
          start: new Cell(2, 1),
          size: 5,
          direction: Direction.DIAGONAL
        }
      ]
    };

    const cw = new CrossWord(cwc, CrossWordFactory.dict);

    return cw;
  }
}
