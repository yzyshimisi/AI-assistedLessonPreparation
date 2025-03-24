<template>
<div>
  <div>
    <div v-show="!isShowPublishCoursewareForm">
      <div v-show="viewCoursewareDetailsInd===-1">      <!-- 列表显示 -->
        <div class="flex gap-8 ml-4">
          <label class="input input-bordered flex items-center gap-2">
            <input v-model="searchCoursewareKey" type="text" class="grow w-[800px]" placeholder="在此处可以输入关键词查找相关的课件" />
            <el-icon><Search /></el-icon>
          </label>
          <button @click="isShowPublishCoursewareForm=true" class="btn bg-[#e5dbf5] text-[#67578f] hover:bg-[#e5dbf5]">上传我的课件</button>
        </div>
        <div class="grid grid-cols-2 gap-y-4 bg-[#f3f1ff] p-4 mt-4 mb-8 h-[680px] w-[1060px]">
          <div
              v-for="(value,index) in coursewareResourceList"
              class="bg-white p-4 w-[500px] relative"
          >
            <div class="flex items-center">
              <div class="avatar">
                <div class="w-12 rounded-full">
                  <img :src="value['avatar']" />
                </div>
              </div>
              <p class="ml-4 font-bold">{{ value['username'] }}</p>
              <p class="absolute left-[40%] font-bold text-2xl">{{ value['title'] }}</p>
              <div @click="viewDetails(index)" class="absolute right-[40px]"><button @click="isShowPublishCoursewareForm=false" class="btn btn-outline btn-sm border-2 border-purple-950 text-purple-950 bg-[#f3f1ff] hover:text-purple-950 hover:bg-[#f3f1ff] px-5 rounded-xl">查看详情</button></div>
            </div>
            <img :src="value['cover_img']" class="mt-4">
          </div>
        </div>
      </div>
      <div v-if="viewCoursewareDetailsInd!==-1" class="bg-[#f3f1ff] p-4 mb-4">     <!-- 详情显示 -->
        <div class="bg-white p-5 w-[1000px] h-[830px] relative">
          <div class="flex items-center">
            <button @click="viewCoursewareDetailsInd=-1" class="btn btn-outline btn-sm border-2 border-purple-950 text-purple-950 bg-[#f3f1ff] hover:text-purple-950 hover:bg-[#f3f1ff] px-5 rounded-xl">返回</button>
            <p class="absolute left-1/3 font-bold text-2xl">{{ coursewareResourceList[viewCoursewareDetailsInd]['title'] }}</p>
            <div class="flex flex-col font-bold absolute right-[30px]">
              <p class="text-sm">{{ coursewareResourceList[viewCoursewareDetailsInd]['username'] }}</p>
              <p class="text-sm">修改时间：{{ coursewareResourceList[viewCoursewareDetailsInd]['updated_at'].split(' ')[0] }}</p>
              <!--          <p class="text-sm">创建时间：{{ coursewareResourceList[viewCoursewareDetailsInd]['created_at'].split(' ')[0] }}</p>-->
            </div>
          </div>
<!--          <p class="mt-8 h-[730px] overflow-y-auto" style="white-space: pre-wrap;">{{ coursewareResourceList[viewCoursewareDetailsInd]['content'] }}</p>-->
<!--          <iframe :src="`/PPTXjs-1.21.1/index.html?file=` + coursewareResourceList[viewCoursewareDetailsInd]['content']" width="100%" height="800" frameborder="0"></iframe>-->
        </div>
      </div>
    </div>
    <div v-show="isShowPublishCoursewareForm" class="bg-[#f3f1ff] p-4">   <!-- 发帖表单 -->
      <div class="bg-white p-4 w-[1000px] relative">
        <div class="flex items-center">
          <button @click="isShowPublishCoursewareForm=false" class="btn btn-outline btn-sm border-2 border-purple-950 text-purple-950 bg-[#f3f1ff] hover:text-purple-950 hover:bg-[#f3f1ff] px-5 rounded-xl">返回</button>
          <p class="absolute right-[70px] font-semibold">{{ userInfo.username ? userInfo.username : '未设定' }}</p>
        </div>
        <div class="flex flex-col gap-6 mt-6">
          <p class="text-[#9ca3af]">请输入课件相关信息</p>
          <div class="flex gap-6 items-center">
            <p>课件名称</p>
            <input v-model="publishCoursewareFormData['title']" type="text" placeholder="请输入课件名称" class="input input-bordered h-[42px] w-[800px]" />
          </div>
          <div class="flex gap-6">
            <p>课件内容</p>
            <el-upload
                ref="coursewareUpload"
                :on-change="coursewareFileChange"
                :on-exceed="coursewareFileExceed"
                class="upload-demo"
                drag
                :auto-upload="false"
                :limit="1"
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text flex flex-col gap-2">
                <span class="text-xl font-bold">点击或拖拽文件上传</span>
                <span>上传课件PPT，文档大小最多不超过20.00M</span>
              </div>
            </el-upload>
            <p class="ml-12">课件封面</p>
            <el-upload
                ref="coursewareCoverUpload"
                :on-change="coursewareCoverFileChange"
                :on-exceed="coursewareCoverFileExceed"
                class="upload-demo"
                drag
                :auto-upload="false"
                :limit="1"
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text flex flex-col gap-2">
                <span class="text-xl font-bold">点击或拖拽文件上传</span>
                <span>上传课件封面，默认不传则为PPT首页</span>
              </div>
            </el-upload>
          </div>
          <div class="text-center"><button @click="publishCourseware" class="btn btn-sm bg-[#65558f] text-white px-8 rounded-xl hover:bg-purple-900">确认上传</button></div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useMainStore } from "../../stores";
