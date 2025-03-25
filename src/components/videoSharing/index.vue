<template>
<div>
  <div v-show="!isShowPublishVideoForm">     <!-- 列表显示 -->
    <div v-show="viewVideoDetailsInd===-1">
      <!-- 搜索框 -->
      <div class="flex gap-8">
        <label class="input input-bordered flex items-center gap-2">
          <input v-model="searchVideoKey" type="text" class="grow w-[800px]" placeholder="在此处可以输入关键词查找相关的视频" />
          <el-icon><Search /></el-icon>
        </label>
        <button @click="openPublishForm" class="btn bg-[#e5dbf5] text-[#67578f] hover:bg-[#e5dbf5]">上传我的视频</button>
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
            v-for="(value,index) in videoResourceList"
            class="bg-white p-4 w-[480px] h-[340px] relative"
        >
          <div class="flex items-center">
            <div class="avatar">
              <div class="w-12 rounded-full">
                <img :src="value['avatar']" />
              </div>
            </div>
            <p class="ml-4 font-bold text-sm">{{ value['username'] }}</p>
            <p class="font-bold text-2xl ml-4 w-[200px] truncate">{{ value['title'] }}</p>
            <div @click="viewDetails(index)" class="absolute right-[20px]"><button @click="isShowPublishCoursewareForm=false" class="btn btn-outline btn-sm border-2 border-purple-950 text-purple-950 bg-[#f3f1ff] hover:text-purple-950 hover:bg-[#f3f1ff] px-5 rounded-xl">查看详情</button></div>
          </div>
          <img :src="value['cover_img']" class="mt-4 max-h-[250px]">
        </div>
      </div>
      <!-- 助手角色 -->
      <div v-show="choSubjectInd === -1 || !videoResourceList" class="fixed bottom-[30px]">
        <img :src="assistantRoleSrc" class="w-[350px]">
      </div>
    </div>
    <div v-if="viewVideoDetailsInd!==-1" class="bg-[#f3f1ff] p-4 mb-4">     <!-- 详情显示 -->
      <div class="bg-white p-5 w-[1000px] h-[830px] relative">
        <div class="flex items-center">
          <button @click="viewVideoDetailsInd=-1" class="btn btn-outline btn-sm border-2 border-purple-950 text-purple-950 bg-[#f3f1ff] hover:text-purple-950 hover:bg-[#f3f1ff] px-5 rounded-xl">返回</button>
          <div class="flex flex-col font-bold absolute right-[30px]">
            <p class="text-sm">{{ videoResourceList[viewVideoDetailsInd]['username'] }}</p>
            <p class="text-sm">修改时间：{{ videoResourceList[viewVideoDetailsInd]['updated_at'].split(' ')[0] }}</p>
            <!--          <p class="text-sm">创建时间：{{ videoResourceList[viewVideoDetailsInd]['created_at'].split(' ')[0] }}</p>-->
          </div>
        </div>
        <div class="flex justify-center items-center mt-12 relative">
          <p class="font-bold text-3xl">{{ videoResourceList[viewVideoDetailsInd]['title'] }}</p>
          <div class="flex absolute right-0">
            <button @click="oneClickTransfer" class="btn btn-sm bg-[#ddd6fe] hover:bg-[#c4b5fd]">一键转存</button>
            <button @click="oneClickDownload" class="btn btn-sm bg-[#ddd6fe] hover:bg-[#c4b5fd]">一键下载</button>
          </div>
        </div>
        <div class="mt-6 flex justify-center">
          <video width="864" height="648" controls>
            <source :src="videoResourceList[viewVideoDetailsInd]['content']" type="video/mp4">
            您的浏览器不支持 video 标签。
          </video>
        </div>
      </div>
    </div>
  </div>
  <div v-show="isShowPublishVideoForm" class="bg-[#f3f1ff] p-4">   <!-- 发帖表单 -->
    <div class="bg-white p-4 w-[1000px] relative">
      <div class="flex items-center">
        <button @click="isShowPublishVideoForm=false" class="btn btn-outline btn-sm border-2 border-purple-950 text-purple-950 bg-[#f3f1ff] hover:text-purple-950 hover:bg-[#f3f1ff] px-5 rounded-xl">返回</button>
        <p class="absolute right-[70px] font-semibold">{{ userInfo.username ? userInfo.username : '未设定' }}</p>
      </div>
      <div class="flex flex-col gap-6 mt-6">
        <p class="text-[#9ca3af]">请输入视频相关信息</p>
        <div class="flex gap-6 items-center">
          <p>当前科目：</p>
          <p class="font-bold">{{ subjectList[choSubjectInd] }}</p>
        </div>
        <div class="flex gap-6 items-center">
          <p>视频名称</p>
          <input v-model="publishVideoFormData['title']" type="text" placeholder="请输入视频名称" class="input input-bordered h-[42px] w-[800px]" />
        </div>
        <div class="flex gap-6">
          <p>视频内容</p>
          <el-upload
              ref="videoUpload"
              :on-change="videoFileChange"
              :on-exceed="videoFileExceed"
              class="upload-demo"
              drag
              :auto-upload="false"
              :limit="1"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text flex flex-col gap-2">
              <span class="text-xl font-bold">点击或拖拽文件上传</span>
              <span>上传视频文件，视频大小最多不超过20.00M</span>
            </div>
          </el-upload>
          <p class="ml-12">视频封面</p>
          <el-upload
              ref="videoCoverUpload"
              :on-change="videoCoverFileChange"
              :on-exceed="videoCoverFileExceed"
              class="upload-demo"
              drag
              :auto-upload="false"
              :limit="1"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text flex flex-col gap-2">
              <span class="text-xl font-bold">点击或拖拽文件上传</span>
              <span>上传视频封面，默认不传则为视频第一帧</span>
            </div>
          </el-upload>
        </div>
        <div class="text-center"><button @click="publishVideo" class="btn btn-sm bg-[#65558f] text-white px-8 rounded-xl hover:bg-purple-900">确认上传</button></div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useMainStore } from "../../stores";
