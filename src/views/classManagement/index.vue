<template>
<div class="w-screen max-h-[1200px] min-h-screen bg-base-200 flex gap-8">
  <div class="flex">
    <myMenu></myMenu>
  </div>
  <div class="flex flex-col gap-2 w-[100px] mt-4">
    <button @click="isUserManage=true" class="btn rounded-3xl">1</button>班级成员管理
    <button @click="isUserManage=false" class="btn rounded-3xl">2</button>班级课程管理
  </div>
  <classUserManagement v-if="isUserManage"></classUserManagement>
  <classCoursesManagement v-else></classCoursesManagement>
</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { myMenu, classUserManagement, classCoursesManagement } from "../../components"

const isUserManage = ref<boolean>(true)
</script>

<style scoped>

</style>