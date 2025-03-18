<template>
<div class="flex flex-col gap-4 ml-4">
  <div class="flex gap-4 items-center">
    <select class="select select-bordered text-base border-2 border-[#65558f] focus:ring focus:ring-2 focus:ring-[#65558f] max-w-[250px] truncate">
      <option disabled selected value="-1">请选择要查询的班级</option>
      <option></option>
    </select>
    <p class="border-[1px] border-black p-2 ml-4 w-[150px] rounded-xl text-purple-950">
      手动搜索需要查询的同学期末成绩单
    </p>
    <div class="flex gap-4 items-center bg-[#f3f1ff] text-purple-950 px-4 py-2 border-[1px] border-black rounded-xl">
      <p>姓名</p>
      <input type="text" placeholder="请输入学生姓名" class="input input-bordered" />
      <p>学号</p>
      <input type="text" placeholder="请输入学生姓名" class="input input-bordered" />
      <button class="btn bg-[#65558f] text-white hover:bg-purple-900">确定</button>
    </div>
  </div>
  <div class="divider"></div>
  <div class="overflow-x-auto">
    <table class="table text-base bg-[#fef7ff]">
      <thead>
      <tr class="text-base">
        <th>学生姓名</th>
        <th>班级</th>
        <th>学号</th>
        <th>专业排名</th>
        <th>专业排名学期总绩点</th>
        <th class="flex">
          <button class="btn btn-outline btn-sm hover:bg-[#e5dbf5] hover:text-black">一键全选</button>
          <button class="btn btn-outline btn-sm hover:bg-[#e5dbf5] hover:text-black">一键发送给学生</button>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr>
<!--        <th>1</th>-->
<!--        <td>Cy Ganderton</td>-->
<!--        <td>Quality Control Specialist</td>-->
<!--        <td>Blue</td>-->
<!--        <td>Blue</td>-->
<!--        <td>Blue</td>-->
      </tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script setup lang="ts">
</script>

<style scoped>

</style>