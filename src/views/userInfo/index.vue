<template>
<div class="h-screen w-screen bg-base-200 flex gap-1">
  <myMenu></myMenu>
  <div class="card bg-base-100 w-[35%] h-[500px] shadow-xl ml-[100px] mt-[50px]">
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
        <div class="text-lg ml-8"><dClickEdit @overModify="overModify" :data="userInfo['username'] ? userInfo['username'] : '未设定'"></dClickEdit></div>
      </div>
      <div class="overflow-x-auto mt-4">
        <table class="table text-lg">
          <tbody>
          <tr>
            <td>邮箱</td>
            <td>{{userInfo.email}}</td>
          </tr>
          <tr>
            <td>用户注册时间</td>
            <td>{{userInfo.created_at}}</td>
          </tr>
          <tr>
            <td>AI陪伴助手角色切换</td>
            <td>
              <select v-model="assistantRole" class="select select-bordered text-base">
                <option disabled selected value="">请选择AI助手形象</option>
                <option>C11</option>
                <option>C19</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>主题色切换</td>
            <td></td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="text-center">
        <button class="btn bg-[#65558f] text-white hover:bg-purple-900 px-8 rounded-3xl">退出登录</button>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import { useMainStore } from "../../stores";
import { dClickEdit, myMenu } from "../../components";
import { useRequest } from "vue-hooks-plus";
import { changeUserInfoAPI, userUploadAPI } from "../../apis";
import { ElNotification, ElMessage } from 'element-plus';

const userinfostore = useMainStore().userInfoStore();

const userInfo = reactive({});
Object.assign(userInfo,userinfostore.userInfo)

const imgBase64 = ref();

const assistantRole = ref<string>(userinfostore.userInfo.assistantRole)

watch(()=>assistantRole.value,()=>{
  try{
    userinfostore.changeInfo('assistantRole',assistantRole.value)
    ElMessage({message: '助手形象切换成功', type: 'success',})
  }catch (err){
    ElMessage({message: '助手形象切换失败', type: 'error',})
  }
})

onMounted(()=>{
  assistantRole.value = userInfo['assistantRole']
})

const avatarChange = (e) => {
  let file = e.raw;
  if(file.size > 10*1024*1024*8) {
    ElMessage({message: '头像文件不能大于十兆', type: 'warning',})
  }
  if(file.type !== "image/jpeg" && file.type !== "image/png" && file.type !== 'image/gif' && file.type !== 'image/bmp' && file.type !=='image/tiff' && file.type !== 'image/webp'){
    ElMessage({message: '文件的格式必须为图片！', type: 'warning',})
    return
  }

  let formData = new FormData();
  formData.append('file', file);
  formData.append('type', '1');

  useRequest(()=>userUploadAPI(formData),{
    onSuccess(res){
      if(res['code']===200){
        ElMessage({message: '上传成功', type: 'success',})
        userInfo['avatar'] = res['data']['url']
        run();
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    },
    onError(err){
      ElNotification({title: 'Error', message: err.toString(), type: 'error',})
    }
  })
}

const { data, run } = useRequest(()=>changeUserInfoAPI({
  username: userInfo['username'],
  avatar: userInfo['avatar'],
}),{
  manual: true,
  onSuccess(res){
    if(res['code']===200){
      ElMessage({message: '修改成功', type: 'success',})
      userinfostore.changeInfo("username",userInfo['username']);
      userinfostore.changeInfo("avatar",userInfo['avatar']);
    }else{
      ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
    }
  },
  onError(err){
    ElNotification({title: 'Error', message: err.toString(), type: 'error',})
  }
})

const overModify = (newName) => {
  userInfo['username'] = newName;
  run()
}
</script>

<style scoped>

</style>