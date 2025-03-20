<template>
  <div
      v-if="!isModify"
      @dblclick="modify"
      class="hover:bg-base-200 py-2 px-2 rounded-2xl"
      :key="props.data"
  >
    <p>{{ data }}</p>
  </div>
  <div v-else class="hover:bg-base-200">
    <input
      v-model="data"
      @blur="overModify"
      @keyup.enter="overModify"
      id="textInput"
      type="text"
      class="input-sm w-full text-base h-[40px] rounded-xl py-2"
    />
  </div>
</template>

<script setup lang="ts">
import {ref, nextTick, watch} from "vue";

const isModify = ref(false);

const props = defineProps(['data','font-size']);
const varemit = defineEmits(["overModify"])

const data = ref<string>(props.data)

watch(()=>props.data,()=>{
  data.value = props.data
})

const modify = () => {
  isModify.value = true
  nextTick(()=>{
    let textInput = document.getElementById('textInput') as HTMLInputElement;
    textInput.focus();    // 自动将光标选中输入框的内容尾部
    textInput.setSelectionRange(textInput.value.length, textInput.value.length);
  })
}
const overModify = () => {
  if(isModify.value === true){
    isModify.value = false
    if(data.value !== props.data){
      varemit('overModify',data.value)
    }
  }
}
</script>

<style scoped>

</style>