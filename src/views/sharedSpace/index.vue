<template>
<div class="min-h-screen max-h-[2000px] w-screen flex gap-8">
  <materialMenu></materialMenu>
  <div class="flex flex-col gap-1 w-[100px] mt-4">
    <button
        @click="choModule=0"
        class="btn btn-ghost rounded-3xl hover:bg-[#e5dbf5]" :class="choModule===0 ? 'bg-[#e5dbf5]' : ''"
    >
      <div><img class="w-36" src="/classSystem/buttonIcon.png"></div>
    </button><p class="text-center">经验讨论区</p>
    <button
        @click="choModule=1"
        class="btn btn-ghost rounded-3xl hover:bg-[#e5dbf5] mt-4" :class="choModule===1 ? 'bg-[#e5dbf5]' : ''"
    >
      <img class="w-36" src="/classSystem/buttonIcon.png">
    </button><p class="text-center">课件共享区</p>
    <button
        @click="choModule=2"
        class="btn btn-ghost rounded-3xl hover:bg-[#e5dbf5] mt-4" :class="choModule===2 ? 'bg-[#e5dbf5]' : ''"
    >
      <img class="w-36" src="/classSystem/buttonIcon.png">
    </button><p class="text-center">视频共享区</p>
  </div>
  <div class="mt-4">
    <experienceDiscuss v-show="choModule===0"></experienceDiscuss>
    <coursewareSharing v-show="choModule===1"></coursewareSharing>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { materialMenu, experienceDiscuss, coursewareSharing } from "../../components"

const choModule = ref<number>(0)
</script>

<style scoped>

</style>