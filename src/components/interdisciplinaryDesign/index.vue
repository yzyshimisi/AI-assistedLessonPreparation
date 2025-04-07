<template>
<div class="w-[22vw] min-h-[1200px] bg-base-100 rounded-xl p-5 flex flex-col gap-7">
  <div class="relative flex items-center">
    <p class="w-full text-center text-lg font-bold">跨学科设计</p>
    <div class="absolute flex items-center right-0"><el-icon @click="closeFuncForm()" class="hover:cursor-pointer"><Close /></el-icon></div>
  </div>
  <div class="flex gap-4">
    <div>
      <span><span class="text-red-600">* </span>主学科</span>
      <input @keyup.enter="()=>{if(!formInfo.mainCourse) formInfo.mainCourse = formDefault.mainCourse}" v-model="formInfo['mainCourse']" type="text" :placeholder="formDefault.mainCourse" class="input input-bordered w-full mt-2" />
    </div>
    <div>
      <span><span class="text-red-600">* </span>阶段</span>
      <input @keyup.enter="()=>{if(!formInfo.stage) formInfo.stage = formDefault.stage}" v-model="formInfo['stage']" type="text" :placeholder="formDefault.stage" class="input input-bordered w-full mt-2" />
    </div>
  </div>
  <div class="flex gap-4">
    <div class="flex flex-col flex-1">
      <span><span class="text-red-600">* </span>教材</span>
      <input @keyup.enter="()=>{if(!formInfo.textbook) formInfo.textbook = formDefault.textbook}" v-model="formInfo['textbook']" type="text" :placeholder="formDefault.textbook" class="input input-bordered w-full max-w-xs mt-2" />
    </div>
    <div class="flex flex-col flex-1">
      <span><span class="text-red-600">* </span>册别</span>
      <input @keyup.enter="()=>{if(!formInfo.bookByBook) formInfo.bookByBook = formDefault.bookByBook}" v-model="formInfo['bookByBook']" type="text" :placeholder="formDefault.bookByBook" class="input input-bordered w-full max-w-xs mt-2" />
    </div>
  </div>
  <div>
    <span><span class="text-red-600">* </span>课题/知识点</span>
    <input @keyup.enter="()=>{if(!formInfo.topic_knowledgePoint) formInfo.topic_knowledgePoint = formDefault.topic_knowledgePoint}" v-model="formInfo['topic_knowledgePoint']" type="text" :placeholder="formDefault.topic_knowledgePoint" class="input input-bordered w-full mt-2" />
  </div>
  <div class="flex flex-col gap-2">
    <span><span class="text-red-600">* </span>相关领域学科</span>
    <textarea id="relatedDisciplines" @keydown.enter.prevent @keyup.enter="handleEnter($event,'relatedDisciplines')" v-model="formInfo['relatedDisciplines']" :placeholder="formDefault.relatedDisciplines" class="textarea textarea-bordered text-base resize-none h-[150px]"></textarea>
  </div>
  <div class="flex flex-col gap-2">
    <span><span class="text-red-600">* </span>活动主题</span>
    <textarea id="subject" @keydown.enter.prevent @keyup.enter="handleEnter($event,'subject')" v-model="formInfo['subject']" :placeholder="formDefault.subject" class="textarea textarea-bordered text-base resize-none h-[150px]"></textarea>
  </div>
  <div class="flex flex-col gap-2">
    <span><span class="text-red-600">* </span>课本图片</span>
    <el-upload
        v-model:file-list="fileList"
        :auto-upload="false"
        list-type="picture-card"
        multiple
        :limit="10"
        :on-preview="handlePictureCardPreview"
    >
      <el-icon><Plus /></el-icon>
      <template #tip>
        <div class="el-upload__tip">
          <span class="text-base">最多支持上传5张图片</span>
        </div>
      </template>
    </el-upload>
    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>
  <div class="flex flex-col gap-2">
    <span><span class="text-red-600">* </span>其他要求</span>
    <textarea id="description" @keydown.enter.prevent @keyup.enter="handleEnter($event,'description')" v-model="formInfo['description']" :placeholder="formDefault.description" class="textarea textarea-bordered text-base resize-none h-[150px]"></textarea>
  </div>
  <img @click="createInterdisciplinaryDesign" src="/aichat/funcFormSub.png" class="hover:cursor-pointer">
</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { UploadProps, UploadRawFile, UploadInstance,UploadUserFile } from 'element-plus';
import { ElNotification, genFileId } from 'element-plus';
import { interdisciplinaryDesignAPI } from "../../apis";
import { useRequest } from "vue-hooks-plus";

const varemit = defineEmits(['closeFuncForm','startQuickFunction','endQuickFunction'])
const props = defineProps(['session_id'])

const formDefault = {
  mainCourse: '中国近代史',
  stage: '大学',
  bookByBook: '全册',
  textbook: '中国近现代史纲要：2023年版',
  topic_knowledgePoint: '鸦片战争前后的中国与世界',
  relatedDisciplines: '历史，军事，社科',
  subject: '探究鸦片战争前后中国与世界的变化',
  description: '请按照要求为我生成一份跨学科设计案例',
}

const formInfo = ref({
  mainCourse: '',
  stage: '',
  bookByBook: '',
  textbook: '',
  topic_knowledgePoint: '',
  relatedDisciplines: '',
  subject: '',
  description: '',
  session_id: -1,
})

const createInterdisciplinaryDesign = () => {
  varemit('startQuickFunction',formInfo.value.description)
  useRequest(()=>interdisciplinaryDesignAPI(localStorage.getItem('token'),{session_id:props.session_id}),{
    onSuccess(res){
      if(res['code']===200){
        varemit('endQuickFunction',res['data']['message'])
      }else{
      }
    }
  })
}

const handleEnter = (e,key) => {
  if(e.ctrlKey && e.keyCode==13) {    // 用户点击了ctrl+enter触发
    // let textarea = document.getElementById(key) as HTMLTextAreaElement
    // textarea.value += '\n';
    formInfo.value[key] += '\n'
  }else {   // 用户点击了enter触发
    if(!formInfo.value[key]) formInfo.value[key] = formDefault[key]
  }
}

const closeFuncForm = () => {
  varemit('closeFuncForm')
}
</script>

<style scoped>

</style>