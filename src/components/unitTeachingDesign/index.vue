<template>
<div class="w-[22vw] min-h-[1200px] bg-base-100 rounded-xl p-5 flex flex-col gap-7">
  <div class="relative flex items-center">
    <p class="w-full text-center text-lg font-bold">单元教学设计</p>
    <div class="absolute flex items-center right-0"><el-icon @click="closeFuncForm()" class="hover:cursor-pointer"><Close /></el-icon></div>
  </div>
  <div>
    <span><span class="text-red-600">* </span>设计名称</span>
    <input @keyup.enter="()=>{if(!formInfo.designName) formInfo.designName = formDefault.designName}" v-model="formInfo['designName']" type="text" :placeholder="formDefault.designName" class="input input-bordered w-full mt-2" />
  </div>
  <div class="flex gap-4">
    <div class="flex flex-col flex-1">
      <span><span class="text-red-600">* </span>专业学科</span>
      <input @keyup.enter="()=>{if(!formInfo.subject) formInfo.subject = formDefault.subject}" v-model="formInfo['subject']" type="text" :placeholder="formDefault.subject" class="input input-bordered w-full max-w-xs mt-2" />
    </div>
    <div class="flex flex-col flex-1">
      <span><span class="text-red-600">* </span>所需课时</span>
      <input @keyup.enter="()=>{if(!formInfo.total_hours) formInfo.total_hours = formDefault.total_hours}" v-model="formInfo['total_hours']" type="text" :placeholder="formDefault.total_hours" class="input input-bordered w-full max-w-xs mt-2" />
    </div>
  </div>
  <div>
    <span><span class="text-red-600">* </span>单元主题</span>
    <input @keyup.enter="()=>{if(!formInfo.unitTheme) formInfo.unitTheme = formDefault.unitTheme}" v-model="formInfo['unitTheme']" type="text" :placeholder="formDefault.unitTheme" class="input input-bordered w-full mt-2" />
  </div>
  <div class="flex flex-col gap-2">
    <span><span class="text-red-600">* </span>单元目录</span>
    <textarea id="unitDirectory" @keydown.enter.prevent @keyup.enter="handleEnter($event,'unitDirectory')" v-model="formInfo['unitDirectory']" :placeholder="formDefault.unitDirectory" class="textarea textarea-bordered text-base resize-none h-[200px]"></textarea>
  </div>
  <div class="flex flex-col gap-2">
    <span><span class="text-red-600">* </span>教案模板文件</span>
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
        <span>可上传教案/逐字稿/课件/作业设计等材料，文档大小最多不超过20.00M</span>
      </div>
    </el-upload>
  </div>
  <div class="flex flex-col gap-2">
    <span><span class="text-red-600">* </span>教案参考资料（课件/逐字稿/教案）</span>
    <el-upload
        ref="referenceMaterialUpload"
        :on-change="referenceMaterialChange"
        :on-exceed="referenceMaterialExceed"
        class="upload-demo"
        drag
        :auto-upload="false"
        :limit="1"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text flex flex-col gap-2">
        <span class="text-xl font-bold">点击或拖拽文件上传</span>
        <span>仅支持上传docx文档格式，文档大小最多不超过10.00M</span>
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
          <span class="text-base">最多支持上传10张图片</span>
        </div>
      </template>
    </el-upload>
    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>
  <div class="flex flex-col gap-2">
    <span><span class="text-red-600">* </span>其他要求</span>
    <textarea id="description" @keydown.enter.prevent @keyup.enter="handleEnter($event,'description')" v-model="formInfo['description']" :placeholder="formDefault.description" class="textarea textarea-bordered text-base resize-none h-[100px]"></textarea>
  </div>
  <img @click="createUnitTeachingDesign" src="/aichat/funcFormSub.png" class="hover:cursor-pointer">
</div>
</template>

<script setup lang="ts">
import { nextTick, ref } from "vue";
import type { UploadProps, UploadRawFile, UploadInstance,UploadUserFile } from 'element-plus';
import { ElNotification, genFileId } from 'element-plus';
import { createUnitTeachingDesignAPI } from "../../apis";
import { useRequest } from "vue-hooks-plus";

const varemit = defineEmits(['closeFuncForm','startQuickFunction','endQuickFunction'])
const props = defineProps(['session_id'])

const formDefault = {
  designName: '中国近代史第一章教学案例',
  subject: '中国近代史',
  total_hours: '8课时',
  unitTheme: '中国近代史历程',
  unitDirectory: '第一节 鸦片战争前后的中国与世界\n' +
      '一、中国封建社会的衰弱\n' +
      '二、世界资本主义的发展与殖民扩张\n' +
      '三、鸦片战争的爆发；\n' +
      '第二节 西方列强对中国的侵略\n' +
      '一、军事侵略\n' +
      '二、政治控制\n' +
      '三、经济掠夺\n' +
      '四、文化渗透；\n' +
      '第三节 反抗外国武装侵略的斗争\n' +
      '一、抵御外来侵略的斗争历程\n' +
      '二、义和团运动与列强瓜分中国图谋咐砐产；\n' +
      '第四节 反侵略战争的失败与民族意识的觉醒\n' +
      '一、反侵略战争的失败及其原因\n' +
      '二、民族意识的觉醒',
  description: '请按照要求为我生成一份大单元教学设计案例',
}

const formInfo = ref({
  designName: '',
  subject: '',
  total_hours: '',
  unitTheme: '',
  unitDirectory: '',
  template_file: '',
  resource_file: '',
  textbook_img: '',
  description: '',
  session_id: -1,
})

const createUnitTeachingDesign = () => {
  varemit('startQuickFunction',formInfo.value.description)
  useRequest(()=>createUnitTeachingDesignAPI(localStorage.getItem('token'),{session_id:props.session_id}),{
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