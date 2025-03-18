<template>
<div>
  <div v-show="gpaOrChapter===1" class="flex flex-col gap-4 ml-4">
    <div class="flex gap-8 items-center">
      <div class="flex flex-col gap-8">
        <select v-model="choClassInd" class="select select-bordered text-base border-2 border-[#65558f] focus:ring focus:ring-2 focus:ring-[#65558f] max-w-[250px] truncate">
          <option disabled selected value="-1">请选择要查询的班级</option>
          <option v-for="(value,index) in classList" :value="index">{{ value }}</option>
        </select>
        <select v-model="choStuInd" class="select select-bordered text-base border-2 border-[#65558f] focus:ring focus:ring-2 focus:ring-[#65558f]">
          <option disabled selected value="-1">请选择要查询的学生</option>
          <option v-for="(value,index) in studentList" :value="index">{{ value['name'] }}</option>
        </select>
        <div class="flex justify-center mt-4">
          <button @click="getStudentScore" class="btn bg-[#65558f] pl-8 pr-8 text-base-100 hover:bg-purple-900 rounded-3xl">一键查询</button>
        </div>
      </div>
      <div class="bg-[#f3f1ff] rounded-xl pt-8">
        <div id="lineChart" class="w-[900px] h-[300px]"></div>
      </div>
    </div>
    <div class="divider"></div>
    <!--  <p class="ml-8">提示：双击查看课程学情分析</p>-->
    <div class="overflow-x-auto max-h-[360px] overflow-visible mb-12">
      <table class="table text-base bg-[#fef7ff]">
        <thead>
        <tr class="text-base">
          <th>课程名</th>
          <th>班级</th>
          <th>学号</th>
          <th>平时成绩</th>
          <th>期末成绩</th>
          <th>总成绩</th>
          <th>课程学分</th>
          <th>获得学分</th>
          <th><p class="border-[1px] border-black rounded-xl w-[150px] text-center">查看课程学情分析</p></th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="(value,index) in stuCourseScoreInfo"
            class="hover:bg-[#e5dbf5] hover:cursor-pointer"
            @dblclick='turnToChapterPage(index)'
        >
          <td>{{ value['course_name'] }}</td>
          <td class="max-w-[200px]">{{ value['class'] }}</td>
          <td>{{ value['student_id'] }}</td>
          <td>{{ value['regular_score'] }}</td>
          <td>{{ value['final_score'] }}</td>
          <td>{{ value['total_score'] }}</td>
          <td class="max-w-[100px]">{{ value['credit'] }}</td>
          <td>{{ value['credit_earned'] }}</td>
          <td class="text-center"><el-icon @click="turnToChapterPage(index)" size="25" class="hover:bg-[#fef7ff]"><Right /></el-icon></td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
<!--  引用别的组件 -->
  <stuChapterAnalyse
      v-show="gpaOrChapter===2"
      @backToGpaPage="gpaOrChapter = 1"
      :class="classList[choClassInd]"
      :stuInfo="studentList[choStuInd]"
      :courseScore="stuCourseScoreInfo[courseScoreInd]"
  >
  </stuChapterAnalyse>
</div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { stuChapterAnalyse } from "../../components"
import echarts from "../../echarts";
import { ElMessage, ElNotification } from "element-plus";
import { useRequest } from "vue-hooks-plus/es";
import { getClassStudentListAPI, getStuCourseScoreAPI, getStudentGpaRankAPI, obtainClassListAPI } from "../../apis";

const gpaOrChapter = ref<number>(1)       // 界面切换
const courseScoreInd = ref<number>(-1);   // 课程的索引

const classList = ref<Array<string>>([])
const choClassInd = ref<number>(-1)

const studentGpaRankInfo = ref<Array<Object>>([]);

watch(()=>choClassInd.value,()=>{
  choStuInd.value = -1
  if(choClassInd.value !== -1)
    getClassStudentList()
})

const studentList = ref<Array<Object>>([])
const choStuInd = ref<number>(-1)

const stuCourseScoreInfo = ref<Array<Object>>([]);

let myLineChart

onMounted(()=>{
  obtainClassList()
})

