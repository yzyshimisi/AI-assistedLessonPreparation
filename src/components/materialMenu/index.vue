<template>
<div class="w-[9vw] bg-base-100 rounded-xl p-3 shadow-xl text-xl">
  <span class="flex justify-center hover:bg-base-300 hover:cursor-pointer rounded-md p-1"><router-link to="/lessonPreparationMaterials" class="truncate">教材资源</router-link></span>
  <div style="border-bottom: 2px solid #000000;" class="mt-2"></div>
  <span class="flex justify-center mt-1 hover:bg-base-300 hover:cursor-pointer rounded-md p-1"><router-link to="" class="truncate">习题资源</router-link></span>
  <div style="border-bottom: 2px solid #000000;" class="mt-2"></div>
  <span class="flex justify-center mt-1 hover:bg-base-300 hover:cursor-pointer rounded-md p-1"><router-link to="/sharedSpace" class="truncate">共享空间</router-link></span>
  <div style="border-bottom: 2px solid #000000;" class="mt-2"></div>
</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
</script>

<style scoped>

</style>