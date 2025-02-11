<template>
<div class="h-screen w-screen bg-base-200 flex gap-1">
  <div class="w-[120px] h-full bg-base-100 rounded-xl p-3 shadow-xl">
    <span class="flex justify-center text-lg hover:bg-base-300 hover:cursor-pointer">我的资源</span>
    <div style="border-bottom: 2px solid #000000;" class="mt-2"></div>
    <span class="flex justify-center text-lg mt-3 hover:bg-base-300 hover:cursor-pointer">班级管理</span>
    <div style="border-bottom: 2px solid #000000;" class="mt-2"></div>
    <span class="flex justify-center text-lg mt-3 hover:bg-base-300 hover:cursor-pointer">个人信息</span>
    <div style="border-bottom: 2px solid #000000;" class="mt-2"></div>
  </div>
  <div class="w-[170px] h-full bg-base-100 rounded-xl relative">
    <div @click="expandDirectory" class="hover:bg-base-300 hover:cursor-pointer m-4">
      <img v-if="!isExpand" src="/myResources/arrow/chevron-right.png" class="inline">
      <img v-else src="/myResources/arrow/chevron-down.png" class="inline">
      <span class="ml-3">全部</span>
    </div>
    <div class="absolute bottom-[50px]">
      <div style="border-bottom: 1px solid #000000;" class="w-[170px]"></div>
      <div class="m-4 flex items-center gap-2">
        <el-icon><Star /></el-icon>
        <span>我的收藏</span>
      </div>
      <div class="ml-4 mb-4 flex items-center gap-2">
        <el-icon><Delete /></el-icon>
        <span>回收站</span>
      </div>
      <div style="border-bottom: 1px solid #000000;" class="w-[170px]"></div>
    </div>
  </div>
  <div class="ml-4 flex flex-col gap-3">
    <div class="breadcrumbs text-sm">
      <ul>
        <li v-for="(value,index) in nowPath"><a>{{ value }}</a></li>
      </ul>
    </div>
    <div class="bg-base-100 w-[1100px] h-[700px] p-4 relative">
      <div class="flex items-center relative">
        <el-icon @click="createDir" size="40" color="#6b21a8" class="hover:bg-base-300 hover:cursor-pointer"><FolderAdd /></el-icon>
        <el-icon @click="uploadFile" size="40" color="#6b21a8" class="hover:bg-base-300 hover:cursor-pointer ml-1"><Upload /></el-icon>
        <div class="divider lg:divider-horizontal"></div>
        <div class="bg-gray-200 flex gap-1 p-1">
          <div
              v-for="(value,key,index) in filterDic"
              @click="changeFilter(index)"
              :class="index===filterCho ? 'bg-base-100' : ''"
              class="flex items-center gap-1 hover:bg-base-100 hover:cursor-pointer p-1 text-sm"
          >
            <img v-if="value" :src="value" class="size-5"><span>{{key}}</span>
          </div>
        </div>
        <label class="input input-bordered flex items-center gap-2 w-48 h-[40px] absolute right-0">
          <el-icon><Search /></el-icon>
          <input type="text" class="grow" placeholder="搜索..." />
        </label>
      </div>
      <div class="divider"></div>
      <div class="flex items-center gap-2 relative">
        <div><img src='/myResources/multiChoice/multiCho.png'></div>
        <span>已选 {{selectedFileNum}} 项</span>
        <div class="bg-violet-200 flex items-center gap-2 text-sm rounded-2xl p-2">
          <div class="flex items-center gap-1 p-1 hover:bg-base-200 hover:cursor-pointer"><el-icon size="20"><Folder /></el-icon><span>移动</span></div>
          <div class="flex items-center gap-1 p-1 hover:bg-base-200 hover:cursor-pointer"><el-icon size="20"><Delete /></el-icon><span>删除</span></div>
          <div class="flex items-center gap-1 p-1 hover:bg-base-200 hover:cursor-pointer"><el-icon size="20"><Download /></el-icon><span>下载</span></div>
          <div class="flex items-center gap-1 p-1 hover:bg-base-200 hover:cursor-pointer"><el-icon size="20"><Star /></el-icon><span>收藏</span></div>
          <div class="flex items-center gap-1 p-1 hover:bg-base-200 hover:cursor-pointer"><el-icon size="20"><Warning /></el-icon><span>举报</span></div>
        </div>
        <div class="flex absolute right-0">
