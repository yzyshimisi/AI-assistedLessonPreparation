<template>
<div class="h-screen w-screen bg-base-200 flex gap-1">
  <myMenu></myMenu>
  <ul class="menu rounded-box w-[170px] h-full bg-base-100 relative text-base">
    <li><a>Item 1</a></li>
    <li><a>Item 2</a></li>
    <li><a>Item 3</a></li>
    <div class="absolute bottom-[50px] w-[155px] flex flex-col gap-2">
      <div style="border-bottom: 1px solid #000000;" class="w-[155px]"></div>
      <li><a><el-icon><Star /></el-icon>我的收藏</a></li>
      <li onclick="recycleBinDia.showModal()"><a><el-icon><Delete /></el-icon>回收站</a></li>
      <div style="border-bottom: 1px solid #000000;" class="w-[155px]"></div>
    </div>
  </ul>
  <div class="ml-4 flex flex-col gap-3">
    <div class="breadcrumbs text-sm">
      <ul>
        <li v-for="(value,index) in nowPath" @click="backToDirectory(index)"><a>{{ Object.keys(value)[0] }}</a></li>
      </ul>
    </div>
    <div class="bg-base-100 w-[1100px] h-[700px] p-4 relative">
      <div class="flex items-center relative">
        <el-icon @click="createDir" size="40" color="#6b21a8" class="hover:bg-base-300 hover:cursor-pointer"><FolderAdd /></el-icon>
        <div>
          <el-upload
              ref="uploadInput"
              class="flex"
              multiple
              :auto-upload="false"
              :on-change="uploadFile"
          >
            <template #trigger>
              <el-icon size="40" color="#6b21a8" class="hover:bg-base-300 hover:cursor-pointer ml-1"><Upload /></el-icon>
            </template>
          </el-upload>
        </div>
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
          <input v-model="searchKeyWord" type="text" class="grow" placeholder="搜索..." />
        </label>
      </div>
      <div class="divider"></div>
      <div class="flex items-center gap-2 relative">
        <div><img src='/myResources/multiChoice/multiCho.png'></div>
        <span>已选 {{selectedFileNum}} 项</span>
        <div class="bg-violet-200 flex items-center gap-2 text-sm rounded-2xl p-2">
          <div class="flex items-center gap-1 p-1 hover:bg-base-200 hover:cursor-pointer"><el-icon size="20"><Folder /></el-icon><span>移动</span></div>
          <div @click="deleteFile" class="flex items-center gap-1 p-1 hover:bg-base-200 hover:cursor-pointer"><el-icon size="20"><Delete /></el-icon><span>删除</span></div>
          <div class="flex items-center gap-1 p-1 hover:bg-base-200 hover:cursor-pointer"><el-icon size="20"><Download /></el-icon><span>下载</span></div>
          <div @click="collectFile" class="flex items-center gap-1 p-1 hover:bg-base-200 hover:cursor-pointer"><el-icon size="20"><Star /></el-icon><span>收藏</span></div>
          <div class="flex items-center gap-1 p-1 hover:bg-base-200 hover:cursor-pointer"><el-icon size="20"><Warning /></el-icon><span>举报</span></div>
        </div>
        <div class="flex absolute right-0">
<!--          <img src="/myResources/interactive/view-list.png" class="border-2 border-r-0 size-7">-->
<!--          <img src="/myResources/interactive/view-icon.png" class="border-2 size-7">-->
        </div>
      </div>
      <div
          @mousedown="startDragSelect"
          class="w-[1050px] h-[500px] overflow-auto mt-4"
          id="displayFileArea"
      >
        <div class="grid grid-cols-5 auto-rows-[120px] gap-3 w-[800px] h-[400px] overflow-auto mt-4">
          <displayFile
              v-for="(value,index) in fileList" @contextmenu.prevent="openMenu($event,index)"

              @dragstart.stop="handleDragStart($event,index)"
              @dragover.prevent
              @drop="handleDrop($event,index)"
              @mousedown.stop

              @selectFile="selectFile"
              @unselectFile="unselectFile"
              @selectOne="selectOne"
              @endRenaming="endRenaming"
              @changeDirectory="changeDirectory"
              @collectFile="collectFile"

              :isSelected= "selectedFilesInd.includes(index)"
              :index= "index"
              :fileName= "value['name']"
              :fileType= "value['file_type']"
              :isRename= "index===renameFileInd"
              :isCollected= "value['is_collect']"

              :key="value['id']"
              name="displayFile"
          >
          </displayFile>
        </div>
        <div id="selectMask" class="fixed bg-blue-200 opacity-30 top-0 left-0"></div>
      </div>
      <div class="flex items-center absolute bottom-5 w-[950px]">
        <p class="ml-3">共 <span class="text-purple-500">{{pageInfo.total_num}}</span> 条数据</p>
        <div class="absolute left-1/4">
          <el-pagination
              background
              v-model:current-page="pageInfo.page_num"
              v-model:page-size="pageInfo.page_size"
              :page-sizes="[15, 25, 35, 45, 55]"
              size="default"
              layout="sizes, prev, pager, next, jumper"
              :total="pageInfo.total_num"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</div>