import { publishResourcesAPI, getResourcesListAPI, searchResourcesAPI, getSubjectListAPI, resourceFileUploadAPI, oneClickTransferAPI } from "../../apis";
import { useRequest } from "vue-hooks-plus";
import { ElMessage, ElNotification, genFileId, UploadInstance, UploadProps, UploadRawFile } from "element-plus";
import { getAssistantRoleSrc } from "../../themes";
import { request } from "../../apis/request";

const userInfo = useMainStore().userInfoStore().userInfo

const isShowPublishVideoForm = ref<boolean>(false)

const videoResourceList = ref<Array<object>>([])

const publishVideoFormData = ref({
  resource_type: 3,
  title: '',
  content: '',
  cover_img: '',
  subject_name: '',
})

const viewVideoDetailsInd = ref<number>(-1);

const searchVideoKey = ref<string>('')

watch(()=>searchVideoKey.value,()=>{
  run()
})

const subjectList = ref<Array<string>>([])
const choSubjectInd = ref<number>(-1)

watch(()=>choSubjectInd.value,()=>{
  getResourcesList()
})

const videoUpload = ref<UploadInstance>()
const videoFile = ref<File | null>(null)

const videoFileChange = (uploadFile,uploadFiles) => {
  videoFile.value = uploadFile.raw
}
const videoFileExceed: UploadProps['onExceed'] = (files) => {
  videoUpload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  videoUpload.value!.handleStart(file)
}

const videoCoverUpload = ref<UploadInstance>()
const videoCoverFile = ref<File | null>(null)

const videoCoverFileChange = (uploadFile,uploadFiles) => {
  videoCoverFile.value = uploadFile.raw
}
const videoCoverFileExceed: UploadProps['onExceed'] = (files) => {
  videoCoverUpload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  videoCoverUpload.value!.handleStart(file)
}

