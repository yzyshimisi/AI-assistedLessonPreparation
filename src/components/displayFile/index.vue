<template>
<div
    @mouseover="showIcon"
    @mouseout="notShowIcon"
    @click="selectOne"
    @dblclick="changeDirectory"
    class="p-2 hover:bg-base-200 hover:cursor-pointer flex flex-col"
    :class="props['isSelected'] ? 'bg-base-200' : ''">
  <div class="flex gap-3">
    <div v-show="!props['isSelected']"><img @click.stop="selectFile" src="/myResources/multiChoice/unselected.png" :class="isShowIcon ? '' : 'invisible'"></div>
    <div v-show="props['isSelected']"><img @click.stop="unselectFile" src="/myResources/multiChoice/selected.png"></div>
    <img :src="fileIcon[getFileIconInd(props['fileType'])]">
    <div><img src="/myResources/interactive/star_Stroke.png" :class="isShowIcon || props['isSelected'] ? '' : 'invisible'"></div>
  </div>
  <p class="text-center truncate">{{props['fileName']}}</p>
</div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const varemit = defineEmits(['selectFile','unselectFile','selectOne','changeDirectory'])
const props = defineProps(['index','fileName','fileType','isSelected']);

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
    case '':
  }
}

const showIcon = () => {
  isShowIcon.value = true
}
const notShowIcon = () => {
  isShowIcon.value = false
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
</script>

<style scoped>

</style>