<template>
<div>
  <div v-show="!isShowPublishExperienceForm">     <!-- 列表显示 -->
    <div v-show="viewExperienceDetailsInd===-1">
      <!-- 搜索框 -->
      <div class="flex gap-8">
        <label class="input input-bordered flex items-center gap-2">
          <input v-model="searchExperienceKey" type="text" class="grow w-[800px]" placeholder="在此处可以输入关键词查找相关的经验帖" />
          <el-icon><Search /></el-icon>
        </label>
        <button @click="openPublishForm" class="btn bg-[#e5dbf5] text-[#67578f] hover:bg-[#e5dbf5]">上传我的经验</button>
      </div>
      <!-- 科目列表 -->
      <div class="flex gap-4 w-[1000px] mt-4">
        <button
            v-for="(value,index) in subjectList"
            @click="choSubjectInd = index"
            class="btn btn-sm h-full btn-outline hover:bg-[#e8def7] hover:text-base-content text-base font-normal flex"
            :class="index===choSubjectInd ? 'bg-[#e5dbf5]' : ''"
        >
          <el-icon v-show="index===choSubjectInd"><Select /></el-icon>{{ value }}</button>
      </div>
      <div class="flex flex-col gap-10 bg-[#f3f1ff] p-4 mt-4 mb-8 h-[680px] w-[1060px] overflow-y-auto">
        <div
            v-for="(value,index) in experienceResourceList"
            class="bg-white p-4 w-[1000px] relative"
        >
          <div class="flex items-center">
            <div class="avatar">
              <div class="w-12 rounded-full">
                <img :src="value['avatar']" />
              </div>
            </div>
            <p class="ml-4 font-bold">{{ value['username'] }}</p>
            <p class="absolute left-1/3 font-bold text-2xl">{{ value['title'] }}</p>
            <div @click="viewDetails(index)" class="absolute right-[40px]"><button @click="isShowPublishExperienceForm=false" class="btn btn-outline btn-sm border-2 border-purple-950 text-purple-950 bg-[#f3f1ff] hover:text-purple-950 hover:bg-[#f3f1ff] px-5 rounded-xl">查看详情</button></div>
          </div>
          <p class="mt-4 max-h-[92px] text-ellipsis overflow-hidden">{{ value['content'] }}</p>
        </div>
        <!-- 助手角色 -->
        <div v-show="choSubjectInd === -1 || !experienceResourceList" class="fixed bottom-[30px]">
          <img :src="assistantRoleSrc" class="w-[350px]">
        </div>
      </div>
    </div>
    <div v-if="viewExperienceDetailsInd!==-1" class="bg-[#f3f1ff] p-4 mb-4">     <!-- 详情显示 -->
      <div class="bg-white p-5 w-[1000px] h-[830px] relative">
        <div class="flex items-center">
          <button @click="viewExperienceDetailsInd=-1" class="btn btn-outline btn-sm border-2 border-purple-950 text-purple-950 bg-[#f3f1ff] hover:text-purple-950 hover:bg-[#f3f1ff] px-5 rounded-xl">返回</button>
          <p class="absolute left-1/3 font-bold text-2xl">{{ experienceResourceList[viewExperienceDetailsInd]['title'] }}</p>
          <div class="flex flex-col font-bold absolute right-[30px]">
            <p class="text-sm">{{ experienceResourceList[viewExperienceDetailsInd]['username'] }}</p>
            <p class="text-sm">修改时间：{{ experienceResourceList[viewExperienceDetailsInd]['updated_at'].split(' ')[0] }}</p>
            <!--          <p class="text-sm">创建时间：{{ experienceResourceList[viewExperienceDetailsInd]['created_at'].split(' ')[0] }}</p>-->
          </div>
        </div>
        <p class="mt-8 h-[730px] overflow-y-auto" style="white-space: pre-wrap;">{{ experienceResourceList[viewExperienceDetailsInd]['content'] }}</p>
      </div>
    </div>
  </div>
  <div v-show="isShowPublishExperienceForm" class="bg-[#f3f1ff] p-4">   <!-- 发帖表单 -->
    <div class="bg-white p-4 w-[1000px] relative">
      <div class="flex items-center">
        <button @click="isShowPublishExperienceForm=false" class="btn btn-outline btn-sm border-2 border-purple-950 text-purple-950 bg-[#f3f1ff] hover:text-purple-950 hover:bg-[#f3f1ff] px-5 rounded-xl">返回</button>
        <p class="absolute right-[70px] font-semibold">{{ userInfo.username ? userInfo.username : '未设定' }}</p>
      </div>
      <div class="flex flex-col gap-6 mt-6">
        <p class="text-[#9ca3af]">请输入经验帖相关信息</p>
        <div class="flex gap-6 items-center">
          <p>当前科目：</p>
          <p class="font-bold">{{ subjectList[choSubjectInd] }}</p>
        </div>
        <div class="flex gap-6 items-center">
          <p>经验帖名称</p>
          <input v-model="publishExperienceFormData['title']" type="text" placeholder="请输入经验帖名称" class="input input-bordered h-[42px] w-[800px]" />
        </div>
        <div class="flex gap-6">
          <p>经验帖内容</p>
          <textarea v-model="publishExperienceFormData['content']" class="textarea textarea-bordered text-base w-[800px] h-[400px] resize-none" placeholder="请输入内容"></textarea>
        </div>
        <div class="text-center"><button @click="publishExperience" class="btn btn-sm bg-[#65558f] text-white px-8 rounded-xl hover:bg-purple-900">确认上传</button></div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useMainStore } from "../../stores";
