<template>
<div class="w-[22vw] min-h-[1200px] bg-base-100 rounded-xl p-5 flex flex-col gap-7">
  <div class="relative flex items-center">
    <p class="w-full text-center text-lg font-bold">一键生成PPT</p>
    <div class="absolute flex items-center right-0"><el-icon @click="closeFuncForm()" class="hover:cursor-pointer"><Close /></el-icon></div>
  </div>
  <div class="text-center">
    上传教案、逐字稿或课件，一键智能生成课件PPT
  </div>
  <div>
    <span><span class="text-red-600">* </span>主题</span>
    <input @keyup.enter="()=>{if(!formInfo.theme) formInfo.theme = formDefault.theme}" v-model="formInfo['theme']" type="text" :placeholder="formDefault.theme" class="input input-bordered w-full mt-2" />
  </div>
  <div class="flex flex-col gap-2">
    <span><span class="text-red-600">* </span>上传课件、教案或逐字稿</span>
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
        <span>支持上传xls,xlsx,txt,pdf,docx,ppt,pptx格式，文件大小最多不超过20.00M</span>
      </div>
    </el-upload>
  </div>
  <div class="flex flex-col gap-2">
    <span><span class="text-red-600">* </span>其他要求</span>
    <textarea id="description" @keydown.enter.prevent @keyup.enter="handleEnter($event,'description')" v-model="formInfo['description']" :placeholder="formDefault.description" class="textarea textarea-bordered text-base resize-none h-[150px]"></textarea>
  </div>
  <img @click="generatePPTOutline" src="/aichat/funcFormSub.png" class="hover:cursor-pointer">
</div>
</template>

<script setup lang="ts">
import { nextTick, ref } from "vue";
import type { UploadProps, UploadRawFile, UploadInstance,UploadUserFile } from 'element-plus';
import { ElNotification, genFileId } from 'element-plus';
import { generatePPTOutlineAPI } from "../../apis";
import { useRequest } from "vue-hooks-plus";

const varemit = defineEmits(['closeFuncForm','startQuickFunction','endQuickFunction'])
const props = defineProps(['session_id'])

const formDefault = {
  theme: '中国近代史重点复习',
  description: '请按照资料为我生成一份PPT',
}

const formInfo = ref({
  theme: '',
  description: '',
})

const generatePPTOutline = () => {
  varemit('startQuickFunction',formInfo.value.description)
  useRequest(()=>generatePPTOutlineAPI(localStorage.getItem('token'),{session_id:props.session_id}),{
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