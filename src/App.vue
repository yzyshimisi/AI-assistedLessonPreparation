<template>
<div class="">
  <img src="/topPic.png" class="w-full h-[75px]">
  <navbar></navbar>
  <div class="flex mt-1 bg-base-200 h-screen">
    <myMenu v-if="loginstore.loginSession"></myMenu>
    <router-view />
  </div>
</div>
</template>

<script setup lang="ts">
import { useMainStore } from "./stores";
import { navbar, myMenu } from "./components"

const loginstore = useMainStore().loginStore();
</script>

<style>
page{
  background-color: #161622;
}
</style>