<template>
<div class="w-[800px]">
  <textarea v-model="textInput" id="textArea" class="textarea textarea-bordered text-lg w-full max-h-[300px] resize-none" placeholder="请输入你想问的问题"></textarea>
</div>
</template>

<script setup lang="ts">
import { ref ,onMounted, watch } from "vue";

const textInput = ref<string>("");

const  observe = (element, event, handler) => {
  element.addEventListener(event, handler, false);
};

onMounted(()=>{
  let textArea = document.getElementById('textArea');
  function resize(){
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + 'px';
    if(textArea.scrollHeight >= 300){
      textArea.style.overflow = 'visible';
    }else{
      textArea.style.overflow = 'hidden';
    }
  }
  function delayedResize(){
    setTimeout(()=>{
      resize();
    },0)
  }
  observe(textArea,'change',resize);
  observe(textArea, 'cut',     delayedResize);
  observe(textArea, 'paste',   delayedResize);
  observe(textArea, 'drop',    delayedResize);
  observe(textArea, 'keydown', delayedResize);

  resize();
})
</script>

<style scoped>

</style>