<template>
<div class="flex justify-center items-center h-full">
  <div class="card bg-base-100 w-[30%] shadow-xl">
    <div class="card-body">
      <div class="flex items-center">
        <div class="flex flex-col">
          <el-upload
              :auto-upload="false"
              class="avatar-uploader"
              :show-file-list="false"
              :on-change="avatarChange"
          >
            <img :src="imgBase64 ? imgBase64 : userInfo.avatar" class="avatar size-20 rounded-full" />
          </el-upload>
        </div>
        <div class="text-lg ml-8"><dClickEdit :data="toRef(userInfo,'username')"></dClickEdit></div>
      </div>
      <div class="overflow-x-auto mt-4">
        <table class="table text-lg">
          <tbody>
          <!-- row 1 -->
          <tr>
            <td>邮箱</td>
            <td>{{userInfo.email}}</td>
          </tr>
          <!-- row 2 -->
          <tr>
            <td>用户注册时间</td>
            <td>{{userInfo.created_at}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import {reactive, ref, toRef, watch} from "vue";
import { useMainStore } from "../../stores";
import { dClickEdit } from "../../components";
import { useRequest } from "vue-hooks-plus";
import { changeUserInfoAPI } from "../../apis";
import { ElNotification } from 'element-plus';
import { ElMessage } from 'element-plus';

const userinfostore = useMainStore().userInfoStore();

const userInfo = reactive(userinfostore.userInfo);

const imgBase64 = ref();

const avatarChange = (e) => {
  let file = e.raw;
  if(file.size > 10*1024*1024*8){
    ElMessage({message: '头像文件不能大于十兆', type: 'warning',})
  }
  if(file.type !== "image/jpeg" && file.type !== "image/png"){
    ElMessage({message: '文件的格式必须为 JPEG 或者 PNG', type: 'warning',})
  }

  let fr = new FileReader();
  fr.readAsDataURL(file);
  fr.onload = () => {
    imgBase64.value = fr.result;
  }

  let _formData = new FormData();
  _formData.append('file', file);
}

const { data, run } = useRequest(()=>changeUserInfoAPI({
  username: userInfo.username,
  avatar: userInfo.avatar,
}),{
  debounceWait: 2000,
  manual: true,
  onSuccess(res){
    if(res['code']===200){
      userinfostore.changeInfo("username",userInfo.username);
      userinfostore.changeInfo("avatar",userInfo.avatar);
    }else{
      ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
    }
  },
  onError(err){
    ElNotification({title: 'Error', message: err.toString(), type: 'error',})
  }
})

watch([()=>userInfo.username,()=>userInfo.avatar],([new1,new2],[old1,old2])=>{
  run();
})
</script>

<style scoped>

</style>