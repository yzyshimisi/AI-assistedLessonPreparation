<template>
<div class="h-[1500px] w-screen">
  <div id="container" class="h-[80vh] flex flex-col gap-4 bg-base-300 mt-6 fixed bottom-0">
    <div id="box" class="border-2 border-black w-[500px] h-[80%]"></div>
    <textarea id="text" class="bg-red-300 h-[80px]"></textarea>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

let originHeight;

onMounted(()=>{
  originHeight = document.getElementById('container').offsetHeight
  window.addEventListener('scroll', handleScroll);
})

const handleScroll = (e) => {
  let box = document.getElementById('box')
  let container = document.getElementById('container')

  console.log(container.offsetHeight)
  let c = window.scrollY
  c = c > 145 ? 145 : c

  container.style.height = (originHeight+c).toString().concat('px')
}
</script>

<style scoped>

</style>