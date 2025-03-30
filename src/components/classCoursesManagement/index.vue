<template>
<div class="flex flex-col mt-4 gap-5">
  <div class="flex">
    <p class="text-2xl text-[#625e76]">我的课表</p>
    <select v-model="nowWeek" class="select select-bordered select-sm text-base bg-base-200 ml-4">
      <option v-for="(value,index) in weekByWeek" :value="index+1">{{ value }}</option>
    </select>
    <button class="btn btn-sm btn-outline border-purple-300 hover:bg-[#e8def7] hover:text-base-content font-normal text-base ml-2">切换周次</button>
  </div>
<!--  <el-table-->
<!--      :data="tableData"-->
<!--      :show-header="false"-->
<!--      :resizable="false"-->
<!--      border-->
<!--      style="font-size: 18px; width: 1000px; background-color: green"-->
<!--      :cell-style="{'color':'green', 'background-color':'#f3f1ff'}"-->
<!--  >-->
<!--    <el-table-column prop="date" label="节次" width="100"/>-->
<!--    <el-table-column prop="name" label="周一" width="180" />-->
<!--    <el-table-column prop="address" label="周二" width="180"/>-->
<!--    <el-table-column prop="address" label="周三" width="180"/>-->
<!--    <el-table-column prop="address" label="周四" width="180"/>-->
<!--    <el-table-column prop="address" label="周五" width="180"/>-->
<!--  </el-table>-->
  <div>
    <div class="grid grid-cols-11 w-[1001px] h-[40px] bg-[#65558f] text-white rounded-lg">
      <p class="col-span-1 flex justify-center items-center border-r">节次</p>
      <p class="col-span-2 flex justify-center items-center border-r">周一</p>
      <p class="col-span-2 flex justify-center items-center border-r">周二</p>
      <p class="col-span-2 flex justify-center items-center border-r">周三</p>
      <p class="col-span-2 flex justify-center items-center border-r">周四</p>
      <p class="col-span-2 flex justify-center items-center">周五</p>
    </div>
    <div class="overflow-x-auto mt-2">
      <table class="table text-base w-[1001px]">
        <tbody>
        <tr v-for="(value,index) in tableTimeData" class="bg-[#f3f1ff]">
          <td class="w-[99px] max-w-[91px] border-2 border-[#7c6ea1]">{{ SECTION[index]+'节\n'}}<p class="text-sm">{{ SECTION_TIME[index] }}</p></td>
          <td v-for="(value2,index2) in value" class="w-[182px] max-w-[200px] h-[70px] border-2 border-[#7c6ea1]">
            <div v-show="value2">
              <p>{{ value2['course_name'] }}</p>
<!--              <p>{{ value2['course_class'] }}</p>-->
              <p>{{ value2['course_addr'] }}</p>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
  <p class="text-2xl text-[#625e76]">管理课程</p>
  <div class="overflow-x-auto bg-[#fef7fe] h-[230px] mb-12">
    <table class="table text-base">
      <thead>
      <tr class="text-base">
        <th>课程名</th>
        <th>教学班级</th>
        <th>教学时间</th>
        <th>教学地点</th>
        <th><button @click="courseData = {}" onclick="editCourseDia.showModal()" class="btn btn-outline btn-sm hover:bg-[#e8def7] hover:text-base-content">添加课程</button></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(value,index) in courseList">
        <td>{{ value['course_name'] }}</td>
        <td>{{ value['course_class'] }}</td>
        <td>{{ teachTimeList[index] }}</td>
        <td>{{ value['course_addr'] }}</td>
        <td><button @click="courseData = value" onclick="editCourseDia.showModal()" class="btn btn-outline btn-sm hover:bg-[#e8def7] hover:text-base-content px-[25px]">编辑</button></td>
      </tr>
      </tbody>
    </table>
  </div>
  <editCourseDia @update="update" :courseData="courseData" :classList="classList"></editCourseDia>
</div>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import { useRequest } from "vue-hooks-plus";
import { getCourseListAPI, getClassListAPI, getTimetableAPI } from "../../apis"
import { ElNotification } from 'element-plus'
import { editCourseDia } from "../../components"

const weekByWeek = [
    '第1周',
    '第2周',
    '第3周',
    '第4周',
    '第5周',
    '第6周',
    '第7周',
    '第8周',
    '第9周',
    '第10周',
    '第11周',
    '第12周',
    '第13周',
    '第14周',
    '第15周',
    '第16周',
]

const tableTimeData = ref<Array<Array<Object>>>([['','','','',''],['','','','',''],['','','','',''],['','','','',''],['','','','','']])
const nowWeek = ref<number>(1)

watch(()=>nowWeek.value,()=>{
  getTimetable()
})

const WEEKDAY = ['周一','周二','周三','周四','周五']

const SECTION = ['1-2','3-4','6-7','8-9','10-11']
const SECTION_TIME = ['8:00\n9:40','9:55\n11:35','13:30\n15:10','15:25\n17:05','18:30\n20:10']

const courseList = ref<Array<Object>>([])
const teachTimeList = ref<Array<string>>([])  // 教学时间，拼凑成”周一3-4“的形式

const courseData = ref<Object>({});

const classList = ref<Array<string>>([]);

onMounted(()=>{
  getCourseList()
  getClassList()
  getTimetable()
})

const update = () => {
  getCourseList()
  getTimetable()
}

const getCourseList = () => {
  useRequest(()=>getCourseListAPI(localStorage.getItem('token')),{
    onSuccess(res){
      if(res['code']===200){
        courseList.value = res['data']
        teachTimeList.value = []
        for(let i=0; i<courseList.value.length; i++){
          let l1 = courseList.value[i]['weekday'].split(',')
          let l2 = courseList.value[i]['section'].split(',')
          let s = ''
          for(let j=0; j<l1.length-1; j++){
            s = s.concat(WEEKDAY[Number(l1[j])-1]).concat(l2[j]).concat(',')
          }
          s = s.concat(WEEKDAY[Number(l1[l1.length-1])-1]).concat(l2[l1.length-1])
          teachTimeList.value.push(s)
        }
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })
}

const getTimetable = () => {
  let year = String(new Date().getFullYear()).concat('-').concat(String(new Date().getFullYear()+1))
  let month = new Date().getMonth() + 1
  let term
  if(month>7) term = 1;
  else term = 2

  useRequest(()=>getTimetableAPI(localStorage.getItem('token'),{week:nowWeek.value,academic_year:String(year),academic_term:term}),{
    onSuccess(res){
      if(res['code']===200){
        tableTimeData.value = [['','','','',''],['','','','',''],['','','','',''],['','','','',''],['','','','','']]
        for(let i=0; i<res['data'].length; i++){
          let weekday = Number(res['data'][i]['weekday']) - 1
          let section = SECTION.indexOf(res['data'][i]['section'])
          tableTimeData.value[section][weekday] = res['data'][i]
          // console.log(tableTimeData.value)
        }
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })
}

const getClassList = () => {
  useRequest(()=>getClassListAPI(localStorage.getItem('token')),{
    onSuccess(res){
      if(res['code']===200){
        classList.value = res['data']['class_list']
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })
}
</script>

<style scoped>

</style>