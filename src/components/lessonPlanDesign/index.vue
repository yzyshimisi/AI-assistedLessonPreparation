<template>
<div class="w-[375px] h-[1500px] bg-base-100 rounded-xl p-5 flex flex-col gap-7">
  <div>
    <span><span class="text-red-600">* </span>教案名称</span>
    <input type="text" placeholder="Type here" class="input input-bordered w-full mt-2" />
  </div>
  <div class="flex gap-4">
    <div class="flex flex-col flex-1">
      <span><span class="text-red-600">* </span>专业学科</span>
      <input type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs mt-2" />
    </div>
    <div class="flex flex-col flex-1">
      <span><span class="text-red-600">* </span>总课时</span>
      <select class="select select-bordered w-full max-w-xs mt-2">
        <option disabled selected>Who shot first?</option>
        <option>Han Solo</option>
        <option>Greedo</option>
      </select>
    </div>
  </div>
  <div>
    <span><span class="text-red-600">* </span>课题名称</span>
    <input type="text" placeholder="Type here" class="input input-bordered w-full mt-2" />
  </div>
  <div class="flex flex-col gap-2">
    <span><span class="text-red-600">* </span>教案模板文件</span>
    <el-upload
        class="upload-demo"
        drag
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        multiple
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
        class="upload-demo"
        drag
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        multiple
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
        :on-remove="handleRemove"
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
    <textarea class="textarea textarea-bordered resize-none h-[100px]" placeholder="Bio"></textarea>
  </div>
  <img @click="createLessonPlans" src="/aichat/funcFormSub.png" class="hover:cursor-pointer">
</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { UploadProps, UploadUserFile } from 'element-plus'

const dialogImageUrl = ref('')  // 预览对话框
const dialogVisible = ref(false)  // 对话框显示

const fileList = ref<UploadUserFile[]>([])

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

const createLessonPlans = () => {
  for(let i=0;i<fileList.value.length;i++){
    console.log(fileList.value[i].raw);
  }
}
</script>

<style scoped>

</style>