<template>
<div @click.stop class="bg-base-100 p-4 text-lg inline-block hover:cursor-auto">
  <div>
    <p>{{ props.questionData['question'] }}</p>
    <textarea v-if="props.stuOrTea === 'stu'" class="textarea textarea-bordered w-full mt-4 text-base resize-none h-[150px]" placeholder="在此处输入答案"></textarea>
    <div v-else class="mt-2 flex flex-col gap-2">
      <div class="divider"></div>
      <p class=""><span class="font-bold">答案：</span>{{ props.questionData['correct_answer'] }}</p>
      <p class=""><span class="font-bold">解析：</span>{{ props.questionData['explanation'] }}</p>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps(['questionData','stuOrTea'])
const varemit = defineEmits([''])

</script>