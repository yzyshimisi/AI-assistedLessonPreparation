<template>
<div class="flex flex-col gap-4 ml-4">
  <div class="flex gap-4 items-center">
    <select v-model="choClass" class="select select-bordered text-base border-2 border-[#65558f] focus:ring focus:ring-2 focus:ring-[#65558f] max-w-[210px] truncate">
      <option disabled selected value="">请选择要查询的班级</option>
      <option v-for="(value,index) in classList">{{ value }}</option>
    </select>
    <p class="border-[1px] border-black p-2 ml-4 w-[150px] rounded-xl text-purple-950">
      手动搜索需要查询的同学期末成绩单
    </p>
    <div class="flex gap-4 items-center bg-[#f3f1ff] text-purple-950 px-4 py-2 border-[1px] border-black rounded-xl">
      <p>姓名</p>
      <input v-model="searchInfo['name']" type="text" placeholder="请输入学生姓名" class="input input-bordered" />
      <p>学号</p>
      <input v-model="searchInfo['student_id']" type="text" placeholder="请输入学生姓名" class="input input-bordered" />
      <button @click="getStuFinalGrades" class="btn bg-[#65558f] text-white hover:bg-purple-900">确定</button>
    </div>
  </div>
  <div class="flex gap-4">
    <select v-model="academicYear" class="select select-bordered select-sm text-base bg-base-200">
      <option v-for="(value,index) in yearList">{{ value }}</option>
    </select>
    <select v-model="academicTerm" class="select select-bordered select-sm ml-2 text-base bg-base-200 ">
      <option :value="1">上学期</option>
      <option :value="2">下学期</option>
    </select>
  </div>
  <div class="divider"></div>
  <div class="overflow-x-auto">
    <table class="table text-base bg-[#fef7ff]">
      <thead>
      <tr class="text-base">
        <th></th>
        <th>学生姓名</th>
        <th>班级</th>
        <th>学号</th>
        <th>专业排名</th>
        <th>专业排名学期总绩点</th>
        <th class="flex flex-col gap-1 items-center">
          <div><button @click="selectAll" class="btn btn-outline btn-sm hover:bg-[#e5dbf5] hover:text-black">一键全选</button></div>
          <div><button class="btn btn-outline btn-sm hover:bg-[#e5dbf5] hover:text-black">一键发送给学生</button></div>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="(value,index) in finalGradeList"
          class="hover:cursor-pointer hover:bg-[#e5dbf5]" :class="isChoFinalGrade[index] ? 'bg-[#e5dbf5]' : ''"
          @click="isChoFinalGrade[index] = !isChoFinalGrade[index]"
      >
        <td class="text-center"><input @click.stop="" v-model="isChoFinalGrade[index]" type="checkbox" checked="checked" class="checkbox checkbox-sm" /></td>
        <td>{{ value['name'] }}</td>
        <td>{{ value['class']}}</td>
        <td>{{ value['student_id']}}</td>
        <td>{{ value['ranking']}}</td>
        <td>{{ value['avg_gpa'].toFixed(2) }}</td>
        <td class="flex justify-center gap-1">
          <button @click.stop="checkTranscript(index)" class="btn btn-sm bg-[#65558f] text-white hover:bg-purple-900">查看成绩单</button>
          <button @click.stop="sendTranscript(index)" class="btn btn-sm bg-[#65558f] text-white hover:bg-purple-900">发送</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
  <!-- 成绩单表格对话框 -->
  <dialog id="transcript" class="modal">
    <div class="modal-box max-w-[95vw] w-full">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <div class="flex gap-4 items-center">
        <h3 class="text-2xl font-bold">成绩单</h3>
        <div class="divider divider-horizontal"></div>
        <button @click.stop="downloadExcel" class="btn btn-sm bg-[#65558f] text-white hover:bg-purple-900">下载到本地</button>
        <button @click.stop="sendTranscript(checkTranscriptInd)" class="btn btn-sm bg-[#65558f] text-white hover:bg-purple-900">发送给学生</button>
      </div>
      <div id="transcriptTable" class="mt-4"></div>
    </div>
  </dialog>
</div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { getClassListAPI, getStuFinalGradesAPI, getStuFinalTranscriptAPI, sendTranscriptAPI } from "../../apis"
import { useRequest } from "vue-hooks-plus";
import * as XLSX from 'xlsx'
import { ElMessage } from "element-plus";

const classList = ref<Array<string>>([])

const choClass = ref<string>('')

const yearList = ref<Array<string>>([])       // 年份列表（以当前年份往前推5年）