import { publishResourcesAPI, getResourcesListAPI, searchResourcesAPI, resourceFileUploadAPI } from "../../apis";
import { useRequest } from "vue-hooks-plus";
import {ElMessage, ElNotification, genFileId, UploadInstance, UploadProps, UploadRawFile} from "element-plus";

const userInfo = useMainStore().userInfoStore().userInfo

const isShowPublishCoursewareForm = ref<boolean>(false)

const coursewareResourceList = ref<Array<object>>([])

const publishCoursewareFormData = ref({
  resource_type: 2,
  title: '',
  content: '',
  cover_img: '',
})

const viewCoursewareDetailsInd = ref<number>(-1);

const searchCoursewareKey = ref<string>('')

watch(()=>searchCoursewareKey.value,()=>{
  run()
})

const coursewareUpload = ref<UploadInstance>()
const coursewareFile = ref<File | null>(null)

const coursewareFileChange = (uploadFile,uploadFiles) => {
  coursewareFile.value = uploadFile.raw
}
const coursewareFileExceed: UploadProps['onExceed'] = (files) => {
  coursewareUpload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  coursewareUpload.value!.handleStart(file)
}

const coursewareCoverUpload = ref<UploadInstance>()
const coursewareCoverFile = ref<File | null>(null)

const coursewareCoverFileChange = (uploadFile,uploadFiles) => {
  coursewareCoverFile.value = uploadFile.raw
}
const coursewareCoverFileExceed: UploadProps['onExceed'] = (files) => {
  coursewareCoverUpload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  coursewareCoverUpload.value!.handleStart(file)
}

onMounted(()=>{
  getResourcesList()
})

const getResourcesList = () => {
  useRequest(()=>getResourcesListAPI({resource_type:2}),{
    onSuccess(res){
      if(res['code']===200){
        coursewareResourceList.value = res['data']
        console.log(coursewareResourceList.value)
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })
}

const publishCourseware = () => {
  useRequest(()=>resourceFileUploadAPI({file:coursewareFile.value}),{
    onSuccess(res){
      if(res['code']===200){
        publishCoursewareFormData.value.content = res['data']['url']
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })

  useRequest(()=>resourceFileUploadAPI({file:coursewareCoverFile.value}),{
    onSuccess(res){
      if(res['code']===200){
        publishCoursewareFormData.value.cover_img = res['data']['url']
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })

  if(publishCoursewareFormData.value.title==='' || publishCoursewareFormData.value.content===''){
    ElMessage({message: '帖子名称与帖子内容不能为空！', type: 'warning',plain: true,})
    return
  }
  useRequest(()=>publishResourcesAPI(publishCoursewareFormData.value),{
    onSuccess(res){
      if(res['code']===200){
        getResourcesList()
        isShowPublishCoursewareForm.value = false
        ElMessage({message: '发表成功', type: 'success',plain: true,})
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })
}

const { data, run } = useRequest(()=>searchResourcesAPI({resource_type:2,keyword:searchCoursewareKey.value}),{
  debounceWait: 1000,
  manual: true,
  onSuccess(res){
    if(res['code']===200){
      coursewareResourceList.value = res['data']
    }else{
      ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
    }
  }
})

const viewDetails = (ind) => {
  viewCoursewareDetailsInd.value = ind
}
</script>

<style scoped>

</style>