<ul
    class="menu bg-base-300 rounded-box fixed"
    :class="isShowMenu ? '' : 'invisible'"
    :style="{left:menuPos.left+'px',top:menuPos.top+'px'}"
>
  <li @click="changeDirectory(selectedFilesInd[0])"><a>打开</a></li>
  <li><a>下载</a></li>
  <li><a>分享</a></li>
  <div style="border-bottom: 1px solid #000000;" class="w-full my-1"></div>
  <li v-show="selectedFilesInd.length === 1" @click="rename"><a>重命名</a></li>
  <li><a>移动到</a></li>
  <li @click="getFileInfo" onclick="fileInfo.showModal()"><a>详细信息</a></li>
  <div style="border-bottom: 1px solid #000000;" class="w-full my-1"></div>
  <li @click="deleteFile"><a>删除</a></li>
</ul>
<dialog id="fileInfo" class="modal">
  <div class="modal-box w-[450px]">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <h3 class="text-lg font-bold">详细信息</h3>
    <div v-for="(value,index) in fileInfoList" class="border-2 mt-4 p-4 text-base">
      <div class="flex items-center gap-3">
        <div>
          <img :src="fileIcon[getFileIconInd(value['file_type'])]" class="size-9">
        </div>
        <p>{{value['name']}}</p>
      </div>
      <div class="divider"></div>
      <div class="grid grid-cols-2 gap-1">
        <span>类型：</span><span>{{ value['file_type'] }}</span>
        <span v-if="value['file_type']==='文件夹'">所含目录数：</span><span v-if="value['file_type']==='文件夹'">{{ value['directory_count'] }}</span>
        <span v-if="value['file_type']==='文件夹'">所含文件数：</span><span v-if="value['file_type']==='文件夹'">{{ value['file_count'] }}</span>
        <span>大小：</span><span>{{ value['size'] }}</span>
        <span>位置：</span><span>{{ value['path'] }}</span>
        <span>修改时间：</span><span>{{ value['updated_at'] }}</span>
      </div>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
<recycleBinDia></recycleBinDia>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, inject } from "vue";
import { useRequest } from "vue-hooks-plus";
import { getFileListAPI, createDirectoryAPI, modifyFileNameAPI, deleteFileAPI, uploadFileAPI, getFileInfoAPI, collectFileAPI, moveFileAPI, searchFileAPI, filterFileTypeAPI } from "../../apis"
import { ElNotification } from 'element-plus'
import { displayFile, myMenu, recycleBinDia } from "../../components"
import { ElMessage } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'

const isExpand = ref<boolean>(false);

const filterDic = {
  '全部': '',
  '视频': '/myResources/fileIcon/display-video.png',
  '音频': '/myResources/fileIcon/display-voice.png',
  '文档': '/myResources/fileIcon/display-word.png',
  '图片': '/myResources/fileIcon/display-picture.png',
  '其他': '/myResources/fileIcon/display-zip.png',
}
const fileIcon = [
  '/myResources/fileIcon/display-folder.png',
  '/myResources/fileIcon/display-word.png',
  '/myResources/fileIcon/display-ppt.png',
  '/myResources/fileIcon/display-excel.png',
  '/myResources/fileIcon/display-picture.png',
  '/myResources/fileIcon/display-video.png',
  '/myResources/fileIcon/display-voice.png',
  '/myResources/fileIcon/display-zip.png',
]

const filterCho = ref<number>(0);

const selectedFilesInd = ref([]);

const selectedFileNum = ref<number>(0);

const fileList = ref([])
const fileInfoList = reactive([]);

interface Path{
  [key: string] : number;
}
const nowPath = reactive<Path[]>([{'Home': 0},])

const pageInfo = reactive({
  page_num: 1,
  page_size: 15,
  total_num: -1,
})

