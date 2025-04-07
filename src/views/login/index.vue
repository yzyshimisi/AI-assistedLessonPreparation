<template>
<div class="flex justify-center w-full mt-[35px]">
  <div class="flex flex-col">
    <el-image src="/login/left.png" class="w-[450px]"/>
    <div class="divider"></div>
  </div>
  <div class="card bg-base-100 w-96 shadow-xl ">
    <div class="card-body">
      <h1 class="card-title text-4xl justify-center">登录</h1>
      <div class="mt-4 justify-center">
        <br />
        <span class="flex justify-center">已有账号，输入邮箱+密码即可</span>
        <span class="flex justify-center">没有账号，先去注册</span>
        <br />
      </div>
      <label class="input input-bordered flex items-center gap-2 mt-4">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="h-4 w-4 opacity-70">
          <path
              d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
          <path
              d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
        </svg>
        <input @keydown.enter="login" v-model="email" type="text" class="grow" placeholder="Email" />
      </label>
      <label class="input input-bordered flex items-center gap-2 mt-4">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="h-4 w-4 opacity-70">
          <path
              fill-rule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clip-rule="evenodd" />
        </svg>
        <input @keydown.enter="login" v-model="password" type="password" class="grow" placeholder="Password" />
      </label>
      <div class="mt-3">
        <router-link to="/login/findPassword" class="text-sm text-blue-700 cursor-pointer hover:underline">忘记密码？</router-link>
      </div>
      <div @click="login" class="relative h-[30px] cursor-pointer mt-3 mb-5">
        <img src="/btn%20watch.png">
        <div class="absolute top-[30%] left-[40%] text-base-100">点击登录</div>
      </div>
    </div>
  </div>
  <div class="flex flex-col">
    <el-image src="/login/right.png" class="w-[450px]" />
    <div class="divider"></div>
  </div>
</div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import { useRequest } from "vue-hooks-plus";
import { loginAPI, getUserInfoAPI } from "../../apis"
import { ElNotification } from 'element-plus'
import { useMainStore } from "../../stores";
import router from "../../router";

const loginstore = useMainStore().loginStore();
const userinfostore = useMainStore().userInfoStore();

const email = ref<string>();
const password = ref<string>();

const login = () => {
  useRequest(()=>loginAPI({"email":email.value, "password":password.value}),{
    onSuccess(res){
      if(res['code'] === 200){
        localStorage.setItem("token",res['data']['token']);
        loginstore.setLogin(true);

        getUserInfo();  // 获取用户信息

        router.push("/chat");

        ElNotification({title: 'Success', message: '登录成功', type: 'success',})
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    },
    onError(err){
      ElNotification({title: 'Error', message: err.toString(), type: 'error',})
    },
  })
}

const getUserInfo = () => {
  useRequest(()=>getUserInfoAPI(localStorage.getItem('token')),{
    onSuccess(res){
      if(res['code']===200){
        userinfostore.setInfo(res['data']);
        userinfostore.changeInfo('assistantRole','C11');
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
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