<!--          <img src="/myResources/interactive/view-list.png" class="border-2 border-r-0 size-7">-->
<!--          <img src="/myResources/interactive/view-icon.png" class="border-2 size-7">-->
        </div>
      </div>
      <div class="grid grid-cols-5 grid-rows-3 gap-3 w-[800px] mt-4">
        <div v-for="(value,index) in fileList">
          <displayFile
              @selectFile="selectFile"
              @unselectFile="unselectFile"
              @selectOne="selectOne"
              @changeDirectory="changeDirectory"

              :isSelected="selectedFilesInd.includes(index)"
              :index="index"
              :fileName="value['name']"
              :fileType="value['file_type']"
          >
          </displayFile>
        </div>
      </div>
      <div class="flex items-center absolute bottom-5 w-[950px]">
        <p class="ml-3">共 <span class="text-purple-500">123</span> 条数据</p>
        <div class="absolute left-1/4">
          <el-pagination
              background
              v-model:current-page="pageInfo.page_num"
              v-model:page-size="pageInfo.page_size"
              :page-sizes="[15, 25, 35, 45, 55]"
              size="default"
              layout="sizes, prev, pager, next, jumper"
              :total="1000"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRequest } from "vue-hooks-plus";
import { getFileListAPI, createDirectoryAPI } from "../../apis"
import { ElNotification } from 'element-plus'
import { displayFile } from "../../components"

const isExpand = ref<boolean>(false);

const filterDic = {
  '全部': '',
  '视频': '/myResources/fileIcon/display-video.png',
  '音频': '/myResources/fileIcon/display-voice.png',
  '文档': '/myResources/fileIcon/display-word.png',
  '图片': '/myResources/fileIcon/display-picture.png',
  '其他': '/myResources/fileIcon/display-zip.png',
}

const filterCho = ref<number>(0);

const selectedFilesInd = ref([]);

const selectedFileNum = ref<number>(0);

const fileList = reactive([])

const nowPath = reactive(['Home'])
const parent_id = ref<number>(0);

const pageInfo = reactive({
  page_num: 1,
  page_size: 15,
  total_page_num: -1,
})

onMounted(()=>{
  getFileList();
})

const getFileList = () => {
  useRequest(()=>getFileListAPI({
    parent_id: parent_id.value,
    page_num: pageInfo['page_num'],
    page_size: pageInfo['page_size']
  }),{
    onSuccess(res){
      if(res['code']===200){
        fileList.splice(0,fileList.length);
        for(let i=0;i<res['data']['file_list'].length;i++){
          fileList.push(res['data']['file_list'][i]);
        }
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    },
    onError(err){
      ElNotification({title: 'Error', message: err.toString(), type: 'error',})
    }
  })
}

const expandDirectory = () => {
  if(isExpand.value) isExpand.value = false;
  else isExpand.value = true;
}

const changeFilter = (ind) => {
  filterCho.value = ind;
}

const handleSizeChange = (newPageSize) => {
  pageInfo.page_size = newPageSize
  getFileList()
}
const handleCurrentChange = (newPageNum) => {
  pageInfo.page_num = newPageNum
  getFileList()
}

const createDir = () => {
  let path = ''
  path.concat('/')
  for(let i=1;i<nowPath.length;i++){
    path.concat(nowPath[i]).concat('/')
  }
  path.concat('新建文件夹')
  useRequest(()=>createDirectoryAPI({
    name: "新建文件夹",
    path: path,
    parent_id: parent_id.value,
  }),{
    onSuccess(res){
      if(res['code']===200){
        getFileList();

      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    },
    onError(err){
      ElNotification({title: 'Error', message: err.toString(), type: 'error',})
    }
  })
}

const selectFile = (ind) => {
  selectedFileNum.value++;
  selectedFilesInd.value.push(ind);
}
const unselectFile = (ind) => {
  selectedFileNum.value--;
  selectedFilesInd.value = selectedFilesInd.value.filter((val)=>val!==ind);
}
const selectOne = (ind) => {
  selectedFileNum.value = 1;
  if(!selectedFilesInd.value.includes(ind)) selectedFilesInd.value.push(ind);
  selectedFilesInd.value = selectedFilesInd.value.filter((val)=>val===ind);
}

const changeDirectory = (ind) => {
}
</script>

<style scoped>

</style>