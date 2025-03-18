<template>
<div class="flex flex-col gap-4 ml-4">
  <div class="flex gap-8">
    <div class="flex flex-col gap-8">
      <div @click="varemit('backToGpaPage')" class="flex items-center hover:cursor-pointer text-purple-800">
        <el-icon size="20"><Back /></el-icon><p>返回</p>
      </div>
      <div class="border-4 rounded-md border-[#64568d] p-2.5 flex justify-center items-center gap-4 relative mt-4">
        <p class="w-[150px] text-center truncate">{{ props.class ? props.class : '' }}</p><el-icon size="25"><CircleClose /></el-icon>
        <p class="z-5 absolute left-[15px] top-[-15px] bg-base-200 text-purple-800 px-1.5">学生所在班级</p>
      </div>
      <div class="border-4 rounded-md border-[#64568d] p-2.5 flex justify-center items-center gap-4 relative">
        <p class="w-[150px] text-center truncate">{{ props.stuInfo ? props.stuInfo['name'] : ''}}</p><el-icon size="25"><CircleClose /></el-icon>
        <p class="absolute left-[15px] top-[-15px] bg-base-200 text-purple-800 px-1.5">查询的同学</p>
      </div>
      <div class="flex flex-col bg-[#f3f1ff] p-2">
        <img src="/academicSystem/knowledgeGraphThumbnail.png" class="w-[300px]">
        <div class="text-center">
          <button class="btn btn-wide bg-[#ece6f0] text-[#65558f] rounded-full text-base hover:bg-[#e5dbf5]"><el-icon size="25"><EditPen /></el-icon>查看学生的知识图谱</button>
        </div>
      </div>
    </div>
    <div id="myChapterBarChart" class="w-[800px] h-[450px] bg-[#f3f1ff]"></div>
  </div>
  <div class="divider"></div>
  <div class="overflow-x-auto mb-8 bg-[#fef7ff]">
    <table class="table text-base bg-[#fef7ff] w-[1000px]">
      <thead>
      <tr class="text-base">
        <th class="text-center">单元名</th>
        <th class="">知识掌握进度</th>
        <th class="text-center">错题查看</th>
        <th class="text-center">练习生成</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(value,index) in stuChapterScoreList">
        <td><div class="flex items-center gap-4">
          <p class="bg-[#eaddff] text-center p-2 rounded-full w-[40px]">A</p><p>第{{ value['chapter'] }}章</p>
        </div></td>
        <td class="flex gap-4">
          <div class="w-[400px] h-[20px] bg-[#dde1e6] relative">
            <div :id="'progress-'.concat(index)" class="w-[0px] h-[20px] bg-[#878d96] transition-all duration-[2s]"></div>
          </div>
          {{ value['student_score'] }}%
        </td>
        <td class="text-center"><button class="btn btn-outline btn-sm font-semibold hover:text-black hover:bg-[#e5dbf5]">点击查看错题</button></td>
        <td class="text-center"><button class="btn btn-outline btn-sm font-semibold hover:text-black hover:bg-[#e5dbf5]">点击生成练习</button></td>
      </tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script setup lang="ts">
import {nextTick, onMounted, ref, watch} from "vue";
import { getStuChapterScoreAPI } from "../../apis"
import { useRequest } from "vue-hooks-plus";
import { ElNotification } from "element-plus";
import echarts from "../../echarts";

const props = defineProps(['class','stuInfo','courseScore'])
const varemit = defineEmits(['backToGpaPage'])

const stuChapterScoreList = ref<Array<object>>([])

let myChapterBarChart

watch(()=>props,()=>{
  getStuChapterScore();
},{deep:true})

onMounted(()=>{
  getStuChapterScore();
})

const setChapterBarChart = () => {
  if(!stuChapterScoreList.value){
    myChapterBarChart.dispose()
    return
  }

  let xData = []
  for(let i=0; i<stuChapterScoreList.value.length; i++){
    xData.push('第'.concat(stuChapterScoreList.value[i]['chapter'].toString()).concat('章'))
  }

  let avgScore = []
  let stuScore = []
  for(let i=0; i<stuChapterScoreList.value.length; i++){
    avgScore.push(stuChapterScoreList.value[i]['avg_score'])
    stuScore.push(stuChapterScoreList.value[i]['student_score'])
  }

  if(!props.courseScore) return
  myChapterBarChart = echarts.init(document.getElementById('myChapterBarChart'))

  myChapterBarChart.setOption({
    title: {
      text: props.courseScore['course_name'],
      textStyle: {
        fontSize: 35,
        color: '#685992',
        fontWeight: 'normal',
      },
      left: 25,
      top: 20,
    },
    grid: {
      top: 100,
      bottom: 30,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['个人成绩','班级平均成绩'],
      top: 20,
      right: '15%',
      orient: 'vertical',
      itemGap: 15,
      textStyle: {
        fontSize: 18,
      }
    },
    xAxis: {
      type: 'category',
      data: xData,
      axisLabel: {
        fontSize: 15,
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}',
        fontSize: 15,
      }
    },
    series: [
      {
        name: '个人成绩',
        type: 'bar',
        stack: '堆叠',
        data: stuScore,
        itemStyle: {
          color: '#878d96'
        },
        barMaxWidth: '30',
        barGap: '-100%',
        legendHoverLink: false,
        emphasis: {
          disabled: true
        },
      },
      {
        name: '班级平均成绩',
        type: 'bar',
        stack: '堆叠',
        data: avgScore,
        itemStyle: {
          color: '#dde1e6'
        },
        barMaxWidth: '30',
        legendHoverLink: false,
        emphasis: {
          disabled: true
        },
      },
    ]
  })
}

const getStuChapterScore = () => {
  if(!props.stuInfo || !props.courseScore) return
  useRequest(()=>getStuChapterScoreAPI({
    student_id: props.stuInfo['student_id'],
    course_id: props.courseScore['course_id']
  }),{
    onSuccess(res){
      if(res['code']===200){
        stuChapterScoreList.value = res['data']
        if(stuChapterScoreList.value){
          nextTick(()=>{
            for(let i=0; i<stuChapterScoreList.value.length; i++){
              let progress = document.getElementById('progress-'.concat(i.toString()))
              progress.offsetWidth;
              progress.style.width = String(4*stuChapterScoreList.value[i]['student_score']).concat('px')
            }
          })
        }
        setChapterBarChart()
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })
}
</script>

<style scoped>

</style>