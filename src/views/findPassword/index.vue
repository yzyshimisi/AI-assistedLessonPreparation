<template>
<div class="m-[5%] flex justify-center">
  <div class="card bg-base-100 w-1/3 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">找回密码</h2>
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">What is your email?</span>
        </div>
        <div class="flex">
          <input v-model="info.email" type="text" placeholder="Email" class="input input-bordered w-full" />
          <button @click="visible = true" :disabled="isSendingCode || countdown > 0" class="btn btn-warning float-right ml-4">
            {{ countdown > 0 ? `重新发送(${countdown})` : "发送验证码" }}
          </button>
        </div>
        <div v-if="visible" class="mt-5">
          <slide-verify
              ref="block"
              slider-text="拼图验证"
              :imgs="images"
              accuracy="5"
              @again="onAgain"
              @success="onSuccess"
              @fail="onFail"
          ></slide-verify>
        </div>
      </label>
      <input v-model="info.code" type="text" placeholder="Code" class="input input-bordered w-1/5  mt-2" />
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">Please input the new password</span>
        </div>
        <input v-model="info.pass1" type="password" placeholder="New password" class="input input-bordered w-full" />
      </label>
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">Please input again</span>
        </div>
        <input v-model="info.pass2" type="password" placeholder="New password again" class="input input-bordered w-full" />
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
      <button @click="findPass" class="btn btn-accent mt-4">找回</button>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import {ref, reactive, watch} from "vue";
import SlideVerify,{ SlideVerifyInstance } from "vue3-slide-verify";
import "vue3-slide-verify/dist/style.css";
import { useRequest } from "vue-hooks-plus";
import { findPasswordAPI, sendVerificationCodeAPI } from "../../apis"
import { ElNotification } from 'element-plus'
import router from "../../router";

const info = reactive({
  email: "",
  code: "",
  pass1: "",
  pass2: "",
})

const isEqual = ref(true);

const visible = ref(false);  // 拼图显示标识
const images = reactive([
  'https://t7.baidu.com/it/u=2609096218,1652764947&fm=193&f=GIF',
  'https://t7.baidu.com/it/u=2541348729,1193227634&fm=193&f=GIF',
  'https://t7.baidu.com/it/u=2673836711,2234057813&fm=193&f=GIF',
])
const block = ref<SlideVerifyInstance>();

const onAgain = () => { // 检测非人为操作的回调
  block.value?.refresh();
};
const onSuccess = (times:number) => { // 拼图验证成功的回调
  setTimeout(()=>{
    visible.value = false;
    sendVerificationCode();
  },1500);
}

const isSendingCode = ref(false);
const countdown = ref<number>(0);

const sendVerificationCode = () => {
  isSendingCode.value = true;
  countdown.value = 10;

  useRequest(()=>sendVerificationCodeAPI({email:info.email}),{
    onSuccess(res){
      if(res.code===200){
        ElNotification({title: 'Success', message: "验证码发送成功", type: 'success',});
      }else{
        ElNotification({title: 'Warning', message: res.msg, type: 'warning',});
      }
    },
    onError(err){
      ElNotification({title: 'Error', message: err, type: 'error',});
    }
  })

  const countInterval = setInterval(()=>{
    countdown.value--;
    if(countdown.value <= 0){
      clearInterval(countInterval);
      isSendingCode.value = false;
    }
  },1000)
}

const findPass = () => {
  if(info.email === "" || info.code === "" || info.pass1 === "" || info.pass2 === ""){
    ElNotification({title: 'Warning', message: '表单不允许为空！', type: 'warning',});
    return;
  }
  if(!isEqual.value){
    ElNotification({title: 'Warning', message: '两次密码不一致！', type: 'warning',});
    return;
  }
  useRequest(()=>findPasswordAPI({
    email: info.email,
    code: info.code,
    new_password: info.pass1,
  }),{
    onSuccess(res){
      if(res.code === 200) {
        ElNotification({title: 'Success', message: res.msg+"，即将跳转到登录界面", type: 'success', duration: 2000});
        setTimeout(()=>{
          router.push("/login");
        },2000)
      }else{
        ElNotification({title: 'Warning', message: res.msg, type: 'warning',});
      }
    },
    onError(err){
      ElNotification({title: 'Error', message: err, type: 'error',});
    }
  })
}

watch([()=>info.pass1,()=>info.pass2],([new1,new2],[old1,old2])=>{
  if(info.pass1 !== info.pass2 && info.pass2 !== ""){
    isEqual.value = false;
  }else{
    isEqual.value = true;
  }
})
</script>

<style scoped>

</style>