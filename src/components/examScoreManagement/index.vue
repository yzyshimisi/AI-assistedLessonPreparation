<template>
<div class="min-h-screen max-h-[1200px] flex flex-col gap-2 ml-4">
  <div class="flex gap-4">
    <button
        @click="isQueryScore=false"
        class="btn btn-sm h-full btn-outline hover:bg-[#e8def7] hover:text-base-content text-base font-normal flex"
        :class="!isQueryScore ? 'bg-[#e8def7]' : ''"
    >
      <el-icon v-show="!isQueryScore"><Select /></el-icon>成绩录入</button>
    <button
        @click="isQueryScore=true"
        class="btn btn-sm h-full btn-outline hover:bg-[#e8def7] hover:text-base-content text-base font-normal flex"
        :class="isQueryScore ? 'bg-[#e8def7]' : ''"
    >
      <el-icon v-show="isQueryScore"><Select /></el-icon>成绩查询</button>
  </div>
  <div class="flex gap-4 w-[1000px] mt-1">
    <button
        v-for="(value,index) in courseList"
        @click="choCourseInd = index"
        class="btn btn-sm h-full btn-outline hover:bg-[#e8def7] hover:text-base-content text-base font-normal flex"
        :class="index===choCourseInd ? 'bg-[#e5dbf5]' : ''"
    >
      <el-icon v-show="index===choCourseInd"><Select /></el-icon>{{ value['course_name'] }}</button>
  </div>
  <div class="divider"></div>
  <div v-if="!isQueryScore" class="flex gap-4">
    <div class="flex flex-col gap-4 border-2 p-10 bg-white ml-8">
      <div class="flex items-center gap-4">
        <p class="w-[80px]">学号：</p>
        <input @keyup.enter="addScore" v-model="addScoreInfo.student_id" id="studentIdInput" type="text" placeholder="请输入学号" class="input input-bordered" />
      </div>
      <div class="flex items-center gap-4">
        <p>平时成绩：</p>
        <input @keyup.enter="addScore" v-model="addScoreInfo.regular_score" type="text" placeholder="请输入平时成绩" class="input input-bordered" />
      </div>
      <div class="flex items-center gap-4">
        <p>期末成绩：</p>
        <input @keyup.enter="addScore" v-model="addScoreInfo.final_score" type="text" placeholder="请输入期末成绩" class="input input-bordered" />
      </div>
      <div class="flex items-center gap-4">
        <p class="w-[80px]">总成绩：</p>
        <input @keyup.enter="addScore" disabled v-model="addScoreInfo.total_score" type="text" placeholder="总成绩会自动计算" class="input input-bordered" />
      </div>
      <p class="mt-4">注意：如果成绩存在，则覆盖原来的值</p>
      <button @click="addScore" class="btn bg-[#65558f] pl-10 pr-10 text-base-100 hover:bg-purple-900">添加</button>
    </div>
    <div class="divider divider-horizontal"></div>
    <div class="flex flex-col">
      <el-upload
          ref="excelFileUpload"
          class="upload-demo w-[350px]"
          drag
          :on-change="uploadExcel"
          :auto-upload="false"
      >
        <el-icon size="80" class="el-icon--upload"><upload-filled /></el-icon>
        <div class="">
          点击或拖拽上传文件
        </div>
        <template #tip>
          <div class="">
            Excel files with a size less than 500kb
          </div>
        </template>
      </el-upload>
      <p class="mt-8">
        Excel格式说明：<br />
        Sheet1<br />
        第一行 必填列：学号<br />
        可选列：姓名，学院，班级，专业，平时成绩，期末成绩，最终成绩<br />
        第二行以下为数据<br />
        注意：可选列可以为空，如果第一行有该标题，其数据不得为空<br />
      </p>
    </div>
  </div>
  <queryScore v-else
    :course_id = "choCourseInd !== -1 ? courseList[choCourseInd]['id'] : ''"
  ></queryScore>
</div>
</template>

<script setup lang="ts">
import {ref, onMounted, computed, watch} from "vue";
import { queryScore } from "../../components"
import { getCourseListAPI, addScoreAPI, oneClickInputAPI } from "../../apis"
import { useRequest } from "vue-hooks-plus";
import { ElNotification, ElMessage  } from "element-plus";
import type { UploadFile, UploadFiles, UploadUserFile,UploadInstance } from 'element-plus'
const isQueryScore = ref<boolean>(false)

const courseList = ref<Array<Object>>([]);

const choCourseInd = ref<number>(-1);

const addScoreInfo = ref<addScoreType>({
  student_id: '',
  regular_score: '',
  final_score: '',
  total_score: ''
})

watch([()=>addScoreInfo.value.regular_score,()=>addScoreInfo.value.final_score],()=>{
  if(addScoreInfo.value.regular_score && addScoreInfo.value.final_score)
    addScoreInfo.value.total_score = String(Math.round(Number(addScoreInfo.value.regular_score)*0.4 + Number(addScoreInfo.value.final_score)*0.6))
  else
    addScoreInfo.value.total_score = ''
})

const excelFileUpload = ref<UploadInstance>()

onMounted(()=>{
  getCourseList();
})

const getCourseList = () => {
  useRequest(()=>getCourseListAPI(localStorage.getItem('token')),{
    onSuccess(res){
      if(res['code']===200){
        courseList.value = res['data']
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })
}

const addScore = () => {
  if(choCourseInd.value === -1){
    ElMessage({message: '请先选择课程！', type: 'warning', plain: true,})
    return
  }
  useRequest(()=>addScoreAPI({
    course_id: courseList.value[choCourseInd.value]['id'],
    create_scores: [addScoreInfo.value]
  }),{
    onSuccess(res){
      if(res['code']===200){
        addScoreInfo.value.student_id = ''
        addScoreInfo.value.regular_score = ''
        addScoreInfo.value.final_score = ''
        addScoreInfo.value.total_score = ''
        ElMessage({message: '添加成功', type: 'success', plain: true,})
        document.getElementById('studentIdInput').focus()
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })
}

const uploadExcel = (uploadFile, UploadFiles) => {
  excelFileUpload.value!.clearFiles()
  let excelFile = uploadFile.raw
  let exp = excelFile.name.split('.')[1]
  let type = excelFile.type
  if(!((exp === 'xlsx' && type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || (exp === 'xls' && type === 'application/vnd.ms-excel'))){
    ElMessage({message: '文件类型有误！', type: 'warning',})
    return
  }

  if(choCourseInd.value === -1){
    ElMessage({message: '请先选择课程！', type: 'warning', plain: true,})
    return
  }

  useRequest(()=>oneClickInputAPI({
    course_id: courseList.value[choCourseInd.value]['id'],
    file: excelFile,
  }),{
    onSuccess(res){
      if(res['code']===200){
        ElMessage({message: '导入成功', type: 'success', plain: true,})
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })
}
</script>

<style scoped>

</style>