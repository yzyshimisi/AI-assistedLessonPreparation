<template>
<div class="w-[22vw] min-h-[1200px] bg-base-100 rounded-xl p-5 flex flex-col gap-7">
  <div>
    <span><span class="text-red-600">* </span>教案名称<el-icon @click="closeFuncForm()" class="float-right hover:cursor-pointer"><Close /></el-icon></span>
    <input @keyup.enter="createLessonPlans" v-model="formInfo['textbook_name']" type="text" placeholder="请输入教案的名称" class="input input-bordered w-full mt-2" />
  </div>
  <div class="flex gap-4">
    <div class="flex flex-col flex-1">
      <span><span class="text-red-600">* </span>专业学科</span>
      <input @keyup.enter="createLessonPlans" v-model="formInfo['subject']" type="text" placeholder="请输入专业学科" class="input input-bordered w-full max-w-xs mt-2" />
    </div>
    <div class="flex flex-col flex-1">
      <span><span class="text-red-600">* </span>总课时</span>
      <input @keyup.enter="createLessonPlans" v-model="formInfo['total_hours']" type="text" placeholder="请输入总课时" class="input input-bordered w-full max-w-xs mt-2" />
      <!--      <select class="select select-bordered w-full max-w-xs mt-2 text-base">-->
<!--        <option disabled selected>选择总课时</option>-->
<!--        <option>Han Solo</option>-->
<!--        <option>Greedo</option>-->
<!--      </select>-->
    </div>
  </div>
  <div>
    <span><span class="text-red-600">* </span>课题名称</span>
    <input @keyup.enter="createLessonPlans" v-model="formInfo['topic_name']" type="text" placeholder="请输入课题名称" class="input input-bordered w-full mt-2" />
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
    <textarea @keyup.enter.prevent="handleEnter" v-model="formInfo['description']" class="textarea textarea-bordered text-base resize-none h-[100px]" placeholder="输入其他的要求"></textarea>
  </div>
  <img @click="createLessonPlans" src="/aichat/funcFormSub.png" class="hover:cursor-pointer">
</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { UploadProps, UploadRawFile, UploadInstance,UploadUserFile } from 'element-plus'
import {ElNotification, genFileId} from 'element-plus'
import { lessonPlanUploadAPI, createLessonPlanAPI } from "../../apis"
import {useRequest} from "vue-hooks-plus";

const varemit = defineEmits(["closeFuncForm",'startCreateLessonPlan','endCreateLessonPlan'])
const props = defineProps(['session_id'])

const formInfo = ref<createLessonPlanInfoType>({
  textbook_name: '',
  subject: '',
  total_hours: '',
  topic_name: '',
  template_file: '',
  resource_file: '',
  textbook_img: '',
  description: '',
  session_id: -1,
})

const templateUpload = ref<UploadInstance>()
const templateFile = ref<File | null>(null)

const referenceMaterialUpload = ref<UploadInstance>()
const referenceMaterialFile = ref<File | null>(null)

const fileList = ref<UploadUserFile[]>([])

const dialogImageUrl = ref('')  // 预览对话框
const dialogVisible = ref(false)  // 对话框显示

const lessonPlanRes = ref<string>('')

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {  // 课本图片的显示
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

const templateFileChange = (uploadFile,uploadFiles) => {
  templateFile.value = uploadFile.raw
}
const templateFileExceed: UploadProps['onExceed'] = (files) => {
  templateUpload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  templateUpload.value!.handleStart(file)
}

const referenceMaterialChange = (uploadFile,uploadFiles) => {
  referenceMaterialFile.value = uploadFile.raw
}
const referenceMaterialExceed: UploadProps['onExceed'] = (files) => {
  referenceMaterialUpload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  referenceMaterialUpload.value!.handleStart(file)
}

const createLessonPlans = () => {     // 上传文件，并获取文件的URL
  varemit('startCreateLessonPlan')
  if(fileList.value.length>0){
    for(let i=0;i<fileList.value.length;i++){
      getFileUrl('textbook_img',fileList.value[i].raw)
    }
  }
  if(templateFile.value){
    getFileUrl('template_file',templateFile.value)
  }
  if(referenceMaterialFile.value){
    getFileUrl('resource_file',referenceMaterialFile.value)
  }
  formInfo.value['session_id'] = props.session_id

  createLessonPlan()
}

const createLessonPlan = () => {    // 创建教案
  useRequest(()=>createLessonPlanAPI(formInfo.value),{
    onSuccess(res){
      if(res['code']===200){
        console.log(res)
        lessonPlanRes.value = res['data']['message']
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    },
    onFinally(){
      varemit('endCreateLessonPlan',lessonPlanRes.value)
    }
  })
}

const getFileUrl = (key,file) => {
  useRequest(()=>lessonPlanUploadAPI({file:file}),{
    onSuccess(res){
      if(res['code']===200){
        if(key==='textbook_img'){
          formInfo.value[key] += res['data']['url'] + ','
        }else{
          formInfo.value[key] = res['data']['url']
        }
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })
}

const closeFuncForm = () => {
  varemit('closeFuncForm')
}

const handleEnter = (e) => {
  if(e.ctrlKey && e.keyCode==13) {    //用户点击了ctrl+enter触发
    let textarea = document.getElementById('textArea') as HTMLTextAreaElement
    textarea.value += '\n';
  }else {       //用户点击了enter触发
    createLessonPlans()
  }
}
</script>

<style scoped>

</style>