<template>
  <div class="pdf-preview">
    <vue-pdf-embed
        :source="state.source"
        v-for="page in state.numPages"
        :page="page"
        :key="page"
        textLayer
    ></vue-pdf-embed>
  </div>
</template>
<script setup lang="ts">
import { reactive, onMounted, computed, ref } from 'vue';
import VuePdfEmbed from 'vue-pdf-embed';
import { createLoadingTask } from 'vue3-pdfjs';
import { getFileInfoIO } from '@/api/file/index';

const props = defineProps({
  pdfUrl: {
    type: String
  },
  pdfId: {
    type: Number
  }
});

const state = reactive({
  source: undefined,
  pageNum: 1,
  scale: 1, // 缩放比例
  numPages: 0 // 总页数
});

onMounted(() => {
  if (props.pdfId) {
    getFileInfoIO(props.pdfId)
        .then((fileInfoRes) => {
          const binaryString = atob(fileInfoRes?.data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: 'application/octet-stream' });
          const fileStream = URL.createObjectURL(blob);
          console.log('fileStream', fileStream);
          state.source = fileStream;
          const loadingTask = createLoadingTask(fileStream);
          loadingTask.promise.then((pdf: { numPages: number }) => {
            state.numPages = pdf.numPages;
          });
        })
        .catch(() => {});
  }
});
</script>
<style lang="css" scoped>
.vue-pdf-embed {
  text-align: center;
  width: 515px;
  margin: 0 auto;
  box-sizing: border-box;
}

.pdf-preview {
  position: relative;
  height: 70vh !important;
  padding: 20px 0;
  box-sizing: border-box;
  background-color: e9e9e9;
}
.pdf-wrap {
  overflow-y: auto;
}
.vue-pdf-embed {
  text-align: center;
  width: 515px;
  margin: 0 auto;
  box-sizing: border-box;
}

.page-tool {
  position: absolute;
  bottom: 35px;
  padding-left: 15px;
  padding-right: 15px;
  display: flex;
  align-items: center;
  color: white;
  border-radius: 19px;
  z-index: 100;
  cursor: pointer;
  margin-left: 50%;
  transform: translateX(-50%);
}
.page-tool-item {
  padding: 8px 15px;
  padding-left: 10px;
  cursor: pointer;
}

body {
  padding: 16px;
  background-color: #ccc;
}

.vue-pdf-embed {
  margin: 0 auto;
}

.vue-pdf-embed__page {
  margin-bottom: 8px;
  box-shadow: 0 2px 8px 4px rgba(0, 0, 0, 0.1);
}
</style>