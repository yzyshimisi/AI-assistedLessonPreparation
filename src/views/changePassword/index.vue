<template>
<div class="flex justify-center items-center h-full">
  <div class="card bg-base-100 w-96 shadow-xl">
    <div class="card-body">
      <div class="flex justify-center">
        <h2 class="card-title">修改密码</h2>
      </div>
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text">旧密码：</span>
        </div>
        <input v-model="info.old_password" type="text" placeholder="Old Password" class="input input-bordered w-full max-w-xs" />
      </label>
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text">新密码：</span>
        </div>
        <input v-model="info.new_pass1" type="password" placeholder="New Password" class="input input-bordered w-full max-w-xs" />
      </label>
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text">再次输入新密码：</span>
        </div>
        <input v-model="info.new_pass2" type="password" placeholder="New Password again" class="input input-bordered w-full max-w-xs" />
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
      <button @click="changePass" class="btn btn-accent mt-5">修改</button>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { ElNotification } from 'element-plus';
import { useRequest } from "vue-hooks-plus";
import { changePassAPI } from "../../apis/";
import router from "../../router";

const info = reactive({
  old_password: "",
  new_pass1: "",
  new_pass2: "",
})

const isEqual = ref(true);

watch([()=>info.new_pass1,()=>info.new_pass2],([new1,new2],[old1,old2])=>{
  if(info.new_pass1 !== info.new_pass2 && info.new_pass2 !== ""){
    isEqual.value = false;
  }else{
    isEqual.value = true;
  }
})

const changePass = () => {
  if(info.old_password=== "" || info.new_pass1==="" || info.new_pass2===""){
    ElNotification({title: 'Warning', message: '表单不允许为空！', type: 'warning',});
    return;
  }
  if(!isEqual.value){
    ElNotification({title: 'Warning', message: '两次密码输入不一致！', type: 'warning',});
    return;
  }
  useRequest(()=>changePassAPI({
    old_password: info.old_password,
    new_password: info.new_pass1,
  }),{
    onSuccess(res){
      if(res.code === 200){
        ElNotification({title: 'Success', message: res.msg + '，修改成功', type: 'success',});
      }else{
        ElNotification({title: 'Warning', message: res.msg, type: 'warning',});
      }
    },
    onError(err){
      ElNotification({title: 'Error', message: err, type: 'error',})
    }
  })
}
</script>

<style scoped>

</style>