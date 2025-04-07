<template>
<div class="w-[22vw] min-h-[1200px] bg-base-100 rounded-xl p-5 flex flex-col gap-7">
  <div class="relative flex items-center">
    <p class="w-full text-center text-lg font-bold">单元作业设计</p>
    <div class="absolute flex items-center right-0"><el-icon @click="closeFuncForm()" class="hover:cursor-pointer"><Close /></el-icon></div>
  </div>
  <div class="flex gap-4">
    <div>
      <span><span class="text-red-600">* </span>学科</span>
      <input @keyup.enter="()=>{if(!formInfo.subject) formInfo.subject = formDefault.subject}" v-model="formInfo['subject']" type="text" :placeholder="formDefault.subject" class="input input-bordered w-full mt-2" />
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
    <span><span class="text-red-600">* </span>课题</span>
    <input @keyup.enter="()=>{if(!formInfo.topic) formInfo.topic = formDefault.topic}" v-model="formInfo['topic']" type="text" :placeholder="formDefault.topic" class="input input-bordered w-full mt-2" />
  </div>
  <div class="flex flex-col gap-2">
    <span><span class="text-red-600">* </span>题型</span>
    <input @keyup.enter="()=>{if(!formInfo.questionType) formInfo.questionType = formDefault.questionType}" v-model="formInfo['questionType']" type="text" :placeholder="formDefault.questionType" class="input input-bordered w-full mt-2" />
  </div>
  <div class="flex gap-4">
    <div>
      <span><span class="text-red-600">* </span>题量</span>
      <input @keyup.enter="()=>{if(!formInfo.quantity) formInfo.quantity = formDefault.quantity}" v-model="formInfo['quantity']" type="text" :placeholder="formDefault.quantity" class="input input-bordered w-full mt-2" />
    </div>
    <div>
      <span><span class="text-red-600">* </span>难度</span>
      <input @keyup.enter="()=>{if(!formInfo.difficulty) formInfo.difficulty = formDefault.difficulty}" v-model="formInfo['difficulty']" type="text" :placeholder="formDefault.difficulty" class="input input-bordered w-full mt-2" />
    </div>
  </div>
  <div class="flex flex-col gap-2">
    <span><span class="text-red-600">* </span>考点</span>
    <textarea id="examCenter" @keydown.enter.prevent @keyup.enter="handleEnter($event,'examCenter')" v-model="formInfo['examCenter']" :placeholder="formDefault.examCenter" class="textarea textarea-bordered text-base resize-none h-[100px]"></textarea>
  </div>
  <div class="flex flex-col gap-2">
    <span><span class="text-red-600">* </span>情景</span>
    <textarea id="description" @keydown.enter.prevent @keyup.enter="handleEnter($event,'description')" v-model="formInfo['description']" :placeholder="formDefault.description" class="textarea textarea-bordered text-base resize-none h-[100px]"></textarea>
  </div>
  <div class="flex flex-col gap-2">
    <span><span class="text-red-600">* </span>出题参考资料</span>
    <el-upload
        ref="templateUpload"
        :on-change="templateFileChange"
        :on-exceed="templateFileExceed"
        class="upload-demo"
        drag
        :auto-upload="false"
        :limit="1"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text flex flex-col gap-2">
        <span class="text-xl font-bold">点击或拖拽文件上传</span>
        <span>可上传设计等材料，文档大小最多不超过20.00M</span>
      </div>
    </el-upload>
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
  <img @click="createUnitHomeworkDesign" src="/aichat/funcFormSub.png" class="hover:cursor-pointer">
</div>
</template>

<script setup lang="ts">
import { nextTick, ref } from "vue";
import type { UploadProps, UploadRawFile, UploadInstance,UploadUserFile } from 'element-plus';
import { ElNotification, genFileId } from 'element-plus';
import { unitHomeworkDesignAPI } from "../../apis";
import { useRequest } from "vue-hooks-plus";

const varemit = defineEmits(['closeFuncForm','startQuickFunction','endQuickFunction'])
const props = defineProps(['session_id'])

const formDefault = {
  subject: '中国近代史',
  stage: '大学',
  textbook: '中国近现代史纲要：2023年版',
  bookByBook: '全册',
  topic: '第一章单元小测',
  questionType: '单选题',
  quantity: '10',
  difficulty: '不限',
  examCenter: '世界资本主义的发展与殖民扩张，中英贸易结构差异，《南京条约》的内容，鸦片战争的起因和影响',
  description: '请按照要求为我生成一份单元作业设计案例',
}

const formInfo = ref({
  subject: '',
  stage: '',
  textbook: '',
  bookByBook: '',
  topic: '',
  questionType: '',
  quantity: '',
  difficulty: '',
  examCenter: '',
  description: '',
})

const createUnitHomeworkDesign = () => {
  varemit('startQuickFunction',formInfo.value.description)
  useRequest(()=>unitHomeworkDesignAPI(localStorage.getItem('token'),{session_id:props.session_id}),{
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