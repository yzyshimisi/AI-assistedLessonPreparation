<template>
<div class="h-screen w-screen bg-base-200 flex gap-8">
  <myMenu></myMenu>
  <div class="flex flex-col gap-2 w-[100px] mt-4">
    <button @click="isUserManage=true" class="btn rounded-3xl">1</button>班级成员管理
    <button @click="isUserManage=false" class="btn rounded-3xl">2</button>班级课程管理
  </div>
  <classUserManagement v-show="isUserManage"></classUserManagement>
  <classCoursesManagement v-show="!isUserManage"></classCoursesManagement>
</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { myMenu, classUserManagement, classCoursesManagement } from "../../components"

const isUserManage = ref<boolean>(true)
</script>

<style scoped>

</style>