const setLineChart = () => {    // 处理后端的数据，并绘制图像
  let termTime = []   // x轴数据
  let stuGpa = []     // 绩点
  let stuRank = []    // 排名
  let stuPercentile = []  // 专业前百分之几

  for(let i=0; i<studentGpaRankInfo.value.length; i++){
    let t = studentGpaRankInfo.value[i]['academic_year'].split('-')[0].concat('学年')
    if(studentGpaRankInfo.value[i]['academic_term']===1){
      t = t.concat('上')
    }else if(studentGpaRankInfo.value[i]['academic_term']===2){
      t = t.concat('下')
    }
    termTime.push(t)

    stuGpa.push(Math.ceil(studentGpaRankInfo.value[i]['avg_gpa']))
    stuRank.push(studentGpaRankInfo.value[i]['rank'])
    stuPercentile.push(Math.ceil(studentGpaRankInfo.value[i]['percentile']))
  }

  myLineChart = echarts.init(document.getElementById('lineChart'));

  myLineChart.setOption({
    title: {
      text: '绩点排名成绩表',
      textStyle: {
        color: '#9e9a9d',
        fontWeight: 'normal',
        fontSize: 28,
      },
      left: 30,
    },
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      top: '80',
      bottom: '15%'
    },
    legend: {
      itemGap: 60,
      right: 120,
      data: ['平均绩点', '专业排名'],  // 图例的名称，对应 series 中的 name
      textStyle: {
        fontSize: 15,
      }
    },
    xAxis: {
      type: 'category',
      data: termTime,
      splitLine: {
        show: true,
        lineStyle: {
          color: '#0000000',
          width: 1,
        },
      },
      axisLabel: {
        fontSize: 15,
        margin: 20,
      },
    },
    yAxis: [
      {
        type: 'value',
        min: 0,
        max: 5.0,
        interval: 1.0,
        axisLabel: {
          fontSize: 15,
          margin: 15,
          formatter: function (value) {
            if(value===0) return 0
            return value.toFixed(1);  // 保留一位小数
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#0000000',
            width: 1,
          },
        }
      },
      {
        show: false,
        type: 'value',
        name: '排名',
        nameTextStyle: {
          fontSize: 15,
          verticalAlign: 'bottom'
        },
        inverse: true,
        min: 1,
        nameLocation: 'start',
        axisLabel: {
          fontSize: 15,
          margin: 15,
        },
      },
    ],
    series: [
      {
        name: '平均绩点',  // 对应 legend 中的 data
        type: 'line',
        data: stuGpa,
        lineStyle: {
          color: '#65558f',
          width: 5,
        },
        smooth: true,
        yAxisIndex: 0,
      },
      {
        name: '专业排名',  // 对应 legend 中的 data
        type: 'line',
        data: stuRank,
        lineStyle: {
          color: '#ffbb54',
          width: 5,
        },
        smooth: true,
        yAxisIndex: 1,
      }
    ]
  })
}

const getStudentScore = () => {   // 一键查询按钮
  if(choStuInd.value === -1){
    ElMessage({message: '请先选择班级与学生！', type: 'warning', plain: true,})
    return
  }
  getStudentGpaRank();
  getStuCourseScore();
}

const obtainClassList = () => {
  useRequest(()=>obtainClassListAPI(),{
    onSuccess(res){
      if(res['code']===200){
        classList.value = res['data']['class_list']
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })
}

const getClassStudentList = () => {
  useRequest(()=>getClassStudentListAPI({class:classList.value[choClassInd.value]}),{
    onSuccess(res){
      if(res['code']===200){
        studentList.value = res['data']
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })
}

const getStudentGpaRank = () => {   // 获取绩点、排名
  useRequest(()=>getStudentGpaRankAPI({student_id: studentList.value[choStuInd.value]['student_id']}),{
    onSuccess(res){
      if(res['code']===200){
        studentGpaRankInfo.value = res['data']
        setLineChart()
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })
}

const getStuCourseScore = () => {   // 获取某同学，各课程的成绩
  useRequest(()=>getStuCourseScoreAPI({student_id:studentList.value[choStuInd.value]['student_id']}),{
    onSuccess(res){
      if(res['code']===200){
        stuCourseScoreInfo.value = res['data']
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })
}

const turnToChapterPage = (ind) => {
  courseScoreInd.value = ind
  gpaOrChapter.value = 2
}
</script>

<style scoped>

</style>