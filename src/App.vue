<template>
<div class="max-h-[1200px] min-h-screen bg-base-200">
  <img src="/topPic.png" class="w-full h-[75px]">
  <navbar></navbar>
  <div class="flex mt-1">
    <sidebar v-if="loginstore.loginSession"></sidebar>
    <router-view />
  </div>
</div>
</template>

<script setup lang="ts">
import { useMainStore } from "./stores";
import { navbar, sidebar } from "./components"

const loginstore = useMainStore().loginStore();
</script>

<style>
page{
  background-color: #161622;
}
</style>