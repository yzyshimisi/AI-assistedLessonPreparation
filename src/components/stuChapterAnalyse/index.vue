<template>
<div>
  <div v-show="!isShowExercises && !isShowWrongQuestion" class="flex flex-col gap-4 ml-4">
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
          <img src="/academicSystem/knowledgeGraphThumbnail.png" class="w-[250px]">
          <div class="text-center">
            <button @click="getStuKnowledgeGraph" class="btn btn-wide bg-[#ece6f0] text-[#65558f] rounded-full text-base hover:bg-[#e5dbf5]"><el-icon size="25"><EditPen /></el-icon>查看学生的知识图谱</button>
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
          <td class="text-center"><button @click="getWrongQuestion(index) " class="btn btn-outline btn-sm font-semibold hover:text-black hover:bg-[#e5dbf5]">点击查看错题</button></td>
          <td class="text-center"><button @click="generateExercises(index)" class="btn btn-outline btn-sm font-semibold hover:text-black hover:bg-[#e5dbf5]">点击生成练习</button></td>
        </tr>
        </tbody>
      </table>
    </div>
    <!-- 学生知识图谱对话框 -->
    <dialog id="stuKnowledgeGraphDia" class="modal">
      <div class="modal-box max-w-[800px] w-full max-h-[700px] h-full">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <div>
          <p class="text-xl font-bold">{{ props.stuInfo ? props.stuInfo['name'] : '' }}的知识图谱</p>
        </div>
        <!-- 加载图标 -->
        <div v-show="isLoadingGraph" class="h-full flex gap-2 justify-center items-center">
          <span class="loading loading-spinner loading-xs"></span>
          <span class="loading loading-spinner loading-sm"></span>
          <span class="loading loading-spinner loading-md"></span>
          <span class="loading loading-spinner loading-lg"></span>
        </div>
        <div v-show="!isLoadingGraph" class="w-full h-full mt-4">
          <RelationGraph @click="nowShowDetailNodeID=''" ref="graphRef$" :options="options">
            <template #node="{ node }">
              <div @contextmenu="showNodeDetail(node.id)" class="my-node flex flex-col gap-[40px]">
                <div class="my-node-text w-full text-center truncate">{{ node.text }}</div>
                <div
                    class="my-node-detail"
                    v-if="node.text && nowShowDetailNodeID===node.id"
                >
                  <div @dblclick="" @click.stop>{{ node.text }}</div>
                </div>
              </div>
            </template>
          </RelationGraph>
        </div>
      </div>
    </dialog>
  </div>
  <correspondingExercises
      v-if="isShowExercises"
      :chapter="chapter"

      @closeExercises="isShowExercises=false"
  ></correspondingExercises>
  <wrongQuestion
    v-if="isShowWrongQuestion"
    :chapter="chapter"

    @closeWrongQuestion="isShowWrongQuestion=false"
  ></wrongQuestion>
</div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue";
import { getStuChapterScoreAPI, getStuKnowledgeGraphAPI } from "../../apis"
import { useRequest } from "vue-hooks-plus";
import { correspondingExercises, wrongQuestion } from "../../components"
import { ElNotification } from "element-plus";
import echarts from "../../echarts";
import router from "../../router";
import RelationGraph from 'relation-graph-vue3';

const options = {
  "backgroundImage": "",
  "backgroundImageNoRepeat": true,
  "allowAutoLayoutIfSupport": false,
  "allowShowDownloadButton": false,
  "defaultExpandHolderPosition": "right",
  "defaultLineWidth": 3,
  "layouts": [
    {
      "label": "中心",
      "layoutName": "center",
      "centerOffset_x": 0,
      "centerOffset_y": 0,
      "distance_coefficient": 1.5
    }
  ]
}

const isShowExercises = ref<boolean>(false);
const isShowWrongQuestion = ref<boolean>(false);

const props = defineProps(['class','stuInfo','courseScore'])

watch(()=>props,()=>{
  getStuChapterScore();
},{deep:true})

const varemit = defineEmits(['backToGpaPage'])

const stuChapterScoreList = ref<Array<object>>([])

let myChapterBarChart

const graphRef$ = ref()
const isLoadingGraph = ref<boolean>(false)

const nowShowDetailNodeID = ref<string>('')

const chapter = ref<string>('')

onMounted(()=>{
  getStuChapterScore();
})

const getStuKnowledgeGraph = () => {
  useRequest(()=>getStuKnowledgeGraphAPI(localStorage.getItem('token')),{
    onSuccess(res){
      if(res['code']===200){
        stuKnowledgeGraphDia.showModal()
        isLoadingGraph.value = true
        drawKnowledgeGraph(res['data'])
      }else{

      }
    }
  })
}

const showNodeDetail = (id) => {
  nowShowDetailNodeID.value = id
}

const getLineColor = (type) => {  // 根据掌握程度，决定线条颜色
  console.log(type)
  switch (type){
    case "已掌握":
      return ''

    case "未掌握":
      return '#FF0000'

    case "掌握良好":
      return '#f3e19c'

    case "掌握一般":
      return '#FFA500'
  }
}

const drawKnowledgeGraph = async (graphJson) => {
  let nodes = graphJson['nodes']
  let relationships = graphJson['relationships']

  let jsonData: knowledgeGraphType = {    // 作图需要的数据格式
    nodes: [],
    lines: [],
  }
  let processNode = []
  let lines = []

  for(let i=0; i<nodes.length; i++){    // 提取节点信息
    let o = {}
    o['id'] = nodes[i]['element_id']

    if(nodes[i]['labels'][0] === 'Document')    // 根节点
    {
      o['text'] = nodes[i]['properties']['fileName']
      o['width'] = 150
      o['height'] = 150
    }
    else if(nodes[i]['labels'][0] === 'Chunk')
    {
      o['text'] = nodes[i]['properties']['text']
      o['nodeShape'] = '1'
      o['width'] = 150
      o['height'] = 100
    }
    else if(nodes[i]['labels'][0] === "__Entity__")
    {
      o['text'] = nodes[i]['properties']['id']
    }else{
      console.log(nodes[i])
    }

    processNode.push(o)
  }
  for(let i=0; i<relationships.length; i++){    // 边信息
    let o = {}
    o['from'] = relationships[i]['start_node_element_id']
    o['to'] = relationships[i]['end_node_element_id']
    o['text'] = relationships[i]['type']
    o['lineShape'] = 3
    o['color'] = getLineColor(relationships[i]['type'])
    lines.push(o)
  }
  jsonData['nodes'] = processNode
  jsonData['lines'] = lines
  graphRef$.value.setJsonData(jsonData)

  isLoadingGraph.value = false
}

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

const generateExercises = (ind) => {
  chapter.value = '第'.concat(stuChapterScoreList.value[ind]['chapter'].toString()).concat('章')
  isShowExercises.value = true
}

const getWrongQuestion = (ind) => {
  chapter.value = '第'.concat(stuChapterScoreList.value[ind]['chapter'].toString()).concat('章')
  isShowWrongQuestion.value = true
}
</script>

<style scoped lang="scss">
.my-node {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  .my-node-detail {
    display: block;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: -50%;
    width: 250px;
    height: auto;
    min-height: 60px;
    line-height: 30px;
    background: #fff;
    padding: 10px 0;
    border: 3px solid #f90;
    color: #000;
    z-index: 1;
    font-size: 18px;
    user-select: all;
  }
}
</style>