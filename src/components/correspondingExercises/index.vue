<template>
<div class="min-h-screen ml-6 mb-4">
  <div class="w-[60vw] flex flex-col gap-4 bg-base-100 p-6">
    <div class="flex gap-4 items-center relative">
      <p class="text-purple-900 text-3xl">对应习题</p>
      <div class="ml-4 flex items-center gap-2">
        <div class="w-[25px] h-[25px] rounded-full bg-[#65558f]"></div>
        <p>选择</p>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-[25px] h-[25px] rounded-full border border-purple-950"></div>
        <p>不选择</p>
      </div>
      <button v-if="!isAddPersonalizedDiaLearn" @click="isAddPersonalizedDiaLearn=true"  class="ml-1 btn btn-outline btn-sm hover:text-black hover:bg-purple-200">添加个性化对话学习</button>
      <div v-else class="flex gap-4">
        <button onclick="conversationalLearningDia.showModal()" @click="startPreview=true" class="ml-1 btn btn-outline btn-sm hover:text-black hover:bg-purple-200">预览对话学习</button>
        <button @click="isAddPersonalizedDiaLearn=false" class="ml-1 btn btn-outline btn-sm hover:text-black hover:bg-purple-200">取消个性化对话学习</button>
      </div>
      <button @click="varemit('closeExercises')" class="btn btn-outline btn-sm absolute right-[15px] border-2 border-purple-950 text-purple-950 bg-[#f3f1ff] hover:text-purple-950 hover:bg-[#f3f1ff] px-5 rounded-xl">返回</button>
    </div>
    <div class="flex items-center gap-4">
      <p class="font-bold">已选择-单选题{{questionTypeCnt[0]}}道-多选题{{questionTypeCnt[1]}}道-判断题{{questionTypeCnt[2]}}道-填空题{{questionTypeCnt[3]}}道-简答题{{questionTypeCnt[4]}}道</p>
      <div>
        <button class="btn btn-outline btn-sm hover:text-black hover:bg-purple-200">一键导出并发送至学生邮箱</button>
      </div>
    </div>
    <div class="h-full w-full p-4 flex flex-col gap-8">
      <div
          v-for="(value,index) in questionList"

          @click="chooseQuestion(index)"
          class="flex flex-col border-2 border-purple-950 rounded-xl p-4 hover:cursor-pointer"
          :class="isChoQuestion[index] ? 'bg-[#f2f0fe]' : ''"
      >
        <!-- 题目标题 -->
        <div class="flex gap-2 items-center text-purple-900">
          <p class="text-2xl">练习题{{ index+1 }}</p>
          <p class="ml-2 text-lg">【{{ questionType[value['topic_type']-1] }}】</p>
          <p class="text-lg">【{{ props.chapter }}】</p>
        </div>
        <!-- 题目 -->
        <div class="mt-2">
          <singleChoice
              v-if="value['topic_type'] === 1"
              :questionData="value"
              :options="value['options']"
              stuOrTea="tea"
          ></singleChoice>
          <multipleChoice
              v-if="value['topic_type'] === 2"
              :questionData="value"
              :options="value['options']"
              stuOrTea="tea"
          ></multipleChoice>
          <shortAnswer
              v-if="value['topic_type'] === 5"
              :questionData="value"
              stuOrTea="tea"
          ></shortAnswer>
        </div>
      </div>
<!--      <div class="text-center"><button class="btn btn-sm bg-[#65558f] text-white px-6 rounded-2xl hover:bg-purple-900">提交</button></div>-->
    </div>
  </div>
<!--  <div><button class="btn btn-sm bg-[#65558f] text-white px-6 rounded-2xl hover:bg-purple-900">开启对话学习</button></div>-->
  <!-- 对话学习对话框 -->
  <conversationalLearning
    :startPreview="startPreview"
    @endPreview="startPreview=false"
  ></conversationalLearning>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRequest } from "vue-hooks-plus";
import { generateExercisesAPI } from "../../apis"
import { singleChoice, multipleChoice, shortAnswer, conversationalLearning } from "../index"

const questionType = [
    '单选题',
    '多选题',
    '判断题',
    '填空题',
    '简答题',
]

const questionList = ref<Array<object>>([])
const isChoQuestion = ref<Array<boolean>>([])

const questionTypeCnt = ref<Array<number>>([0,0,0,0,0])

const props = defineProps(['chapter'])
const varemit = defineEmits(['closeExercises'])

const isAddPersonalizedDiaLearn = ref<boolean>(false)

const startPreview = ref<boolean>(false)  // 开始预览对话式学习

onMounted(()=>{
  generateExercises()
})

const chooseQuestion = (ind) => {
  if(isChoQuestion.value[ind]){
    isChoQuestion.value[ind] = false
    questionTypeCnt.value[questionList.value[ind]['topic_type']-1] --
  }else{
    isChoQuestion.value[ind] = true
    questionTypeCnt.value[questionList.value[ind]['topic_type']-1] ++
  }
}

const generateExercises = () => {
  useRequest(()=>generateExercisesAPI(localStorage.getItem('token'),{}),{
    onSuccess(res){
      if(res['code']===200){
        questionList.value = res['data']

        isChoQuestion.value = []  // 是否选择标记
        for(let i=0; i<questionList.value.length; i++){
          isChoQuestion.value.push(false)
        }
      }else{

      }
    }
  })
}
</script>

<style scoped>

</style>