const renameFileInd = ref<number>(-1);

const isShowMenu = ref<boolean>(false);
const menuPos = reactive({left:0,top:0});

watch(()=>isShowMenu.value,(newValue,oldValue)=>{
  if(isShowMenu.value){
    document.body.addEventListener('click',closeMenu)
  }else{
    document.body.removeEventListener('click',closeMenu)
  }
})

const searchKeyWord = ref<string>('');

watch(()=>searchKeyWord.value,(newValue,oldValue)=>{
  searchFile();
})

const selectMask = ref<HTMLElement | null>(null)
const isStartSelect =  ref<boolean>(false)
const selectMaskOldPos = ref({
  oldLeft: 0,
  oldTop: 0,
})

onMounted(()=>{
  getFileList();
})

const startDragSelect = (event) => {  // 按下鼠标，开始拖动多选
  document.getElementById('displayFileArea').addEventListener('mousemove',dragSelectMove)
  document.getElementById('displayFileArea').addEventListener('mouseup',endDragSelect)
  document.getElementById('displayFileArea').addEventListener('mouseleave',endDragSelect)

  selectedFilesInd.value = []
  selectedFileNum.value = 0

  selectMask.value = document.getElementById('selectMask') as HTMLElement
  if(!selectMask.value) return
  isStartSelect.value = true
  selectMask.value.style.top = event.clientY + 'px'
  selectMask.value.style.left = event.clientX + 'px'
  selectMaskOldPos.value['oldLeft'] = event.clientX
  selectMaskOldPos.value['oldTop'] = event.clientY

  // event.preventDefault(); // 阻止默认行为，（注释到了，否则点击外部无法让更改文件名的框失去焦点
  event.stopPropagation(); // 阻止事件冒泡
}

const dragSelectMove = (event) => { // 拖动多选
  if(!selectMask.value) return
  if(!isStartSelect.value) return

  if (event.clientX < selectMaskOldPos.value.oldLeft) { // 水平拖动
    selectMask.value.style.left = event.clientX + 'px';
    selectMask.value.style.width = (selectMaskOldPos.value.oldLeft - event.clientX) + 'px';
  } else {
    selectMask.value.style.width = (event.clientX - selectMaskOldPos.value.oldLeft) + 'px';
  }
  if (event.clientY < selectMaskOldPos.value.oldTop) { // 垂直拖动
    selectMask.value.style.top = event.clientY + 'px';
    selectMask.value.style.height = (selectMaskOldPos.value.oldTop - event.clientY) + 'px';
  } else {
    selectMask.value.style.height = (event.clientY - selectMaskOldPos.value.oldTop) + 'px';
  }

  findSelected()

  event.preventDefault(); // 阻止默认行为
  event.stopPropagation() // 阻止事件冒泡
}

const endDragSelect = (event) => {  // 结束拖动多选
  document.getElementById('displayFileArea').removeEventListener('mousemove',dragSelectMove)
  document.getElementById('displayFileArea').removeEventListener('mouseup',endDragSelect)

  if(!selectMask.value) return

  isStartSelect.value = false

  selectMask.value.style.width = '0';
  selectMask.value.style.height = '0';
  selectMask.value.style.top = '0';
  selectMask.value.style.left = '0';
  selectMask.value.style.bottom = '0';
  selectMask.value.style.right = '0';

  event.preventDefault(); // 阻止默认行为
  event.stopPropagation(); // 阻止事件冒泡
}

const findSelected = () => {
  if (!selectMask.value) return;
  selectMask.value.style.bottom = Number(selectMask.value.style.top.split('px')[0]) + Number(
      selectMask.value.style.height.split('px')[0]) + 'px';
  selectMask.value.style.right = Number(selectMask.value.style.left.split('px')[0]) + Number(
      selectMask.value.style.width.split('px')[0]) + 'px';

  let leftTwo = Number(selectMask.value.style.left.split('px')[0])
  let rightTwo = Number(selectMask.value.style.right.split('px')[0])
  let topTwo = Number(selectMask.value.style.top.split('px')[0])
  let bottomTwo = Number(selectMask.value.style.bottom.split('px')[0])

  const displayFileList = document.getElementsByName('displayFile')

  for(let i=0; i<displayFileList.length; i++){
    let left = displayFileList[i].getBoundingClientRect().left
    let right = displayFileList[i].getBoundingClientRect().right
    let top = displayFileList[i].getBoundingClientRect().top
    let bottom = displayFileList[i].getBoundingClientRect().bottom

    if (!(top > bottomTwo || right < leftTwo || bottom < topTwo || left > rightTwo)) {  // 碰撞了
      if(!selectedFilesInd.value.includes(i)){
        selectedFilesInd.value.push(i)
        selectedFileNum.value ++
      }
    }else{
      if(selectedFilesInd.value.includes(i)){
        selectedFilesInd.value = selectedFilesInd.value.filter((val)=>val!==i)
        selectedFileNum.value --
      }
    }
  }
}

