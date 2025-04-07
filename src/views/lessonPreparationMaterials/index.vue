<template>
<div class="min-h-screen w-screen bg-base-200 flex gap-1">
  <materialMenu></materialMenu>
  <div v-show="viewDetailInd===-1" class="flex gap-1">  <!-- 显示列表 -->
    <div class="p-3 bg-base-300 rounded-2xl">   <!-- 课程列表 -->
      <p class="text-xl px-4 mt-2 ">大学课程</p>
      <div style="border-bottom: 2px solid #000000;" class="mt-2"></div>
      <div
          v-for="(value,index) in subjectList"
      >
        <p @click="chooseSubject(index)" class="p-1 mt-1 hover:bg-base-200 hover:cursor-pointer">{{ value }}</p>
        <div style="border-bottom: 2px solid #000000;" class="mt-2"></div>
      </div>
    </div>
    <div class="w-[60vw] ml-[20px] mt-[20px]">
      <label class="input input-bordered flex items-center gap-2">    <!-- 搜索框 -->
        <input type="text" class="grow" placeholder="在此处可以搜索相关资料" />
        <el-icon><Search /></el-icon>
      </label>
      <div class="w-full bg-base-100 mt-4 mb-5 p-2 grid grid-cols-4 gap-4">   <!-- 资源列表 -->
        <div v-for="(value,index) in textbookResourcesList" class="shadow-lg flex flex-col gap-2">
          <div class="h-[350px]"><img @click="viewDetailInd=index" :src="value['resource_cover_url']" class="hover:cursor-pointer"></div>
          <p class="w-full text-center truncate mb-3 px-2">{{ value['resource_name'] }}</p>
        </div>
      </div>
    </div>
  </div>
  <div v-show="viewDetailInd !== -1" class="w-[60vw] min-h-screen bg-base-100 ml-[100px] flex flex-col gap-4 p-4">
    <div class="flex items-center justify-between">
      <button @click="viewDetailInd=-1" class="btn btn-outline btn-sm border-2 border-purple-950 text-purple-950 bg-[#f3f1ff] hover:text-purple-950 hover:bg-[#f3f1ff] px-5 rounded-xl">返回</button>
      <p class="select-none">大小：{{ textbookResourcesList[viewDetailInd] ? textbookResourcesList[viewDetailInd]['resource_size'] : '' }}</p>
    </div>
    <div class="flex items-center justify-between mt-4 relative">
      <p class="absolute font-bold text-xl select-none">当前页码：第{{ pageNum }}页</p>
      <p class="w-full text-center font-bold text-2xl">{{ textbookResourcesList[viewDetailInd] ? textbookResourcesList[viewDetailInd]['resource_name'] : '' }}</p>
      <div class="absolute right-[10px] flex flex-col">
        <button @click="" class="btn btn-sm bg-[#ddd6fe] hover:bg-[#c4b5fd]">一键转存</button>
        <button @click="oneClickDownload" class="btn btn-sm bg-[#ddd6fe] hover:bg-[#c4b5fd]">一键下载</button>
      </div>
    </div>
    <div class="relative mt-8 flex gap-8 justify-center">
      <div class="flex mt-[250px]">
        <el-icon @click="prevPage" size="35" class="py-10 rounded-xl hover:bg-base-200 hover:cursor-pointer"><ArrowLeftBold /></el-icon>
      </div>
      <div id="loadingIcon" class="absolute w-[100%] mt-[250px] flex justify-center none">
        <div> <!-- 加载图标 -->
          <span class="loading loading-spinner loading-xs"></span>
          <span class="loading loading-spinner loading-sm"></span>
          <span class="loading loading-spinner loading-md"></span>
          <span class="loading loading-spinner loading-lg"></span>
        </div>
      </div>
      <VuePdfEmbed
          :source="textbookResourcesList[viewDetailInd] ? textbookResourcesList[viewDetailInd]['resource_url'] : ''"
          :page="pageNum"
          @loaded="isLoadingPDF=true"
          @rendered="isLoadingPDF=false"
          class="w-[85%]"
      />
      <div class="flex mt-[250px]">
        <el-icon @click.prevent="nextPage" size="35" class="py-10 rounded-xl hover:bg-base-200 hover:cursor-pointer"><ArrowRightBold /></el-icon>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { materialMenu } from "../../components"
import { useRequest } from "vue-hooks-plus";
import { getTextbookResourcesListAPI, getSubjectListAPI } from "../../apis"
import VuePdfEmbed from 'vue-pdf-embed'
import { request } from "../../apis/request";

const subjectList = ref<Array<string>>([])

const textbookResourcesList = ref<Array<object>>([])

const choSubject = ref<number>(-1)

const viewDetailInd = ref<number>(-1)

watch(()=>choSubject.value,()=>{
  textbookResourcesList.value = textbookResourcesList.value.slice(0,1)
})

const pageNum = ref<number>(1)

const isLoadingPDF = ref<boolean>(false)

// watch(()=>isLoadingPDF.value,()=>{
//   if(isLoadingPDF.value){
//     document.getElementById('VuePdfEmbed').style.display = 'none'
//     document.getElementById('loadingIcon').style.display = 'inline'
//   }else{
//     document.getElementById('VuePdfEmbed').style.display = 'inline'
//     document.getElementById('loadingIcon').style.display = 'none'
//   }
// })

onMounted(()=>{
  getSubjectList()
  getTextbookResourcesList()
})

const getTextbookResourcesList = () => {
  useRequest(()=>getTextbookResourcesListAPI(localStorage.getItem('token')),{
    onSuccess(res){
      if(res['code']===200){
        textbookResourcesList.value = res['data']['resource_list']
        console.log(textbookResourcesList.value)
      }else{

      }
    }
  })
}

const chooseSubject = (ind) => {
  choSubject.value = ind
}

const oneClickDownload = () => {
  let url
  request(textbookResourcesList.value[viewDetailInd.value]['resource_url'],{
    method: "get",
    responseType: "blob",
  }).then((res)=>{
    url = URL.createObjectURL(<Blob>res)

    let link = document.createElement('a')
    link.download = textbookResourcesList.value[viewDetailInd.value]['resource_url'].substring(textbookResourcesList.value[viewDetailInd.value]['resource_url'].lastIndexOf("/")+1)
    link.href = url
    link.target = "_blank"
    link.style.display = "none"

    document.body.appendChild( link );
    link.click();

    document.body.removeChild( link );
  })
}

const getSubjectList = () => {
  useRequest(()=>getSubjectListAPI(localStorage.getItem('token')),{
    onSuccess(res){
      if(res['code']===200){
        subjectList.value = res['data']
      }else{

      }
    }
  })
}

const prevPage = () => {
  if(pageNum.value>1){
    pageNum.value--
  }
}

const nextPage = () => {
  pageNum.value++
}
</script>

<style scoped>

</style>