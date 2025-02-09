<template>
  <div
      v-if="!isModify"
      @dblclick="modify"
      class="hover:bg-base-200"
  >
    <span>{{props.data}}</span>
  </div>
  <div v-else class="hover:bg-base-200">
    <input
      v-model="props.data.value"
      @blur="overModify"
      @keyup.enter="overModify"
      id="textInput"
      type="text"
      class="input-xs w-full max-w-xs text-base"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";

const isModify = ref(false);

const props = defineProps(['data']);

const modify = () => {
  isModify.value = true
  nextTick(()=>{
    let textInput = document.getElementById('textInput') as HTMLInputElement;
    textInput.focus();    // 自动将光标选中输入框的内容尾部
    textInput.setSelectionRange(textInput.value.length, textInput.value.length);
  })
}
const overModify = () => {
  isModify.value = false
}
</script>

<style scoped>

</style>