const assistantRoleSrc = ref<string>('')

onMounted(()=>{
  getSubjectList()
  assistantRoleSrc.value = getAssistantRoleSrc()
})

const getResourcesList = () => {
  if(choSubjectInd.value !== -1)
    useRequest(()=>getResourcesListAPI({
      resource_type:3,
      subject_name:subjectList.value[choSubjectInd.value]}
    ),{
      onSuccess(res){
        if(res['code']===200){
          videoResourceList.value = res['data']
        }else{
          ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
        }
      }
    })
}

const publishVideo = () => {
  useRequest(()=>resourceFileUploadAPI({file:videoFile.value}),{
    onSuccess(res){
      if(res['code']===200){
        publishVideoFormData.value.content = res['data']['url']
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })
  useRequest(()=>resourceFileUploadAPI({file:videoCoverFile.value}),{
    onSuccess(res){
      if(res['code']===200){
        publishVideoFormData.value.cover_img = res['data']['url']
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })

  // 先上传完文件
  let wait = watch(()=>publishVideoFormData.value,()=>{
    if(publishVideoFormData.value.content && (publishVideoFormData.value.cover_img || !videoCoverFile.value)){
      if(publishVideoFormData.value.title==='' || publishVideoFormData.value.content===''){
        wait()
        ElMessage({message: '帖子名称与帖子内容不能为空！', type: 'warning',plain: true,})
        return
      }
      publishVideoFormData.value.subject_name = subjectList.value[choSubjectInd.value]
      useRequest(()=>publishResourcesAPI(publishVideoFormData.value),{
        onSuccess(res){
          if(res['code']===200){
            getResourcesList()
            isShowPublishVideoForm.value = false
            ElMessage({message: '发表成功', type: 'success',plain: true,})
            publishVideoFormData.value = {   // 上传成功后，将数据清空
              resource_type: 3,
              title: '',
              content: '',
              cover_img: '',
              subject_name: '',
            }
            videoFile.value = null
            videoUpload.value!.clearFiles()
            videoCoverFile.value = null
            videoCoverUpload.value!.clearFiles()
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
  resource_type:3,
  keyword:searchVideoKey.value,
  subject_name: subjectList.value[choSubjectInd.value]
}),{
  debounceWait: 1000,
  manual: true,
  onSuccess(res){
    if(res['code']===200){
      videoResourceList.value = res['data']
    }else{
      ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
    }
  }
})

const viewDetails = (ind) => {
  viewVideoDetailsInd.value = ind
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
  isShowPublishVideoForm.value = true
}

const oneClickTransfer = () => {
  useRequest(()=>oneClickTransferAPI({
    file_url: videoResourceList.value[viewVideoDetailsInd.value]['content'],
    subject_name: subjectList.value[choSubjectInd.value]
  }),{
    onSuccess(res){
      if(res['code']===200){
        ElMessage({message: '转存成功', type: 'success',})
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })
}

const oneClickDownload = () => {
  let fileUrl // 文件URL地址

  request(videoResourceList.value[viewVideoDetailsInd.value]['content'],{
    method: "GET",
    responseType: "blob",       //可以在下面用"new Blob()"替代
  }).then((res)=>{
    let fileUrl = URL.createObjectURL(<Blob>res)    //把res内容，转化成一个临时的链接
    let fileName =  fileUrl.substring( fileUrl.lastIndexOf("/")+1 )  // 文件名

    const link = document.createElement('a');
    link.download = fileName;  // 指定下载文件的名称
    link.href = fileUrl;
    link.target = "_blank"
    link.style.display = "none"          // 这个元素不用呈现在页面上，隐藏掉。

    document.body.appendChild( link );
    link.click();

    document.body.removeChild( link );   // 防止多次下载
  })
}
</script>

<style scoped>

</style>