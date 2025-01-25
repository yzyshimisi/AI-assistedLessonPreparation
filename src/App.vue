<template>
<div class="h-screen">
  <div class="navbar bg-base-100 shadow-md">
    <div class="flex-none">
      <button class="btn btn-square btn-ghost">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block h-5 w-5 stroke-current">
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
    </div>
    <div class="flex-1">
      <a class="btn btn-ghost text-xl">AI辅助的教师备课系统</a>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1">
        <div v-if="!loginstore.loginSession" class="flex">
          <li><router-link to="/login">登录</router-link></li>
          <li><router-link to="/register">注册</router-link></li>
        </div>
        <div v-else>
          <li><a @click="loginOut">退出登录</a></li>
        </div>
        <li>
          <label class="flex cursor-pointer gap-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">
              <circle cx="12" cy="12" r="5" />
              <path
                  d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
            </svg>
            <input data-toggle-theme="light,dark" data-act-class="ACTIVECLASS" type="checkbox" value="synthwave" class="toggle theme-controller" />
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </label>
        </li>
      </ul>
    </div>
  </div>
  <router-view />
  <footer class="footer footer-center bg-base-300 text-base-content p-4 fixed bottom-0">
    <aside>
      <p>Copyright © {new Date().getFullYear()} - All right reserved by ACME Industries Ltd</p>
    </aside>
  </footer>
</div>
</template>

<script setup lang="ts">
import { useMainStore } from "./stores";
import router from "./router";

const loginstore = useMainStore().loginStore();

const loginOut = () => {
  loginstore.setLogin(false);
  router.push('/Login');
}
</script>