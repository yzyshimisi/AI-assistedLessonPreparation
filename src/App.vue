<template>
<div class="min-h-screen min-w-screen bg-base-200">
  <img src="/topPic.png" class="h-[75px] w-full">
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