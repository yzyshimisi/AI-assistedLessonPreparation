<template>
<div class="w-[22vw] min-h-[1200px] bg-base-100 rounded-xl p-5 flex flex-col gap-7">
  <div class="relative flex items-center">
    <p class="w-full text-center text-lg font-bold">说课稿设计</p>
    <div class="absolute flex items-center right-0"><el-icon @click="closeFuncForm()" class="hover:cursor-pointer"><Close /></el-icon></div>
  </div>
  <div>
    <span><span class="text-red-600">* </span>教材名称</span>
    <input @keyup.enter="()=>{if(!formInfo.textbookName) formInfo.textbookName = formDefault.textbookName}" v-model="formInfo['textbookName']" type="text" :placeholder="formDefault.textbookName" class="input input-bordered w-full mt-2" />
  </div>
  <div class="flex gap-4">
    <div>
      <span><span class="text-red-600">* </span>专业学科</span>
      <input @keyup.enter="()=>{if(!formInfo.subject) formInfo.subject = formDefault.subject}" v-model="formInfo['subject']" type="text" :placeholder="formDefault.subject" class="input input-bordered w-full mt-2" />
    </div>
    <div>
      <span><span class="text-red-600">* </span>总课时</span>
      <input @keyup.enter="()=>{if(!formInfo.totalClassHours) formInfo.totalClassHours = formDefault.totalClassHours}" v-model="formInfo['totalClassHours']" type="text" :placeholder="formDefault.totalClassHours" class="input input-bordered w-full mt-2" />
    </div>
  </div>
  <div>
    <div class="flex flex-col flex-1">
      <span><span class="text-red-600">* </span>课题名称</span>
      <input @keyup.enter="()=>{if(!formInfo.topicName) formInfo.topicName = formDefault.topicName}" v-model="formInfo['topicName']" type="text" :placeholder="formDefault.topicName" class="input input-bordered w-full mt-2" />
    </div>
  </div>
  <div class="flex flex-col gap-2">
    <span><span class="text-red-600">* </span>授课对象</span>
    <textarea id="teachingObject" @keydown.enter.prevent @keyup.enter="handleEnter($event,'teachingObject')" v-model="formInfo['teachingObject']" :placeholder="formDefault.teachingObject" class="textarea textarea-bordered text-base resize-none h-[150px]"></textarea>
  </div>
  <div>
    <span><span class="text-red-600">* </span>说课场景</span>
    <input @keyup.enter="()=>{if(!formInfo.lectureScene) formInfo.lectureScene = formDefault.lectureScene}" v-model="formInfo['lectureScene']" type="text" :placeholder="formDefault.lectureScene" class="input input-bordered w-full mt-2" />
  </div>
  <div class="flex flex-col gap-2">
    <span><span class="text-red-600">* </span>写作框架</span>
    <textarea id="writingFramework" @keydown.enter.prevent @keyup.enter="handleEnter($event,'writingFramework')" v-model="formInfo['writingFramework']" :placeholder="formDefault.writingFramework" class="textarea textarea-bordered text-base resize-none h-[180px]"></textarea>
  </div>
  <div class="flex flex-col gap-2">
    <span><span class="text-red-600">* </span>说课稿参考资料</span>
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
        <span>可上传说课稿等材料，文档大小最多不超过20.00M</span>
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
  <div class="flex flex-col gap-2">
    <span><span class="text-red-600">* </span>其他要求</span>
    <textarea id="description" @keydown.enter.prevent @keyup.enter="handleEnter($event,'description')" v-model="formInfo['description']" :placeholder="formDefault.description" class="textarea textarea-bordered text-base resize-none h-[150px]"></textarea>
  </div>
  <img @click="createLessonProposalDesign" src="/aichat/funcFormSub.png" class="hover:cursor-pointer">
</div>
</template>

<script setup lang="ts">
import { nextTick, ref } from "vue";
import type { UploadProps, UploadRawFile, UploadInstance,UploadUserFile } from 'element-plus';
import { ElNotification, genFileId } from 'element-plus';
import { lessonProposalDesignAPI } from "../../apis";
import { useRequest } from "vue-hooks-plus";

const varemit = defineEmits(['closeFuncForm','startQuickFunction','endQuickFunction'])
const props = defineProps(['session_id'])

const formDefault = {
  textbookName: '中国近现代史纲要：2023年版',
  subject: '中国近代史',
  totalClassHours: '1.5',
  topicName: '探究鸦片战争的起因和影响',
  teachingObject: '计算机科学与技术2303，2304班学生',
  lectureScene: '同行评审与交流',
  writingFramework: '一、开头导入\n二、教材分析\n三、学情分析\n四、教学目标\n五、教学重难点\n六、教法学法\n七、说教学过程',
  description: '请按照要求为我生成一份说脱稿设计案例',
}

const formInfo = ref({
  textbookName: '',
  subject: '',
  totalClassHours: '',
  topicName: '',
  teachingObject: '',
  lectureScene: '',
  writingFramework: '',
  description: '',
})

const createLessonProposalDesign = () => {
  varemit('startQuickFunction',formInfo.value.description)
  useRequest(()=>lessonProposalDesignAPI(localStorage.getItem('token'),{session_id:props.session_id}),{
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