import { publishResourcesAPI, getResourcesListAPI, searchResourcesAPI, getSubjectListAPI } from "../../apis";
import { useRequest } from "vue-hooks-plus";
import { ElMessage, ElNotification } from "element-plus";
import { getAssistantRoleSrc } from "../../themes"

const userInfo = useMainStore().userInfoStore().userInfo

const isShowPublishExperienceForm = ref<boolean>(false)

const experienceResourceList = ref<Array<object>>([])

const publishExperienceFormData = ref({
  resource_type: 1,
  title: '',
  content: '',
  cover_img: '',
  subject_name: '',
})

const viewExperienceDetailsInd = ref<number>(-1);

const searchExperienceKey = ref<string>('')

watch(()=>searchExperienceKey.value,()=>{
  run()
})

const subjectList = ref<Array<string>>([])
const choSubjectInd = ref<number>(-1)

watch(()=>choSubjectInd.value,()=>{
  getResourcesList()
})

const assistantRoleSrc = ref<string>('')

onMounted(()=>{
  getSubjectList()
  assistantRoleSrc.value = getAssistantRoleSrc()
})

const getResourcesList = () => {
  if(choSubjectInd.value !== -1)
  useRequest(()=>getResourcesListAPI({
    resource_type:1,
    subject_name:subjectList.value[choSubjectInd.value]}
  ),{
    onSuccess(res){
      if(res['code']===200){
        experienceResourceList.value = res['data']
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })
}

const publishExperience = () => {
  if(publishExperienceFormData.value.title==='' || publishExperienceFormData.value.content===''){
    ElMessage({message: '帖子名称与帖子内容不能为空！', type: 'warning'})
    return
  }
  publishExperienceFormData.value.subject_name = subjectList.value[choSubjectInd.value]
  useRequest(()=>publishResourcesAPI(publishExperienceFormData.value),{
    onSuccess(res){
      if(res['code']===200){
        getResourcesList()
        isShowPublishExperienceForm.value = false
        publishExperienceFormData.value = {
          resource_type: 1,
          title: '',
          content: '',
          cover_img: '',
          subject_name: '',
        }
        ElMessage({message: '发表成功', type: 'success'})
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })
}

const { data, run } = useRequest(()=>searchResourcesAPI({
  resource_type:1,
  keyword:searchExperienceKey.value,
  subject_name: subjectList.value[choSubjectInd.value]
}),{
  debounceWait: 1000,
  manual: true,
  onSuccess(res){
    if(res['code']===200){
      experienceResourceList.value = res['data']
    }else{
      ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
    }
  }
})

const viewDetails = (ind) => {
  viewExperienceDetailsInd.value = ind
}

const getSubjectList = () => {
  useRequest(()=>getSubjectListAPI(),{
    onSuccess(res){
      if(res['code']===200){
        subjectList.value = res['data']
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })
}

const openPublishForm = () => {
  if(choSubjectInd.value === -1){
    ElMessage({message: '请先选择一个科目！', type: 'warning',})
    return
  }
  isShowPublishExperienceForm.value = true
}
</script>

<style scoped>

</style>