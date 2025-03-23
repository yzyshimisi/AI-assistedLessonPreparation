<template>
<dialog id="shareLinkDia" class="modal">
  <div class="modal-box w-[700px] max-w-[2000px]">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <h3 class="text-lg font-bold">链接分享</h3>
    <p v-if="props.selectedFilesInd.length>0" class="py-4">分享：{{ props.selectedFilesInd.length > 1 ? props.fileList[props.selectedFilesInd[0]]['name'].concat(' 等共').concat(props.selectedFilesInd.length).concat('项') : props.fileList[props.selectedFilesInd[0]]['name'] }}</p>
    <div class="flex flex-col gap-4">
      <div class="flex gap-2 items-center">
        有效期：
        <input v-model="validity" type="radio" name="validity" :value="1" class="radio radio-sm ml-10" checked="checked" />1天
        <input v-model="validity" type="radio" name="validity" :value="7" class="radio radio-sm ml-5" />7天
        <input v-model="validity" type="radio" name="validity" :value="30" class="radio radio-sm ml-5" />30天
        <input v-model="validity" type="radio" name="validity" :value="365" class="radio radio-sm ml-5" />365天
        <input v-model="validity" type="radio" name="validity" :value="0" class="radio radio-sm ml-5" />永久有效
      </div>
      <div class="flex gap-12">
        <p>提取码：</p>
        <div class="flex flex-col gap-4">
          <p>生成提取码</p>
          <div class="flex items-center gap-4">
            <input @click="code=''" v-model="isAutoCode" type="radio" name="isAutoCode" :value="true" class="radio radio-sm ml-5" checked />系统随机生成提取码
          </div>
          <div class="flex items-center gap-4">
            <input v-model="isAutoCode" type="radio" name="isAutoCode" :value="false" class="radio radio-sm ml-5" />
            <div :class="isAutoCode ? '' : 'tooltip tooltip-right'" data-tip="仅支持数字及英文字母">
              <input v-model="code" type="text" placeholder="请输入四位提取码" class="input input-bordered input-sm text-base w-[160px]" :disabled="isAutoCode" />
            </div>
          </div>
        </div>
      </div>
      <p>注：若选择了目录，则目录下的文件均会被分享</p>
      <div class="text-center">
        <button @click="createShare" class="btn rounded-3xl px-8 bg-[#65558f] text-white hover:bg-purple-900">创建链接</button>
      </div>
    </div>
  </div>
</dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { createShareAPI } from "../../apis"
import { useRequest } from "vue-hooks-plus";
import {ElMessage, ElNotification} from "element-plus";

const props = defineProps(['fileList','selectedFilesInd'])

const validity = ref<number>(1)

const isAutoCode = ref<boolean>(true)
const code = ref<string>('')

const createShare = () => {
  let ids = []
  for(let i=0; i<props.selectedFilesInd.length; i++){
    ids.push(props.fileList[props.selectedFilesInd[i]]['id'])
  }
  useRequest(()=>createShareAPI({
    ids: ids,
    validity: validity.value,
    code: code.value,
  }),{
    onSuccess(res){
      if(res['code']===200){
        ElMessage({message: '创建成功', type: 'success', plain: true,})
        shareLinkDia.close()
      }
    },
    onError(err){
      ElNotification({title: 'Error', message: err.toString(), type: 'error',})
    }
  })
}
</script>

<style scoped>

</style>