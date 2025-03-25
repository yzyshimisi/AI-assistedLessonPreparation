<template>
<div>
  <div>
    <div v-show="!isShowPublishCoursewareForm">
      <div v-show="viewCoursewareDetailsInd===-1">      <!-- 列表显示 -->
        <div class="flex gap-8">
          <label class="input input-bordered flex items-center gap-2">
            <input v-model="searchCoursewareKey" type="text" class="grow w-[800px]" placeholder="在此处可以输入关键词查找相关的课件" />
            <el-icon><Search /></el-icon>
          </label>
          <button @click="openPublishForm" class="btn bg-[#e5dbf5] text-[#67578f] hover:bg-[#e5dbf5]">上传我的课件</button>
        </div>
        <!-- 科目列表 -->
        <div class="flex gap-4 w-[1000px] mt-4">
          <button
              v-for="(value,index) in subjectList"
              @click="choSubjectInd = index"
              class="btn btn-sm h-full btn-outline hover:bg-[#e8def7] hover:text-base-content text-base font-normal flex"
              :class="index===choSubjectInd ? 'bg-[#e5dbf5]' : ''"
          >
            <el-icon v-show="index===choSubjectInd"><Select /></el-icon>{{ value }}</button>
        </div>
        <!-- 条目 -->
        <div class="grid grid-cols-2 gap-y-6 bg-[#f3f1ff] p-4 mt-4 mb-8 h-[1000px] w-[1060px] overflow-y-auto">
          <div
              v-for="(value,index) in coursewareResourceList"
              class="bg-white p-4 w-[480px] min-h-[340px] max-h-[500px] relative"
          >
            <div class="flex items-center">
              <div class="avatar">
                <div class="w-12 rounded-full">
                  <img :src="value['avatar']" />
                </div>
              </div>
              <p class="ml-4 font-bold">{{ value['username'] }}</p>
              <p class="font-bold text-3xl ml-4 w-[200px] truncate">{{ value['title'] }}</p>
              <div @click="viewDetails(index)" class="absolute right-[20px]"><button @click="isShowPublishCoursewareForm=false" class="btn btn-outline btn-sm border-2 border-purple-950 text-purple-950 bg-[#f3f1ff] hover:text-purple-950 hover:bg-[#f3f1ff] px-5 rounded-xl">查看详情</button></div>
            </div>
            <img :src="value['cover_img']" class="mt-4 max-h-[250px]">
          </div>
        </div>
      </div>
      <div v-if="viewCoursewareDetailsInd!==-1" class="bg-[#f3f1ff] p-4 mb-4">     <!-- 详情显示 -->
        <div class="bg-white p-5 w-[1000px] h-[830px] relative">
          <div class="flex items-center">
            <button @click="viewCoursewareDetailsInd=-1" class="btn btn-outline btn-sm border-2 border-purple-950 text-purple-950 bg-[#f3f1ff] hover:text-purple-950 hover:bg-[#f3f1ff] px-5 rounded-xl">返回</button>
            <p class="absolute left-1/3 font-bold text-3xl">{{ coursewareResourceList[viewCoursewareDetailsInd]['title'] }}</p>
            <div class="flex flex-col font-bold absolute right-[30px]">
              <p class="text-sm">{{ coursewareResourceList[viewCoursewareDetailsInd]['username'] }}</p>
              <p class="text-sm">修改时间：{{ coursewareResourceList[viewCoursewareDetailsInd]['updated_at'].split(' ')[0] }}</p>
              <!--          <p class="text-sm">创建时间：{{ coursewareResourceList[viewCoursewareDetailsInd]['created_at'].split(' ')[0] }}</p>-->
            </div>
          </div>
          <p>{{ coursewareResourceList[viewCoursewareDetailsInd]['pdf_url'] }}</p>
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
            <p>当前科目：</p>
            <p class="font-bold">{{ subjectList[choSubjectInd] }}</p>
          </div>
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
import {
  publishResourcesAPI,
  getResourcesListAPI,
  searchResourcesAPI,
  resourceFileUploadAPI,
  getSubjectListAPI
} from "../../apis";
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
  subject_name: '',
})

const viewCoursewareDetailsInd = ref<number>(-1);

const searchCoursewareKey = ref<string>('')

watch(()=>searchCoursewareKey.value,()=>{
  run()
})

const subjectList = ref<Array<string>>([])
const choSubjectInd = ref<number>(-1)

watch(()=>choSubjectInd.value,()=>{
  getResourcesList()
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
  getSubjectList()
})

const getResourcesList = () => {
  useRequest(()=>getResourcesListAPI({
    resource_type:2,
    subject_name: subjectList.value[choSubjectInd.value]
  }),{
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

const publishCourseware = async () => {
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

  // 先上传完文件
  let wait = watch(()=>publishCoursewareFormData.value,()=>{
    if(publishCoursewareFormData.value.content && (publishCoursewareFormData.value.cover_img || !coursewareCoverFile.value)){
      if(publishCoursewareFormData.value.title==='' || publishCoursewareFormData.value.content===''){
        wait()
        ElMessage({message: '帖子名称与帖子内容不能为空！', type: 'warning',plain: true,})
        return
      }
      publishCoursewareFormData.value.subject_name = subjectList.value[choSubjectInd.value]
      useRequest(()=>publishResourcesAPI(publishCoursewareFormData.value),{
        onSuccess(res){
          if(res['code']===200){
            getResourcesList()
            isShowPublishCoursewareForm.value = false
            ElMessage({message: '发表成功', type: 'success',plain: true,})
            publishCoursewareFormData.value = {   // 上传成功后，将数据清空
              resource_type: 2,
              title: '',
              content: '',
              cover_img: '',
              subject_name: '',
            }
            coursewareFile.value = null
            coursewareUpload.value!.clearFiles()
            coursewareCoverFile.value = null
            coursewareCoverUpload.value!.clearFiles()
          }else{
            ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
          }
        }
      })
      wait()
    }
  },{deep:true})
}

const { data, run } = useRequest(()=>searchResourcesAPI({
  resource_type: 2,
  keyword: searchCoursewareKey.value,
  subject_name: subjectList.value[choSubjectInd.value]
}),{
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

const getSubjectList = () => {
  useRequest(()=>getSubjectListAPI(),{
    onSuccess(res){
      if(res['code']===200){
        subjectList.value = res['data']
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })
}

const openPublishForm = () => {
  if(choSubjectInd.value === -1){
    ElMessage({message: '请先选择一个科目！', type: 'warning',})
    return
  }
  isShowPublishCoursewareForm.value = true
}
</script>

<style scoped>

</style>