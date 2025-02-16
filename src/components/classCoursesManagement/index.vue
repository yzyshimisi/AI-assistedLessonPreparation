<template>
<div class="flex flex-col mt-4 gap-5">
  <div class="flex">
    <p class="text-3xl text-purple-800">我的课表</p>
    <select class="select select-bordered select-sm text-base bg-base-200 ml-4">
      <option>第1周</option>
      <option>第2周</option>
      <option>第3周</option>
      <option>第4周</option>
    </select>
    <button class="btn btn-sm btn-outline border-purple-300 hover:bg-purple-200 hover:text-base-content font-normal text-base ml-2">切换周次</button>
  </div>
  <el-table
      :data="tableData"
      :show-header="false"
      :resizable="false"
      border
      style="font-size: 18px; width: 1000px; background-color: green"
      :cell-style="{'color':'green', 'background-color':'#f3f1ff'}"
  >
    <el-table-column prop="date" label="节次" width="100"/>
    <el-table-column prop="name" label="周一" width="180" />
    <el-table-column prop="address" label="周二" width="180"/>
    <el-table-column prop="address" label="周三" width="180"/>
    <el-table-column prop="address" label="周四" width="180"/>
    <el-table-column prop="address" label="周五" width="180"/>
  </el-table>
</div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
</script>

<style scoped>

</style>