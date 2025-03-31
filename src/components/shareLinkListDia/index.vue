<template>
<dialog id="shareLinkListDia" class="modal">
  <div class="modal-box">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <h3 class="text-lg font-bold">分享链接</h3>
    <p class="py-4">Press ESC key or click on ✕ button to close</p>
  </div>
</dialog>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import { getShareLinkListAPI } from "../../apis"
import { useRequest } from "vue-hooks-plus";
import { ElNotification } from "element-plus";

const props = defineProps(['parent_id'])

watch(()=>props.parent_id,()=>{
  console.log('aaa')
  getShareLink()
})

const shareLinkList = ref<Array<object>>([])

onMounted(()=>{
  console.log(props.parent_id)
  getShareLink()
})

const getShareLink = () => {
  if(props.parent_id >= 0){
    useRequest(()=>getShareLinkListAPI(localStorage.getItem('token'),{parent_id:props.parent_id}),{
      onSuccess(res){
        if(res['code']===200){
          shareLinkList.value = res['data']['file_list']
          console.log(shareLinkList.value)
        }else{
          ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
        }
      }
    })
  }
}
</script>

<style scoped>

</style>