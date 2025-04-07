<template>
<div class="w-screen max-h-[1200px] min-h-screen flex gap-8">
  <myMenu></myMenu>
  <div class="flex flex-col gap-1 w-[100px] mt-4">
    <button
        @click="choModule=0"
        class="btn btn-ghost rounded-3xl hover:bg-[#e5dbf5]" :class="choModule===0 ? 'bg-[#e5dbf5]' : ''"
    >
      <img class="w-36" src="/classSystem/buttonIcon.png">
    </button><p class="text-center">考试成绩管理</p>
    <button
        @click="choModule=1"
        class="btn btn-ghost rounded-3xl hover:bg-[#e5dbf5] mt-4" :class="choModule===1 ? 'bg-[#e5dbf5]' : ''"
    >
      <img class="w-36" src="/classSystem/buttonIcon.png">
    </button><p class="text-center">学业成绩汇总</p>
    <button
        @click="choModule=2"
        class="btn btn-ghost rounded-3xl hover:bg-[#e5dbf5] mt-4" :class="choModule===2 ? 'bg-[#e5dbf5]' : ''"
    >
      <img class="w-36" src="/classSystem/buttonIcon.png">
    </button><p class="text-center">学业成绩分析</p>
    <button
        @click="choModule=3"
        class="btn btn-ghost rounded-3xl hover:bg-[#e5dbf5] mt-4" :class="choModule===3 ? 'bg-[#e5dbf5]' : ''"
    >
      <img class="w-36" src="/classSystem/buttonIcon.png">
    </button><p class="text-center">期末成绩单</p>
  </div>
  <div class="mt-4">
    <examScoreManagement v-show="choModule===0"></examScoreManagement>
    <examScoreSummary v-show="choModule===1"></examScoreSummary>
    <examScoreAnalyse v-show="choModule===2"></examScoreAnalyse>
    <examTranscript v-show="choModule===3"></examTranscript>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { myMenu, examScoreManagement, examScoreSummary, examScoreAnalyse, examTranscript } from "../../components"

const choModule = ref<number>(0)
</script>

<style scoped>

</style>