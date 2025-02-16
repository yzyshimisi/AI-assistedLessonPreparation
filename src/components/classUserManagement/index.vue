<template>
<div class="flex flex-col mt-4 gap-5">
  <div class="flex gap-4 items-center h-[40px]">
    <select @change="console.log(course)" v-model="course" class="select select-bordered select-sm h-full text-base bg-base-200 font-normal ">
      <option disabled selected>请选择课程</option>
      <option>课程1</option>
      <option>课程2</option>
    </select>
    <button class="btn btn-sm h-full btn-outline border-purple-300 hover:bg-purple-200 hover:text-base-content pl-8 pr-8 text-base font-normal">班级成员一键录入</button>
    <button @click="isShowAddUserForm=true" class="btn btn-sm h-full btn-outline border-purple-300 hover:bg-purple-200 hover:text-base-content text-base font-normal">手动导入</button>
    <div v-show="isShowAddUserForm" @blur="isShowAddUserForm=false" class="bg-[#f0eefc] border-[1px] border-purple-300 rounded-lg flex items-center gap-4 pl-2 pr-6 py-1">
      <p class="ml-2">姓名</p>
      <input type="text" placeholder="Type here" class="input input-bordered input-sm w-36" />
      <p>学号</p>
      <input type="text" placeholder="Type here" class="input input-bordered input-sm w-56" />
      <button class="btn bg-[#65558f] btn-sm pl-14 pr-14 text-base-100 hover:bg-purple-900">添加</button>
    </div>
  </div>
  <div class="flex gap-4 items-center h-[40px]">
    <button @click="isShowAddClassForm=true" class="btn btn-sm bg-[#65558f] text-base-100 hover:bg-purple-900 text-xl h-full"><el-icon><Plus /></el-icon></button>
    <div v-show="isShowAddClassForm" class="bg-[#f0eefc] border-[1px] border-purple-300 rounded-lg flex items-center gap-4 pl-2 pr-4 py-1">
      <p class="ml-2">请输入所要添加的班级</p>
      <input type="text" placeholder="Type here" class="input input-bordered input-sm w-36" />
      <button class="btn bg-[#65558f] btn-sm pl-4 pr-4 text-base-100 hover:bg-purple-900">添加</button>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import {ref} from "vue";

const isShowAddUserForm = ref<boolean>(false);

const isShowAddClassForm = ref<boolean>(false);

const course = ref<string>('请选择课程');
</script>

<style scoped>
</style>