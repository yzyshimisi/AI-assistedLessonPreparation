<template>
<dialog id="recycleBinDia" @mousedown="startDragSelect" class="modal select-none">
  <div class="modal-box max-w-[700px]">
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
        @mousedown.stop

        class="grid grid-cols-3 mt-2 hover:bg-base-200 hover:cursor-pointer p-1 border-2"
        :class="selectedFileInd.includes(index) ? 'border-black bg-base-200' : 'border-white'"
        name="recycleFile"
    >
      <p>{{value['name']}}</p><p>{{value['size']}}</p><p>{{value['deleted_at']}}</p>
    </div>
  </div>
  <div id="recycleSelectMask" class="fixed bg-blue-200 opacity-30 top-0 left-0"></div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
  <ul
      class="menu bg-base-300 rounded-box fixed"
      :class="isShowMenu ? '' : 'invisible'"
      :style="{left:menuPos.left+'px',top:menuPos.top+'px'}"
      @mousedown.stop
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

const props = defineProps(['isOpen'])
const varemit = defineEmits(['restoreFile'])

watch(()=>props['isOpen'],()=>{
  if(props['isOpen']){
    getRecycleList()
  }
})

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

const selectMask = ref<HTMLElement|null>(null)
const isStartSelect = ref<boolean>(false);
const selectMaskOldPos = ref({
  oldLeft: 0,
  oldTop: 0,
})

const startDragSelect = (event) => {  // 按下鼠标，开始拖动多选
  document.getElementById('recycleBinDia').addEventListener('mousemove',dragSelectMove)
  document.getElementById('recycleBinDia').addEventListener('mouseup',endDragSelect)
  document.getElementById('recycleBinDia').addEventListener('mouseleave',endDragSelect)

  selectedFileInd.value = []

  selectMask.value = document.getElementById('recycleSelectMask') as HTMLElement
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
  document.getElementById('recycleBinDia').removeEventListener('mousemove',dragSelectMove)
  document.getElementById('recycleBinDia').removeEventListener('mouseup',endDragSelect)

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

  const recycleFileList = document.getElementsByName('recycleFile')

  for(let i=0; i<recycleFileList.length; i++){
    let left = recycleFileList[i].getBoundingClientRect().left
    let right = recycleFileList[i].getBoundingClientRect().right
    let top = recycleFileList[i].getBoundingClientRect().top
    let bottom = recycleFileList[i].getBoundingClientRect().bottom

    if (!(top > bottomTwo || right < leftTwo || bottom < topTwo || left > rightTwo)) {  // 碰撞了
      if(!selectedFileInd.value.includes(i)){
        selectedFileInd.value.push(i)
      }
    }else{
      if(selectedFileInd.value.includes(i)){
        selectedFileInd.value = selectedFileInd.value.filter((val)=>val!==i)
      }
    }
  }
}

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
        varemit('restoreFile')
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
  console.log(ids)
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