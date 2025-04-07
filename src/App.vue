<template>
<div class="min-h-screen min-w-screen bg-base-200">
<!--  style="background-image: url('/topPic-Purple.png')"-->
  <div class="relative h-[75px] w-full flex items-center">
    <img src="/topPic-Purple.png" class="absolute w-full h-full z-10">
    <p class="text-base-100 text-2xl ml-[30px] z-20">教小帮-TeachPal</p>
  </div>
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
</style>