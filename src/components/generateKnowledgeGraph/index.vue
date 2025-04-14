<template>
  <div class="w-[22vw] min-h-[1200px] bg-base-100 rounded-xl p-5 flex flex-col gap-7">
    <div class="relative flex items-center">
      <p class="w-full text-center text-lg font-bold">一键生成知识图谱</p>
      <div class="absolute flex items-center right-0"><el-icon @click="closeFuncForm()" class="hover:cursor-pointer"><Close /></el-icon></div>
    </div>
    <div class="flex flex-col gap-2">
      <span><span class="text-red-600">* </span>上传文件资料</span>
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
          <span>自动提取文件内容生成知识图谱，文件大小最多不超过20.00M</span>
        </div>
      </el-upload>
    </div>
    <div class="flex flex-col gap-2">
      <span><span class="text-red-600">* </span>其他要求</span>
      <textarea id="description" @keydown.enter.prevent @keyup.enter="handleEnter($event,'description')" v-model="formInfo['description']" :placeholder="formDefault.description" class="textarea textarea-bordered text-base resize-none h-[150px]"></textarea>
    </div>
    <img @click="generateKnowledgeGraph" src="/aichat/funcFormSub.png" class="hover:cursor-pointer">
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref } from "vue";
import type { UploadProps, UploadRawFile, UploadInstance,UploadUserFile } from 'element-plus';
import { ElNotification, genFileId } from 'element-plus';
import { oneClickTransferAPI } from "../../apis";
import { useRequest } from "vue-hooks-plus";
import { generateKnowledgeGraphAPI } from "../../apis"

const varemit = defineEmits(['closeFuncForm','startQuickFunction','endGenerateGraph'])
const props = defineProps(['session_id'])

const formDefault = {
  description: '请按照要求为我生成一份知识图谱',
}

const formInfo = ref({
  description: '',
})

const generateKnowledgeGraph = () => {
  varemit('startQuickFunction',formInfo.value.description)
  useRequest(()=>generateKnowledgeGraphAPI(localStorage.getItem('token'),{session_id:props.session_id}),{
    onSuccess(res){
      if(res['code']===200){
        varemit('endGenerateGraph',res['data'])
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