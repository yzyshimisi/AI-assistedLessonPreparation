<template>
<div class="min-h-screen w-screen bg-base-200 flex gap-1">
  <materialMenu></materialMenu>
  <div v-show="viewDetailInd===-1" class="flex gap-1">  <!-- 显示列表 -->
    <div class="p-3 bg-base-300 rounded-2xl">   <!-- 课程列表 -->
      <p class="text-xl px-4 mt-2 ">大学课程</p>
      <div style="border-bottom: 2px solid #000000;" class="mt-2"></div>
      <div
          v-for="(value,index) in subjectList"
      >
        <p @click="chooseSubject(index)" class="p-1 mt-1 hover:bg-base-200 hover:cursor-pointer">{{ value }}</p>
        <div style="border-bottom: 2px solid #000000;" class="mt-2"></div>
      </div>
    </div>
    <div class="w-[60vw] ml-[20px] mt-[20px]">
      <label class="input input-bordered flex items-center gap-2">    <!-- 搜索框 -->
        <input type="text" class="grow" placeholder="在此处可以搜索相关资料" />
        <el-icon><Search /></el-icon>
      </label>
      <div class="w-full bg-base-100 mt-4 mb-5 p-2 grid grid-cols-4 gap-4">   <!-- 资源列表 -->
        <div v-for="(value,index) in exerciseResourcesList" class="shadow-lg flex flex-col gap-2">
          <div class="h-[340px]"><img @click="viewDetailInd=index" :src="value['resource_cover_url']" class="hover:cursor-pointer"></div>
          <p class="w-full text-center truncate mb-3 px-2">{{ value['resource_name'] }}</p>
        </div>
      </div>
    </div>
  </div>
  <!-- 资源详情 -->
  <div v-show="viewDetailInd !== -1" class="w-[65vw] min-h-screen bg-base-100 ml-[100px] flex flex-col gap-4 p-4">
    <div class="relative flex items-center justify-between">
      <button @click="viewDetailInd=-1" class="btn btn-outline btn-sm absolute border-2 border-purple-950 text-purple-950 bg-[#f3f1ff] hover:text-purple-950 hover:bg-[#f3f1ff] px-5 rounded-xl">返回</button>
      <p class="w-full text-center font-bold text-2xl">{{ exerciseResourcesList[viewDetailInd] ? exerciseResourcesList[viewDetailInd]['resource_name'] : '' }}</p>
      <p class="absolute right-[10px]">大小：{{ exerciseResourcesList[viewDetailInd] ? exerciseResourcesList[viewDetailInd]['resource_size'] : '' }}</p>
    </div>
    <div class="w-full flex justify-center mt-4 mb-8">
      <iframe
          :src="exerciseResourcesList[viewDetailInd] ? exerciseResourcesList[viewDetailInd]['resource_url'] : '' "
          class="w-full h-screen"
      ></iframe>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import { materialMenu } from "../../components"
import { getExerciseResourcesListAPI, getSubjectListAPI } from "../../apis"
import { useRequest } from "vue-hooks-plus";

const viewDetailInd = ref<number>(-1);

const choSubject = ref<number>(-1);

watch(()=>choSubject.value,()=>{
  exerciseResourcesList.value = exerciseResourcesList.value.slice(0,1)
})

const subjectList = ref<Array<string>>([])

const exerciseResourcesList = ref<Array<object>>([])

onMounted(()=>{
  getSubjectList()
  getExerciseResourcesList()
})

const getExerciseResourcesList = () => {
  useRequest(()=>getExerciseResourcesListAPI(localStorage.getItem('token')),{
    onSuccess(res){
      if(res['code']===200){
        console.log(res)
        exerciseResourcesList.value = res['data']['resource_list']
      }else{

      }
    }
  })
}

const chooseSubject = (ind) => {
  choSubject.value = ind
}

const getSubjectList = () => {
  useRequest(()=>getSubjectListAPI(localStorage.getItem('token')),{
    onSuccess(res){
      if(res['code']===200){
        subjectList.value = res['data']
      }else{

      }
    }
  })
}
</script>

<style scoped>

</style>