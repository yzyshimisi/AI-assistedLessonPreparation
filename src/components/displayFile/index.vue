<template>
<div
    @mouseover="showIcon"
    @mouseout="notShowIcon"
    @click="handleClick"
    @dblclick="changeDirectory"

    :draggable="props.isRename ? false : true"
    class="p-2 hover:bg-slate-100 hover:cursor-pointer flex flex-col"
    :class="props['isSelected'] ? 'bg-slate-100' : ''"
>
  <div class="flex gap-3">
    <div v-show="!props['isSelected']"><img @click.stop="selectFile" src="/myResources/multiChoice/unselected.png" :class="isShowIcon ? '' : 'invisible'"></div>
    <div v-show="props['isSelected']"><img @click.stop="unselectFile" src="/myResources/multiChoice/selected.png"></div>
    <img :src="fileIcon[getFileIconInd(props['fileType'])]" class="size-20">
    <div :class="isShowIcon || props['isSelected'] ? '' : 'invisible'">
      <img v-if="!props.isCollected" @click.stop="collectFile" src="/myResources/interactive/star_Stroke.png">
      <img v-else @click.stop="cancelCollection" src="/myResources/interactive/star_filled.png">
    </div>
  </div>
  <p v-if="!props.isRename" class="text-center truncate">{{props['fileName']}}</p>
  <input v-else @blur.stop="endRenaming" @keyup.enter="endRenaming" ref="renameInput" v-model="newName" type="text" class="input input-xs w-full text-base"/>
</div>
</template>

<script setup lang="ts">
import {onMounted, ref, watchEffect} from "vue";

const varemit = defineEmits(['selectFile','unselectFile','selectOne','changeDirectory','endRenaming','collectFile','cancelCollection'])
const props = defineProps(['index','fileName','fileType','isSelected','isRename','isCollected']);

const newName = ref<string>(props.fileName)
const renameInput = ref(null);

onMounted(()=>{
  // console.log(newName.value)
})

watchEffect(() => {
  if (props.isRename) {
    // 确保input元素已经挂载
    if (renameInput.value) {
      renameInput.value.select();
    }
  }
});

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

const isShowIcon = ref<boolean>(false);

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

const showIcon = () => {
  isShowIcon.value = true
}
const notShowIcon = () => {
  isShowIcon.value = false
}

const endRenaming = () => {
  varemit('endRenaming',newName.value)
}

const selectFile = () => {
  varemit('selectFile',props['index'])
}

const unselectFile =() => {
  varemit('unselectFile',props['index'])
}

const selectOne = () => {
  varemit('selectOne',props['index'])
}

const changeDirectory = () => {
  varemit('changeDirectory',props['index'])
}

const handleClick = (event) => {
  if (event.ctrlKey) {
    selectFile();
  }else{
    selectOne()
  }
}

const collectFile = () => {
  selectOne();
  varemit('collectFile')
}

const cancelCollection = () => {
  varemit('cancelCollection',props.index)
}
</script>

<style scoped>

</style>