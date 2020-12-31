export interface Dict {
  [propName: string]: unknown;
}

export interface Positions {
  [propName: string]: Array<number>;
}

export interface DictBySize {
  [propName: number]: Array<string>;
}

function initialize(dict: Dict): DictBySize {
  const keys = Object.keys(dict);
  const dictBySize = new Array<Array<string>>();
  for (const i in keys) {
    if (!dictBySize[keys[i].length]) {
      dictBySize[keys[i].length] = [];
    }
    dictBySize[keys[i].length].push(keys[i]);
  }
  return dictBySize;
}

// {"MEANINGS": {"6": ["Noun", "the 1st letter of the Roman alphabet", 
//   ["Letter", "Letter of the alphabet", "Alphabetic character"], []], 
//   "7": ["Noun", "the blood group whose red cells carry the A antigen", ["Blood group", "Blood type"], []]}, 
//   "ANTONYMS": [], 
//   "SYNONYMS": ["Ampere", "Type a", "Antiophthalmic factor", "Angstrom", "Adenine"]}


interface WordObj {
  SYNONYMS: Array<string>;
  ANTONYMS: Array<string>;
  MEANINGS: Meanings;
}

interface Meanings {
  [propName: string]: Array<string>;
}

export default class Dictionary {
  private dictBySize: DictBySize;
  private dict: Dict;
  constructor(dict: Dict) {
    this.dict = dict;
    this.dictBySize = initialize(dict);
  }
  getMeaning(word: string): string {
    const wordObj = this.dict[word] as WordObj;
    if (!wordObj) {
      return "";
    }
    const meanings = wordObj["MEANINGS"];
    if (meanings) {
      const meaning = Object.keys(meanings).filter(
        k => meanings[k] && meanings[k].length > 0
      );

      if (meaning.length > 1) {
        // ignoring firs element because it is just word type: Noun, Letter, ...
        return meaning[1];
      }
    }

    const synonyms = wordObj["SYNONYMS"];
    if (!synonyms) {
      return "";
    }

    if (synonyms.length > 0) {
      return synonyms[0];
    }

    return "";
  }
  getWords(): Dict {
    return this.dict;
  }
  getWordsBySize(): DictBySize {
    return this.dictBySize;
  }
  getBySize(size: number): string {
    if (!this.dictBySize[size]) {
      return "";
    }
    const words = this.dictBySize[size];
    const randomIndex = this.getRandom(words.length - 1);

    return words[randomIndex];
  }
  getBySizeAndPosition(size: number, positions: Positions): string {
    if (Object.keys(positions).length > size) {
      throw new Error("positions cannot be greater than size");
    }
    if (!this.dictBySize[size]) {
      return "";
    }
    const words = this.dictBySize[size];

    const wordsWithAllPositions = words.filter(word => {
      let hasAllPositions = true;

      Object.keys(positions).forEach(key => {
        positions[key].forEach(p => {
          if (p >= word.length) {
            throw new Error("Position cannot be greater than size");
          }
          hasAllPositions = hasAllPositions && word.charAt(p) === key;
        });
      });

      return hasAllPositions;
    });

    if (wordsWithAllPositions.length == 0) {
      return "";
    }

    return wordsWithAllPositions[this.getRandom(wordsWithAllPositions.length)];
  }
  private getRandom(n: number): number {
    return Math.floor(Math.random() * n);
  }
}