const academicYear = ref<string>('')   // 学年
const academicTerm = ref<number>(-1)   // 学期

watch([()=>choClass.value,()=>academicYear.value,()=>academicTerm.value],()=>{
  searchInfo.value['name'] = ''
  searchInfo.value['student_id'] = ''
  getStuFinalGrades()
})

const finalGradeList = ref<Array<object>>([])
const isChoFinalGrade = ref<Array<boolean>>([])

const searchInfo = ref<object>({
  name: '',
  student_id: '',
})

const checkTranscriptInd= ref<number>(-1)

const tableUrl = ref<string>('')

onMounted(()=>{
  for(let i=0; i<5; i++){   // 初始化年份列表
    yearList.value.push(String(new Date().getFullYear()-i).concat('-').concat(String(new Date().getFullYear()+1-i)))
  }
  academicYear.value = yearList.value[0]

  let month = new Date().getMonth() + 1
  if(month>7) academicTerm.value = 1
  else academicTerm.value = 2

  getClassList()
})

const checkTranscript = (ind) => {
  checkTranscriptInd.value = ind
  useRequest(()=>getStuFinalTranscriptAPI(localStorage.getItem('token'),{
    student_id: finalGradeList.value[ind]['student_id'],
    academic_year: academicYear.value,
    academic_term: academicTerm.value,
  }),{
    onSuccess : async (res) => {
      if(res['code']===200){
        tableUrl.value = res['data']['url']
        let excelFile = await (await fetch(tableUrl.value)).arrayBuffer()

        let workbook = XLSX.read(excelFile)
        let firstSheetName = workbook.SheetNames[0];
        let worksheet = workbook.Sheets[firstSheetName];

        let html = XLSX.utils.sheet_to_html(worksheet);
        let styledHtml = html.replace(/<table/g, '<table class="w-[90vw] border border-black"')
            .replace(/<th/g, '<th class="px-2 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-black"')
            .replace(/<td/g, '<td class="px-2 py-2 max-w-[100px] truncate whitespace-nowrap text-sm text-black border border-black"');
        document.getElementById('transcriptTable').innerHTML = styledHtml;

        transcript.showModal()  // 显示对话框
      }else{

      }
    }
  })
}

const sendTranscript = (ind) => {
  useRequest(()=>sendTranscriptAPI(localStorage.getItem('token'),{student_id: finalGradeList.value[ind]['student_id']}),{
    onSuccess(res){
      if(res['code']===200){
        ElMessage({message: '发送成功', type: 'success', plain: true,})
      }else{

      }
    }
  })
}

const downloadExcel = () => {
  let fileUrl = tableUrl.value
  let fileName = fileUrl.substring( fileUrl.lastIndexOf("/")+1 )

  const link = document.createElement('a');
  link.download = fileName;  // 指定下载文件的名称
  link.href = fileUrl;
  link.target = "_blank"
  link.style.display = "none"          // 这个元素不用呈现在页面上，隐藏掉。

  document.body.appendChild( link );
  link.click();

  document.body.removeChild( link );   // 防止多次下载
}

const getStuFinalGrades = () => {
  if(!choClass.value) return
  useRequest(()=>getStuFinalGradesAPI(localStorage.getItem('token'),{
    academic_year: academicYear.value,
    academic_term: academicTerm.value,
    class: choClass.value,
    name: searchInfo.value['name'],
    student_id: searchInfo.value['student_id'],
  }),{
    onSuccess(res){
      if(res['code']===200){
        finalGradeList.value = res['data']
        isChoFinalGrade.value = []
        for(let i=0; i<finalGradeList.value.length; i++){
          isChoFinalGrade.value.push(false)
        }
      }else{

      }
    }
  })
}

const selectAll = () => {
  if(isChoFinalGrade.value.length){
    for(let i=0; i<isChoFinalGrade.value.length; i++){
      isChoFinalGrade.value[i] = true
    }
  }
}

const getClassList = () => {
  useRequest(()=>getClassListAPI(localStorage.getItem('token')),{
    onSuccess(res){
      if(res['code']===200){
        classList.value = res['data']['class_list']
      }else{

      }
    }
  })
}
</script>

<style scoped lang="scss">
.sheetjs-table {
  border-collapse: collapse;
  width: 100%;
  margin: 20px 0;
  font-family: Arial, sans-serif;
}

.sheetjs-table th {
  background-color: #f2f2f2;
  font-weight: bold;
  text-align: center;
  padding: 8px;
  border: 1px solid #ddd;
}

.sheetjs-table td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
}

.sheetjs-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.sheetjs-table tr:hover {
  background-color: #f1f1f1;
}
</style>