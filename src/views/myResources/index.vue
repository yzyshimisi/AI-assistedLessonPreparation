<template>
<div class="h-screen w-screen bg-base-200 flex gap-1">
  <div class="w-[120px] h-full bg-base-100 rounded-xl p-3 shadow-xl">
    <span class="flex justify-center text-lg hover:bg-base-300 hover:cursor-pointer">我的资源</span>
    <div style="border-bottom: 2px solid #000000;" class="mt-2"></div>
    <span class="flex justify-center text-lg mt-3 hover:bg-base-300 hover:cursor-pointer">班级管理</span>
    <div style="border-bottom: 2px solid #000000;" class="mt-2"></div>
    <span class="flex justify-center text-lg mt-3 hover:bg-base-300 hover:cursor-pointer">个人信息</span>
    <div style="border-bottom: 2px solid #000000;" class="mt-2"></div>
  </div>
  <div class="w-[170px] h-full bg-base-100 rounded-xl relative">
    <div @click="expandDirectory" class="hover:bg-base-300 hover:cursor-pointer m-4">
      <img v-if="!isExpand" src="/myResources/chevron-right.png" class="inline">
      <img v-else src="/myResources/chevron-down.png" class="inline">
      <span class="ml-3">全部</span>
    </div>
    <div class="absolute bottom-[50px]">
      <div style="border-bottom: 1px solid #000000;" class="w-[170px]"></div>
      <div class="m-4 flex items-center gap-2">
        <el-icon><Star /></el-icon>
        <span>我的收藏</span>
      </div>
      <div class="ml-4 mb-4 flex items-center gap-2">
        <el-icon><Delete /></el-icon>
        <span>回收站</span>
      </div>
      <div style="border-bottom: 1px solid #000000;" class="w-[170px]"></div>

    </div>
  </div>
  <div class="ml-4 flex flex-col gap-3">
    <div class="breadcrumbs text-sm">
      <ul>
        <li><a>Home</a></li>
        <li><a>Documents</a></li>
        <li>Add Document</li>
      </ul>
    </div>
    <div class="bg-base-100 w-[1000px] h-[650px] p-4">
      <div class="flex items-center">
        <el-icon @click="createDir" size="40" color="#6b21a8" class="hover:bg-base-300 hover:cursor-pointer"><FolderAdd /></el-icon>
        <el-icon @click="createFile" size="40" color="#6b21a8" class="ml-2 hover:bg-base-300 hover:cursor-pointer"><DocumentAdd /></el-icon>
        <div class="divider lg:divider-horizontal"></div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const isExpand = ref<boolean>(false);

const expandDirectory = () => {
  if(isExpand.value) isExpand.value = false;
  else isExpand.value = true;
}

const createDir = () => {

}

const createFile = () => {

}
</script>

<style scoped>

</style>