<template>
  <div :class="isCurrentCell() ? 'currentCell' : ''">
  <input
    v-show="editing && !letter.getDiscovered()"
    v-model="letterStr"
    type="text"
    size="1"
    maxlength="1"
    v-on:dblclick="checkLetter()"
    v-on:keyup.enter="checkLetter()"
    v-on:mouseover="setFocus()"
    ref="element"
  />
  <div
    v-show="!editing || letter.getDiscovered()"
    v-on:click="toggleEditing()"
    v-on:mouseover="setCurrentCells()"
    v-on:mouseleave="clearCurrentCells()"
    :class="letter.getDiscovered() ? 'discovered' : ''"
  >
    {{ getContent() }}
  </div>
  </div>
  <span v-if="currentCell" class="overlay">
    {{ getWordsMeaning() }}
  </span>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Letter, CrossWord } from "../lib/crossword";

@Options({
  props: {
    letter: Letter,
    crossWord: CrossWord
  }
})
export default class EditableCell extends Vue {
  letter: Letter;
  letterStr: string;
  crossWord: CrossWord;
  editing: boolean;
  currentCell: boolean;
  $refs!: {
    element: HTMLInputElement;
  };
  constructor(letter: Letter, crossWord: CrossWord) {
    super(letter, crossWord);
    this.letter = letter;
    this.crossWord = crossWord;
    this.letterStr = "";
    this.editing = false;
    this.currentCell = false;
  }
  isCurrentCell(): boolean {
    return this.crossWord.isCurrentCell(this.letter.getCell());
  }
  setFocus(): void {
    this.$refs.element.focus();
  }
  clearCurrentCells(): void {
    this.crossWord.clearCurrentCells();
    this.currentCell = false;
  }
  setCurrentCells(): void {
    this.crossWord.setCurrentCells(this.letter.getCell());
    this.currentCell = true;
  }
  getWordsMeaning(): string {
    return this.crossWord.getWordsMeaning(this.letter.getCell());
  }
  getContent(): string {
    if (this.letter.getDiscovered()) {
      return this.letter.getLetter();
    }
    if (this.letter.isEmpty()) {
      return "";
    }
    return "#";
  }
  toggleEditing(): void {
    this.editing = !this.editing;
    this.clearCurrentCells();
  }
  checkLetter(): void {
    if (this.letterStr && this.letterStr.trim() !== Letter.EMPTY) {
      this.crossWord.guessCell(this.letter.getCell(), this.letterStr.trim());
    }
    this.editing = false;
  }
}
</script>

<style scoped>
div {
  width: 20px;
}
.discovered {
  background-color: lightgreen;
}
.overlay {
  background-color: #EEEEEE;
  position: absolute;
  z-index: 100;
}
.currentCell {
  background-color: orange;
  z-index: 50;
}
</style>
