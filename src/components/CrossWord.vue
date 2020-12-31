<template>
  <div id="status">
    <label for="points">
      Points: 
    </label>
    <span id="points" v-text="crossWord.getPoints()">
    </span>
  </div>
  <table>
    <tr v-for="(letters, i) in crossWord.getBoard()" :key="i">
      <td v-for="(letter, j) in letters" :key="j">
        <EditableCell :letter="letter" :crossWord="crossWord" />
      </td>
    </tr>
  </table>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import EditableCell from "./EditableCell.vue";
import { CrossWord, CrossWordFactory } from "../lib/crossword";

@Options({
  props: {
    crossWord: CrossWord
  },
  components: {
    EditableCell
  }
})
export default class CrossWordBoard extends Vue {
  crossWord: CrossWord = CrossWordFactory.createWithDefaulConfig();
}
</script>

<style scoped>
#status {
  text-align: left;
}
table {
  table-layout: fixed;
}
table, th, td {
  border: 1px solid black;
}
th, td {
  width: 20px;
  height: 20px;
  overflow: hidden;
}
</style>
