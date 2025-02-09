<template>
<div class="flex justify-center w-full mt-[30px]">
  <div class="flex flex-col">
    <el-image src="/login/left.png" class="w-[450px]"/>
    <div class="divider"></div>
  </div>
  <div class="card bg-base-100 w-96 shadow-xl">
    <div class="card-body">
      <h2 class="card-title text-4xl justify-center">注册新用户</h2>
      <label class="input input-bordered flex items-center gap-2 mt-5">
        用户名
        <input v-model="info.username" type="text" class="grow" placeholder="Daisy" />
      </label>
      <label class="input input-bordered flex items-center gap-2 mt-4">
        邮箱
        <input v-model="info.email" type="text" class="grow w-[]" placeholder="daisy@site.com" />
      </label>
      <label class="input input-bordered flex items-center gap-2 mt-4">
        密码
        <input v-model="info.pass1" type="password" class="grow" />
      </label>
      <label class="input input-bordered flex items-center gap-2 mt-4">
        确认密码
        <input v-model="info.pass2" type="password" class="grow" placeholder="" />
      </label>
      <div v-if="!isEqual" role="alert" class="alert alert-warning">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24">
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>Warning: 两次密码不一致</span>
      </div>
      <div @click="register" class="relative h-[30px] cursor-pointer mt-4 mb-5">
        <img src="/btn%20watch.png">
        <div class="absolute top-[30%] left-[40%] text-base-100">点击注册</div>
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
import { ref, watch, reactive } from "vue";
import { useRequest } from "vue-hooks-plus";
import { registerAPI } from "../../apis";
import {ElNotification} from "element-plus";
import router from "../../router";

const info = ref({
  username: "",
  email: "",
  pass1: "",
  pass2: "",
})

const isEqual = ref<boolean>(true);

watch([()=>info.value.pass1,()=>info.value.pass2],([new1,new2],[old1,old2])=>{
  if(info.value.pass1 !== info.value.pass2 && info.value.pass2 !== ""){
    isEqual.value = false;
  }else{
    isEqual.value = true;
  }
},{deep:true})

const register = () => {
  if(info.value.username==="" || info.value.email==="" || info.value.pass1===""){
    ElNotification({title: 'Warning',message: '表单信息为空！', type: 'warning',});
    return;
  }
  if(isEqual.value === false) {
    ElNotification({title: 'Warning', message: '两次密码不一致！', type: 'warning',});
    return
  }

  useRequest(()=>registerAPI({
    username: info.value.username,
    email: info.value.email,
    password: info.value.pass1,
  }),{
    onSuccess(res){
      if(res.code === 200){
        ElNotification({title: 'Success', message: "注册成功", type: 'success',});
        setTimeout(()=>{
          router.push("/login");
        },1000)
      }else{
        ElNotification({title: 'Warning', message: res.msg, type: 'warning',});
      }
    },
    onError(err){
      ElNotification({title: 'Error', message: err, type: 'error',});
    },
  })
}
</script>

<style scoped>

</style>