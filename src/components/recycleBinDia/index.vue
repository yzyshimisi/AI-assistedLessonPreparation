<template>
<dialog id="recycleBinDia" class="modal">
  <div @click="clearSelected" class="modal-box max-w-[700px]">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <h3 class="text-xl font-bold">回收站</h3>
    <div class="flex items-center relative">
      <p class="py-4">回收站文件有效期为10天</p>
      <div class="absolute right-[100px]">
        <button @click="restoreAll" class="btn btn-sm btn-success text-base">恢复全部</button>
        <button @click="deleteAll" class="btn btn-sm btn-error text-base ml-4">删除所有</button>
      </div>
    </div>
    <div class="grid grid-cols-3 mt-4">
      <p>文件名</p><p>文件大小</p><p>删除时间</p>
    </div>
    <div
        v-for="(value,index) in recycleList"

        @click="handleClick($event,index)"
        @contextmenu.prevent="openMenu($event,index)"

        class="grid grid-cols-3 mt-2 hover:bg-base-200 hover:cursor-pointer p-1 border-2"
        :class="selectedFileInd.includes(index) ? 'border-black bg-base-200' : 'border-white'"
    >
      <p>{{value['name']}}</p><p>{{value['size']}}</p><p>{{value['deleted_at']}}</p>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
  <ul
      class="menu bg-base-300 rounded-box fixed"
      :class="isShowMenu ? '' : 'invisible'"
      :style="{left:menuPos.left+'px',top:menuPos.top+'px'}"
  >
    <li @click="restoreFile"><a>恢复</a></li>
    <li @click="completelyDel"><a>彻底删除</a></li>
  </ul>
</dialog>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { getRecycleListAPI } from "../../apis"
import { useRequest } from "vue-hooks-plus";
import { ElNotification,ElMessage  } from "element-plus";
import { restoreFileAPI, completelyDelAPI } from "../../apis"

const recycleList = ref<Array<Object>>([]);

const selectedFileInd = ref<Array<number>>([])

const isShowMenu = ref<boolean>(false);
const menuPos = ref({
  left: -1,
  top: -1,
})

watch(()=>isShowMenu.value,(newValue,oldValue)=>{
  if(isShowMenu.value){
    document.body.addEventListener('click',closeMenu)
  }else{
    document.body.removeEventListener('click',closeMenu)
  }
})

onMounted(()=>{
  getRecycleList()
})

const getRecycleList = () => {
  useRequest(()=>getRecycleListAPI(),{
    onBefore(){
      recycleList.value = []
    },
    onSuccess(res){
      if(res['code']===200){
        recycleList.value = res['data']
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    },
  })
}

const selectOne = (ind) => {
  selectedFileInd.value = []
  selectedFileInd.value.push(ind);
}
const selectFile = (ind) => {
  if(!selectedFileInd.value.includes(ind)){
    selectedFileInd.value.push(ind)
  }
}

const handleClick = (event,ind) => {
  if (event.ctrlKey) {
    selectFile(ind);
  }else{
    selectOne(ind);
  }
}

const openMenu = (event,ind) => {
  if(!selectedFileInd.value.includes(ind)){
    selectOne(ind)
  }
  isShowMenu.value = true
  menuPos.value.left = event.clientX
  menuPos.value.top = event.clientY

  window.addEventListener('scroll', closeMenu);
}
const closeMenu = () => {
  isShowMenu.value = false;
  window.removeEventListener('scroll', closeMenu);
}

const restoreFile = () => {
  let ids = []
  for(let i=0; i<selectedFileInd.value.length; i++){
    ids.push(recycleList.value[selectedFileInd.value[i]]['id'])
  }
  useRequest(()=>restoreFileAPI({ids:ids}),{
    onSuccess(res){
      if(res['code']===200){
        ElMessage({message: '恢复成功', type: 'success', plain: true,})
        recycleList.value = recycleList.value.filter((val)=>!ids.includes(val['id']))
        selectedFileInd.value = []
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })
}

const completelyDel = () => {
  let ids = []
  for(let i=0; i<selectedFileInd.value.length; i++){
    ids.push(recycleList.value[selectedFileInd.value[i]]['id'])
  }
  useRequest(()=>completelyDelAPI({ids:ids}),{
    onSuccess(res){
      if(res['code']===200){
        ElMessage({message: '删除成功', type: 'success', plain: true,})
        recycleList.value = recycleList.value.filter((val)=>!ids.includes(val['id']))
        selectedFileInd.value = []
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })
}

const restoreAll = () => {
  for(let i=0; i<recycleList.value.length; i++){
    selectedFileInd.value.push(i)
  }
  restoreFile()
}
const deleteAll = () => {
  for(let i=0; i<recycleList.value.length; i++){
    selectedFileInd.value.push(i)
  }
  completelyDel()
}
</script>

<style scoped>

</style>