const getFileIconInd = (type) => {
  switch (type){
    case "文件夹":
      return 0
      break
    case 'png文件':
      return 4
      break
  }
}

const getFileList = () => {
  if(filterCho.value === 0){
    useRequest(()=>getFileListAPI({
      parent_id: Object.values(nowPath[nowPath.length-1])[0],
      page_num: pageInfo['page_num'],
      page_size: pageInfo['page_size']
    }),{
      onBefore(){
        fileList.value = []
      },
      onSuccess(res){
        if(res['code']===200){
          if(res['data']['file_list']){
            for(let i=0;i<res['data']['file_list'].length;i++){
              fileList.value.push(res['data']['file_list'][i]);
            }
          }
          pageInfo.total_num = res['data']['total_num']
        }else{
          ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
        }
      }
    })
  }else{
    // useRequest(()=>filterFileTypeAPI({
    //   file_type: filterCho.value,
    //   page_num: pageInfo['page_num'],
    //   page_size: pageInfo['page_size']
    // }))
  }
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
  pageInfo.page_num = 1
  getFileList()
}
const handleCurrentChange = (newPageNum) => {
  pageInfo.page_num = newPageNum
  getFileList()
}

const selectFile = (ind) => {
  if(!selectedFilesInd.value.includes(ind)){
    selectedFileNum.value++;
    selectedFilesInd.value.push(ind);
  }
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

const openMenu = (event,ind) => {
  if(!selectedFilesInd.value.includes(ind)){
    selectOne(ind);
  }
  isShowMenu.value = true
  menuPos.left = event.clientX
  menuPos.top = event.clientY

  window.addEventListener('scroll', closeMenu);
}
const closeMenu = () => {
  isShowMenu.value = false
  window.removeEventListener('scroll', closeMenu);
}

const rename = () => {
  renameFileInd.value = selectedFilesInd.value[0]
}
const endRenaming = (newName) => {
  if(!fileList.value[renameFileInd.value]) return
  if(newName !== fileList.value[renameFileInd.value]['name']){
    useRequest(()=>modifyFileNameAPI({
      id: fileList.value[renameFileInd.value]['id'],
      name: newName,
    }),{
      onSuccess(res){
        if(res['code']===200){
          fileList.value[renameFileInd.value]['name'] = newName
          ElMessage({message: '修改成功', type: 'success',})
          renameFileInd.value = -1;
        }else{
          ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
        }
      },
      onFinally(){
        renameFileInd.value = -1;
      }
    })
  }else{
    renameFileInd.value = -1;
  }
}

const createDir = async () => {
  let path = ''
  path.concat('/')
  for(let i=1;i<nowPath.length;i++){
    path.concat(Object.keys(nowPath[i])[0]).concat('/')
  }
  path.concat('新建文件夹')
  useRequest(()=>createDirectoryAPI({
    name: "新建文件夹",
    path: path,
    parent_id: Object.values(nowPath[nowPath.length-1])[0],
  }),{
    onSuccess: async (res) => {
      if(res['code']===200){
        pageInfo.total_num++;
        if(pageInfo.total_num > pageInfo.page_size){
          handleCurrentChange(Math.floor(pageInfo.total_num / pageInfo.page_size) + 1)
        }else{
          getFileList()
        }
        let tmpDelay = watch(()=>fileList.value,(newValue,oldValue)=>{
          console.log(fileList.value)
          selectOne(fileList.value.length-1);
          renameFileInd.value = fileList.value.length -1;
          tmpDelay();
        },{deep:true})
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    },
    onError(err){
      ElNotification({title: 'Error', message: err.toString(), type: 'error',})
    },
  })
}

const deleteFile = () => {
  const ids = []
  for(let i=0;i<selectedFilesInd.value.length;i++){
    ids.push(fileList.value[selectedFilesInd.value[i]]['id'])
  }
  useRequest(()=>deleteFileAPI({ids:ids}),{
    onSuccess(res){
      if(res['code']===200){
        fileList.value = fileList.value.filter((val)=>!ids.includes(val['id']))

        selectedFilesInd.value = [];
        selectedFileNum.value = 0
        ElMessage({message: '删除成功', type: 'success',})
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    },
    onError(err){
      ElNotification({title: 'Error', message: err.toString(), type: 'error',})
    }
  })
}

const getFileInfo = () => {
  fileInfoList.splice(0,fileInfoList.length)
  for(let i=0; i<selectedFilesInd.value.length; i++ ){
    useRequest(()=>getFileInfoAPI(fileList.value[selectedFilesInd.value[i]]['id']),{
      onSuccess(res){
        if(res['code']===200){
          fileInfoList.push(res['data'])
        }else{
          ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
        }
      }
    })
  }
}

const uploadInput = ref<UploadInstance>(null)
const uploadFile = (uploadFile,uploadFiles) => {
  let path = '/'
  for(let i=1;i<nowPath.length;i++){
    path = path.concat(Object.keys(nowPath[i])[0]).concat('/')
  }

  let file = uploadFile.raw

  path = path.concat(file['name'])

  let formData = new FormData();

  formData.append('parent_id',Object.values(nowPath[nowPath.length-1])[0].toString())
  formData.append('path',path)
  formData.append("file",file)

  useRequest(()=>uploadFileAPI(formData),{
    onBefore(){
      ElMessage('正在上传...')
    },
    onSuccess(res){
      if(res['code']===200){
        ElMessage({message: '上传成功', type: 'success',})
        getFileList();
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    },
    onError(err){
      ElNotification({title: 'Error', message: err.toString(), type: 'error',})
    }
  })
  uploadInput.value!.clearFiles();
}

const changeDirectory = (ind) => {
  if(fileList.value[ind]['file_type']==='文件夹'){
    selectedFileNum.value = 0
    selectedFilesInd.value.splice(0,selectedFilesInd.value.length)

    let pathNode = {}
    pathNode[fileList.value[ind]['name']] = fileList.value[ind]['id']
    nowPath.push(pathNode)
    getFileList();
  }
}

const backToDirectory = (ind) => {
  nowPath.splice(ind+1,nowPath.length)
  getFileList();
}

const collectFile = () => {
  let a = []
  for(let i=0; i<selectedFilesInd.value.length; i++){
    a.push(fileList.value[selectedFilesInd.value[i]]['id'])
  }
  if(a.length>0){
    useRequest(()=>collectFileAPI({ids:a}),{
      onSuccess(res){
        if(res['code']===200){
          ElMessage({message: '收藏成功', type: 'success',})
        }else{
          ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
        }
      },
      onFinally(){
        for(let i=0; i<selectedFilesInd.value.length; i++){
          fileList.value[selectedFilesInd.value[i]]['is_collect'] = true;
        }
      }
    })
  }
}

const moveFile = (ids:Array<number>,parent_id:number) => {
  useRequest(()=>moveFileAPI({
    ids: ids,
    parent_id: parent_id,
  }),{
    onSuccess(res){
      if(res['code']===200){
        ElMessage({message: '移动成功', type: 'success',})
        fileList.value = fileList.value.filter((val)=>!ids.includes(val['id']))
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })
}

const handleDragStart = (event,ind) => {    // 拖动文件
  event.dataTransfer.setData('index',ind);
}
const handleDrop = (event,ind) => {   // 释放拖动的文件

  event.preventDefault();
  const sourceInd = event.dataTransfer.getData('index')

  let parent_id = fileList.value[ind]['id']
  let ids = []

  if(selectedFilesInd.value.includes(Number(sourceInd))){
    for(let i=0;i<selectedFilesInd.value.length; i++){
      ids.push(fileList.value[selectedFilesInd.value[i]]['id'])
    }
  }else{
    ids.push(fileList.value[Number(sourceInd)]['id'])
  }

  if(ids.includes(fileList.value[ind]['id']) && ids.length===1){
    return
  }else if(ids.includes(fileList.value[ind]['id'])){
    ids = ids.filter((val)=>val!==fileList.value[ind]['id'])
  }

  moveFile(ids,parent_id)
  selectedFilesInd.value = []
}

const searchFile = () => {
  useRequest(()=>searchFileAPI(searchKeyWord.value),{
    onSuccess(res){
      if(res['code']===200){
        console.log(res)
      }else{
        console.log(res)
      }
    }
  })
}
</script>

<style scoped>

</style>