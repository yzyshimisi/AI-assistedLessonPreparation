<template>
<div
    @mouseover="showIcon"
    @mouseout="notShowIcon"
    @click="handleClick"
    @dblclick="changeDirectory"

    :draggable="!props.isRename"
    class="p-2 hover:bg-slate-100 hover:cursor-pointer flex flex-col max-w-[500px]"
    :class="props['isSelected'] ? 'bg-slate-100' : ''"
>
  <div class="flex gap-3 max-w-[500px]">
    <div v-show="!props['isSelected']"><img @click.stop="selectFile" src="/myResources/multiChoice/unselected.png" :class="isShowIcon ? '' : 'invisible'"></div>
    <div v-show="props['isSelected']"><img @click.stop="unselectFile" src="/myResources/multiChoice/selected.png"></div>
    <img :src="getFileSrc()" class="size-20">
    <div :class="isShowIcon || props['isSelected'] ? '' : 'invisible'">
      <img v-if="!props.isCollected" @click.stop="collectFile" src="/myResources/interactive/star_Stroke.png">
      <img v-else @click.stop="cancelCollection" src="/myResources/interactive/star_filled.png">
    </div>
  </div>
  <p v-if="!props.isRename" class="text-center truncate">{{ props['fileName'] }}</p>
  <input v-else @blur.stop="endRenaming" @keyup.enter="endRenaming" ref="renameInput" v-model="newName" type="text" class="input input-xs w-full text-base"/>
</div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import { ElNotification } from 'element-plus'

const FILEICON = [
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

const letemit = defineEmits(['selectFile','unselectFile','selectOne','changeDirectory','endRenaming','collectFile','cancelCollection'])
const props = defineProps(['index','fileName','fileType','fileUrl','isSelected','isRename','isCollected']);

watchEffect(() => {
  if (props.isRename) {
    // 确保input元素已经挂载
    if (renameInput.value) {
      renameInput.value.select();
    }
  }
});

const newName = ref<string>(props.fileName)
const renameInput = ref(null);

const imgFile = ref<File|any>(null)
const imgBase64 = ref<any>();   // 如果是图片，就下载下来做成缩略图

onMounted(()=>{
  console.log(props.fileType)
  if(props.fileType.includes('png'))    // 如果是图片，获取缩略图
  {
    getImageFileFromUrl(props.fileUrl,props.fileName).then((res)=>{
      imgFile.value = res
      let fr = new FileReader();        // 生成base64
      fr.readAsDataURL(imgFile.value)
      fr.onload = () => {
        imgBase64.value = fr.result
      }
    }).catch((err)=>{
      ElNotification({title: 'Error', message: err, type: 'error',})
    })
  }
})

const getFileSrc = () => {
  if(props.fileType.includes('png'))
  {
    return imgBase64.value
  }
  else
  {
    return FILEICON[getFileIconInd(props.fileType)]
  }
}

const getImageFileFromUrl = (url, imageName) => {
  return new Promise((resolve, reject) => {
    let blob = null;
    let xhr = new XMLHttpRequest();

    xhr.open("GET", url);
    xhr.setRequestHeader('Accept', 'image/png');
    xhr.responseType = "blob";

    // 加载时处理
    xhr.onload = () => {
      blob = xhr.response;
      let imgFile = new File([blob], imageName, { type: 'image/png' });
      // 返回结果
      resolve(imgFile);
    };
    xhr.onerror = (e) => {
      reject(e)
    };

    // 发送请求
    xhr.send();
  });
}

const getFileIconInd = (type) => {
  switch (type){
    case "文件夹":
      return 0

    case "xlsx文件":
    case "xls文件":
      return 3

    case "pptx文件":
    case "ppt文件":
      return 2

    case "docx文件":
    case "doc文件":
      return 1

    case "mp4文件":
      return 5
  }
}

const showIcon = () => {
  isShowIcon.value = true
}
const notShowIcon = () => {
  isShowIcon.value = false
}

const endRenaming = () => {
  letemit('endRenaming',newName.value)
}

const selectFile = () => {
  letemit('selectFile',props['index'])
}

const unselectFile =() => {
  letemit('unselectFile',props['index'])
}

const selectOne = () => {
  letemit('selectOne',props['index'])
}

const changeDirectory = () => {
  letemit('changeDirectory',props['index'])
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
  letemit('collectFile')
}

const cancelCollection = () => {
  letemit('cancelCollection',props.index)
}
</script>

<style scoped>

</style>