<template>
<div class="w-screen max-h-[1200px] min-h-screen bg-base-200 flex gap-8">
  <myMenu></myMenu>
  <div class="flex flex-col gap-1 w-[100px] mt-4">
    <button
        @click="isUserManage=true"
        class="btn btn-ghost rounded-3xl hover:bg-[#e5dbf5]"
        :class="isUserManage ? 'bg-[#e5dbf5]' : ''"
    >
      <img class="w-36" src="/classSystem/buttonIcon.png">
    </button>
    <p class="text-center">班级成员管理</p>
    <button
        @click="isUserManage=false"
        class="btn btn-ghost rounded-3xl hover:bg-[#e5dbf5] mt-4"
        :class="!isUserManage ? 'bg-[#e5dbf5]' : ''"
    >
      <img class="w-36" src="/classSystem/buttonIcon.png">
    </button>
    <p class="text-center">班级课程管理</p>
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