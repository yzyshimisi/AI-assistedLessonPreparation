<template>
<div class="flex flex-col gap-4 ml-4">
  <div class="flex gap-10 items-center">
    <div class="flex flex-col gap-8">
      <div class="flex gap-4">
        <select v-model="choYearInd" class="select select-bordered text-base border-2 border-[#65558f] focus:ring focus:ring-2 focus:ring-[#65558f] w-[142px]">
          <option disabled selected value="-1">请选择学年</option>
          <option v-for="(value,index) in YEAR" :value="index">{{ value }}</option>
        </select>
        <select v-model="choTerm" class="select select-bordered text-base border-2 border-[#65558f] focus:ring focus:ring-2 focus:ring-[#65558f] w-[142px]">
          <option disabled selected value="-1">请选择学期</option>
          <option value="1">上学期</option>
          <option value="2">下学期</option>
        </select>
      </div>
      <select v-model="choClassInd"  class="select select-bordered text-base border-2 border-[#65558f] focus:ring focus:ring-2 focus:ring-[#65558f] max-w-[300px] truncate">
        <option disabled selected value="-1">请选择要查询的班级</option>
        <option v-for="(value,index) in classList" :value="index">{{ value }}</option>
      </select>
      <div class="flex justify-center">
        <button @click="getAverageGpaAndScore" class="btn bg-[#65558f] pl-8 pr-8 text-base-100 hover:bg-purple-900 rounded-3xl">一键查询</button>
      </div>
    </div>
    <div class="flex flex-col gap-4 bg-[#f3f1ff] p-3 h-[350px] border-2">
      <p class="text-[#f6ba63] mb-4">班级：{{ showClassInd === -1 ? '未选择' : classList[showClassInd] }}</p>
      <div id="barChart" class="w-[380px] h-[280px]"></div>
    </div>
    <div class="flex flex-col bg-[#f3f1ff] p-3 h-[350px] border-2">
      <div class="flex mb-4">
        <p class="text-[#f6ba63] absolute">成绩概况</p>
        <p class="text-[#66568f] w-full flex justify-center">{{choCourseInd !== -1 ? courseAverageScore[choCourseInd]['course_name'] : '' }}</p>
      </div>
      <div id="pieChart" class="w-[350px] h-[320px]"></div>
    </div>
  </div>
  <div class="flex gap-4">
    <button
        v-for="(value,index) in courseAverageScore"
        @click="selectCourse(index)"

        class="btn btn-sm h-full btn-outline hover:bg-[#e8def7] hover:text-base-content text-base font-normal flex"
        :class="index===choCourseInd ? 'bg-[#e5dbf5]' : ''"
    >
      <el-icon v-show="index===choCourseInd"><Select /></el-icon>{{ value['course_name'] }}</button>
  </div>
  <div class="divider"></div>
  <div class="overflow-x-auto">
    <table class="table text-base bg-[#fef7ff]">
      <thead>
      <tr class="text-base">
        <th>学生姓名</th>
        <th>班级</th>
        <th>学号</th>
        <th>平时成绩</th>
        <th>期末成绩</th>
        <th>总成绩</th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="(value,index) in studentList"
          class="hover:cursor-pointer hover:bg-[#e5dbf5]"
      >
        <td>{{ value['name'] }}</td>
        <td>{{ value['class'] }}</td>
        <td>{{ value['student_id'] }}</td>
        <td>{{ value['regular_score'] }}</td>
        <td>{{ value['final_score'] }}</td>
        <td>{{ value['total_score'] }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import { obtainClassListAPI, getAverageGpaAPI, getScoreOverviewAPI, getAcademicAchieveAPI } from "../../apis"
import { useRequest } from "vue-hooks-plus/es";
import echarts from "../../echarts";
import { ElMessage, ElNotification } from "element-plus";

const SCORE_OVERVIEW = {    // 成绩概况的映射
  excellent_count: '优秀',
  good_count: '良好',
  pass_count: '及格',
  fail_count: '不及格'
}

const classList = ref<Array<string>>([])    // 班级选择
const choClassInd = ref<number>(0)
const showClassInd = ref<number>(0)

const YEAR = ref<Array<number>>([])     // 学年
const choYearInd = ref<number>(0)

const choTerm = ref<number>(2);     // 学期

const averageGpa = ref<number>(-1);     // 平均绩点
const courseAverageScore = ref<Array<Object>>([])   // 课程的平均成绩

const choCourseInd = ref<number>(-1);    // 选中课程索引

const scoreOverview = ref<Object>({});

const studentList = ref<Array<Object>>([]);

let myBarChart
let myPieChart

onMounted(()=>{
  obtainClassList();

  let nowYear = new Date().getFullYear()
  for(let i=0; i<5; i++){
    YEAR.value.push(nowYear-i);
  }

  setBarChart()
})

const setBarChart = () => {   // 设置柱状图
  myBarChart = echarts.init(document.getElementById('barChart'));

  myBarChart.setOption({
    title: {
      text: '平均绩点：',
      textStyle: {
        fontSize: '30',
        color: '#66568f',
        fontWeight: 'normal',
      },
    },
    grid: {
      top: '80',
      bottom: '40',
      right: '15',
      left: '30',
    },
    tooltip: { show: false },
    xAxis: {
      data: [],
      axisLabel: {
        textStyle: { fontSize:'15'},
        interval: 0,
        formatter: function(params) {
          let newParamsName = "";
          let paramsNameNumber = params.length;
          let provideNumber = 4;  //一行显示几个字
          let rowNumber = Math.ceil(paramsNameNumber / provideNumber);
          if (paramsNameNumber > provideNumber) {
            for (let p = 0; p < rowNumber; p++) {
              let tempStr = "";
              let start = p * provideNumber;
              let end = start + provideNumber;
              if (p == rowNumber - 1) {
                tempStr = params.substring(start, paramsNameNumber);
              } else {
                tempStr = params.substring(start, end) + "\n";
              }
              newParamsName += tempStr;
            }
          } else {
            newParamsName = params;
          }
          return newParamsName;
        }
      },
      axisLine: {
        show: true,
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      show: true,
    },
    series: [
      {
        name: '平均分',
        type: 'bar',
        barMaxWidth: '50',
        data: [],

        itemStyle: {      // 柱条样式
          color: '#cacaca',
          borderRadius: 12,
        },

        emphasis: {      // 鼠标悬浮
          itemStyle:{
            color: '#65558f',
          },
          label: {
            show: false,
            position: 'top',
            formatter: '{a}：{c}',
          }
        },

        select: {      // 选中时样式
          itemStyle: {
            color: '#65558f',
          },
          label: {    // 选中时，显示标签
            show: true,
            position: 'top',
            backgroundColor: '#3b3741',
            borderRadius: 4,
            padding: 10,
            color: '#fff',
            fontSize: 14,
            formatter: '{a}：{c}',
          }
        },
        selectedMode: 'single',
      }
    ]
  });

  myBarChart.on('click',(params)=>{
    selectCourse(params['dataIndex'])
  })
}

const setPieChart = () => {
  myPieChart = echarts.init(document.getElementById('pieChart'));

  let d = []    // 数据
  let total = 0

  let ld  = []    // 图例

  for(let key in scoreOverview.value){
    if(scoreOverview.value[key] !== 0){
      ld.push(SCORE_OVERVIEW[key])
      d.push({value:scoreOverview.value[key],name:SCORE_OVERVIEW[key]})
      total += scoreOverview.value[key]
    }
  }

  myPieChart.setOption({
    legend: {
      bottom: '5%',
      left: 'center',
      data: ld,
      textStyle: {
        fontSize: 15,
      }
    },
    tooltip: { show: false },
    series: [
      {
        name: '成绩概况',
        type: 'pie',
        radius: ['45%', '65%'],
        avoidLabelOverlap: false,

        bottom: '15%',

        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        data: d,

        label: {
          fontSize: '15',
          formatter: (params) => {
            return String(Math.ceil(params.value / total * 100)).concat('%')
          }
        },
        labelLine: {
          show: true
        },
      }
    ]
  });
}

const refreshBarTitle = (title) => {  // 标题显示平均绩点
  let option = myBarChart.getOption();
  option.title[0].text = title
  myBarChart.setOption(option)
}

const refreshBarData = () => {
  let option = myBarChart.getOption();
  let l = []
  for(let i=0; i<courseAverageScore.value.length; i++){
    l.push(courseAverageScore.value[i]['course_name'])
  }
  option.xAxis[0].data = l

  l = []
  for(let i=0; i<courseAverageScore.value.length; i++){
    l.push(Math.ceil(courseAverageScore.value[i]['avg_score']))
  }
  option.series[0].data = l
  myBarChart.setOption(option)
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

const getAverageGpaAndScore = () => {     // 一键查询按钮
  if(choClassInd.value === -1 || choYearInd.value === -1 || choTerm.value === -1){
    ElMessage({message: '请先完善表单信息！', type: 'warning', plain: true,})
    return
  }

  useRequest(()=>getAverageGpaAPI({
    year: String(YEAR.value[choYearInd.value]).concat('-').concat(String(YEAR.value[choYearInd.value]+1)),
    term: Number(choTerm.value),
    class: classList.value[choClassInd.value],
  }),{
    onSuccess(res){
      if(res['code']===200){
        averageGpa.value = res['class_performance']['class_avg_grade_point']
        courseAverageScore.value = res['class_performance']['course_avg_scores']

        showClassInd.value = choClassInd.value

        refreshBarTitle('平均绩点：'.concat(averageGpa.value.toFixed(2)))
        refreshBarData();

        let inds = []
        for(let i=0; i<courseAverageScore.value.length;i++){
          inds.push(i)
        }
        myBarChart.dispatchAction({
          type: 'unselect', // 动作类型：取消选中
          seriesIndex: 0,  // 系列索引
          dataIndex: inds  // 取消所有柱子的选中状态
        })

        choCourseInd.value = -1
        if(myPieChart)  myPieChart.dispose();

        studentList.value = []
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })
}

const getScoreOverview = () => {
  useRequest(()=>getScoreOverviewAPI({
    year: String(YEAR.value[choYearInd.value]).concat('-').concat(String(YEAR.value[choYearInd.value]+1)),
    class: classList.value[choClassInd.value],
    term: Number(choTerm.value),
    course_name: courseAverageScore.value[choCourseInd.value]['course_name'],
  }),{
    onSuccess(res){
      if(res['code']===200){
        scoreOverview.value = res['count_number']
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })
}

const selectCourse = (ind) => {     // 选择课程，并加载饼状图，同时加载对应的学生信息
  choCourseInd.value = ind

  myBarChart.dispatchAction({   // 柱状图选择对应的课程
    type: 'select',
    seriesIndex: 0,
    dataIndex: ind,
  })

  getScoreOverview()    // 获取成绩汇总

  let t = watch(()=>scoreOverview.value,()=>{   // 等待数据返回
    setPieChart()
    t()
  })

  getAcademicAchieve()
}

const getAcademicAchieve = () => {
  if(choCourseInd.value === -1 && choClassInd.value === -1) return

  useRequest(()=>getAcademicAchieveAPI({
    course_id: courseAverageScore.value[choCourseInd.value]['course_id'],
    class: classList.value[choClassInd.value]
  }),{
    onSuccess(res){
      if(res['code']===200){
        studentList.value = res['data']
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })
}
</script>

<style scoped>

</style>