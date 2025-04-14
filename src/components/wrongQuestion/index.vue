<template>
<div class="min-h-screen ml-6 mb-4">
  <div class="w-[60vw] flex flex-col gap-4 bg-base-100 p-6">
    <div class="flex gap-4 items-center relative">
      <p class="text-purple-900 text-3xl">错题情况</p>
      <button @click="sendWrongQuestion" class="ml-2 btn btn-outline btn-sm hover:text-black hover:bg-purple-200">一键导出并发送至学生邮箱</button>
      <button @click="varemit('closeWrongQuestion')" class="btn btn-outline btn-sm absolute right-[15px] border-2 border-purple-950 text-purple-950 bg-[#f3f1ff] hover:text-purple-950 hover:bg-[#f3f1ff] px-5 rounded-xl">返回</button>
    </div>
    <div class="h-full w-full p-4 flex flex-col gap-8">
      <div v-for="(value,index) in questionList" class="flex flex-col border-2 border-purple-950 rounded-xl p-4">
        <!-- 题目标题 -->
        <div class="flex gap-2 items-center text-purple-900">
          <p class="text-2xl">错题{{ index+1 }}</p>
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
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRequest } from "vue-hooks-plus";
import { getWrongQuestionAPI, sendWrongQuestionAPI } from "../../apis"
import { singleChoice, multipleChoice, shortAnswer } from "../index"
import { ElMessage } from "element-plus";

const questionType = [
  '单选题',
  '多选题',
  '判断题',
  '填空题',
  '简答题',
]

const questionList = ref<Array<object>>([])

const props = defineProps(['chapter'])
const varemit = defineEmits(['closeWrongQuestion'])

onMounted(()=>{
  getWrongQuestion()
})

const getWrongQuestion = () => {
  useRequest(()=>getWrongQuestionAPI(localStorage.getItem('token')),{
    onSuccess(res){
      if(res['code']===200){
        questionList.value = res['data']['questions']
        console.log(questionList.value)
      }else{

      }
    }
  })
}

const sendWrongQuestion = () => {
  useRequest(()=>sendWrongQuestionAPI(localStorage.getItem('token'),{}),{
    onSuccess(res){
      if(res['code']===200){
        ElMessage({message: '发送成功', type: 'success',})
        downloadFileByURL(res['data']['url'])
      }else{

      }
    }
  })
}

const downloadFileByURL = (url) => {
  let fileName = url.substring( url.lastIndexOf("/")+1 );

  const link = document.createElement('a');
  link.download = fileName;  // 指定下载文件的名称
  link.href = url;
  link.target = "_blank"
  link.style.display = "none"          // 这个元素不用呈现在页面上，隐藏掉。

  document.body.appendChild( link );
  link.click();

  document.body.removeChild( link );   // 防止多次下载
}
</script>

<style scoped>

</style>