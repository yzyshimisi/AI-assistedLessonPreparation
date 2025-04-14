<template>
<div @click.stop class="bg-base-100 p-3 text-lg inline-block hover:cursor-auto">
  <div>
    <p>{{ props.questionData['question'] }}</p>
    <div v-for="(value,key,index) in props.options" class="mt-2">
      <div class="flex items-center gap-2">
        <input v-if="props.stuOrTea === 'stu'" @click="choose(key)" type="checkbox" :checked="choices.includes(key)" class="checkbox" />
        <p v-else >{{ choiceList[index] }}.</p>
        <p>{{ value }}</p>
      </div>
    </div>
  </div>
  <!-- 答案与解析 -->
  <div v-if="props.stuOrTea === 'tea'" class="mt-2 flex flex-col gap-2">
    <div class="divider"></div>
    <p>答案：{{ props.questionData['correct_answer'] }}</p>
    <p>解析：{{ props.questionData['explanation'] }}</p>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const choiceList = ['A','B','C','D']    // 教师查看时，没有单选框

const choices = ref<Array<string>>([])

watch(()=>choices.value,()=>{
  console.log(choices.value)
  varemit('chooseOption',choices.value)
},{deep:true})

const props = defineProps(['questionData','options','stuOrTea'])
const varemit = defineEmits(['chooseOption'])

const choose = (key) => {
  if(choices.value.includes(key)){
    choices.value = choices.value.filter((val)=>val!==key)
  }else{
    choices.value.push(key)
  }
}
</script>

<style scoped>

</style>