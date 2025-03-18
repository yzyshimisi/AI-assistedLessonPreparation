<template>
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
      <th class="flex flex-col gap-2">
<!--        <div><button class="btn btn-outline btn-xs pl-4 pr-4 hover:bg-[#e8def7] hover:text-base-content text-sm">一键导入</button></div>-->
        <div><button @click="exportScore" class="btn btn-outline btn-xs pl-4 pr-4 hover:bg-[#e8def7] hover:text-base-content text-sm">一键导出</button></div>
      </th>
    </tr>
    </thead>
    <tbody>
    <tr
        v-for="(value,index) in academicAchieveList"

        @click="handleClick($event,index)"
        @contextmenu.prevent="openMenu($event,index)"

        class="hover:bg-[#e8def7] hover:cursor-pointer"
        :class="isChoAcademicList[index] ? 'bg-[#e8def7]' : ''"
    >
      <td>{{ value['name'] }}</td>
      <td>{{ value['class'] }}</td>
      <td>{{ value['student_id']}}</td>
      <td>{{ value['regular_score']}}</td>
      <td>{{ value['final_score']}}</td>
      <td>{{ value['total_score']}}</td>
      <td><input @click.stop="" v-model="isChoAcademicList[index]" type="checkbox" checked="checked" class="checkbox checkbox-sm" /></td>
    </tr>
    </tbody>
  </table>
</div>
<ul
    class="menu bg-base-300 rounded-box fixed"
    :class="isShowMenu ? '' : 'invisible'"
    :style="{left:menuPos.left+'px',top:menuPos.top+'px'}"
>
  <li><a @click="showEditDia">编辑</a></li>
  <li><a @click="delScore">删除</a></li>
</ul>
<dialog id="updateScoreDia" class="modal">
  <div class="modal-box">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <h3 class="text-lg font-bold">编辑学生成绩</h3>
    <div v-for="(value,index) in isChoAcademicList">
      <div v-if="editScoreInfo.length > index">
        <p class="py-4 flex">当前学生：<span class="underline underline-offset-1">{{ editScoreInfo[index]['name'] }}</span></p>
        <div class="flex flex-col gap-4 mt-4">
          <div class="flex items-center gap-4">
            <p class="col-span-1 w-[80px]">平时成绩：</p>
            <input @keyup.enter="updateScore" v-model="editScoreInfo[index]['regular_score']" type="text" placeholder="平时成绩" class="input input-bordered w-[200px]" />
          </div>
          <div class="flex items-center gap-4">
            <p class="col-span-1">期末成绩：</p>
            <input @keyup.enter="updateScore" v-model="editScoreInfo[index]['final_score']" type="text" placeholder="期末成绩" class="input input-bordered w-[200px]" />
          </div>
          <div class="flex items-center gap-4">
            <p class="col-span-1 w-[80px]">总成绩：</p>
            <p class="bg-[#f2f2f2] p-3 rounded-lg w-[200px] text-[#9ca3af]">{{ editScoreInfo[index]['regular_score'] && editScoreInfo[index]['final_score'] ? Math.round(Number(editScoreInfo[index]['regular_score']) * 0.4 + Number(editScoreInfo[index]['final_score']) * 0.6) : '总成绩会自动计算' }}</p>
          </div>
        </div>
        <div class="divider"></div>
      </div>
    </div>
    <div class="flex justify-center gap-6 mt-4">
      <button @click="updateScore" class="btn bg-[#65558f] pl-10 pr-10 text-base-100 hover:bg-purple-900">保存</button>
      <button onclick="updateScoreDia.close()" class="btn btn-outline pr-8 pl-8">取消</button>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { useRequest } from "vue-hooks-plus";
import { getAcademicAchieveAPI, updateScoreAPI, delScoreAPI, exportScoreAPI } from "../../apis";
import { ElMessage, ElNotification } from "element-plus";

const academicAchieveList = ref<Array<Object>>([])

const isChoAcademicList = ref<Array<boolean>>([])

const props = defineProps(['course_id'])  // 传入课程id

watch(()=>props.course_id,()=>{
  getAcademicAchieve()
})

onMounted(()=>{
  getAcademicAchieve()
})

const getAcademicAchieve = () => {
  if(!props.course_id){
    return
  }
  useRequest(()=>getAcademicAchieveAPI({course_id:props.course_id,class:''}),{
    onSuccess(res){
      if(res['code']===200){
        academicAchieveList.value = res['data']
        isChoAcademicList.value = []
        for(let i=0; i<academicAchieveList.value.length; i++){
          isChoAcademicList.value.push(false)
        }
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })
}

const handleClick = (event,ind) => {
  if (event.ctrlKey) {
    if(!isChoAcademicList.value[ind]) isChoAcademicList.value[ind] = true
  }else{
    selectOne(ind)
  }
}

const isShowMenu = ref<boolean>(false)
const menuPos = reactive({
  left: 0,
  top: 0,
})

watch(()=>isShowMenu.value,(newValue,oldValue)=>{
  if(isShowMenu.value){
    document.body.addEventListener('click',closeMenu)
  }else{
    document.body.removeEventListener('click',closeMenu)
  }
})

const openMenu = (event,ind) => {
  if(!isChoAcademicList.value[ind]){
    for(let i=0; i<isChoAcademicList.value.length; i++){
      if(i===ind) isChoAcademicList.value[i] = true
      else isChoAcademicList.value[i] = false
    }
  }
  isShowMenu.value = true
  menuPos.left = event.clientX
  menuPos.top = event.clientY

  window.addEventListener('scroll', closeMenu);
}

const closeMenu = () => {
  isShowMenu.value = false
  window.removeEventListener('scroll', closeMenu);
}

const selectOne = (ind) => {
  for(let i=0; i<isChoAcademicList.value.length; i++){
    if(ind===i) isChoAcademicList.value[i] = true;
    else isChoAcademicList.value[i] = false
  }
}

const editScoreInfo = ref<Array<updateScoreType>>([])

// watch([()=>editScoreInfo.value.regular_score,()=>editScoreInfo.value.final_score],()=>{
//   if(editScoreInfo.value.regular_score && editScoreInfo.value.final_score)
//     editScoreInfo.value.total_score = String(Math.round(Number(editScoreInfo.value.regular_score)*0.4 + Number(editScoreInfo.value.final_score)*0.6))
//   else
//     editScoreInfo.value.total_score = ''
// })

const showEditDia = () => {
  editScoreInfo.value = []
  for(let i=0;i<isChoAcademicList.value.length; i++){
    console.log(isChoAcademicList.value[i])
    if(isChoAcademicList.value[i]){
      let d = {
        student_id: '',
        name: '',
        class: '',
        major: '',
        college: '',
        regular_score: '',
        final_score: '',
        total_score: '',
      }
      Object.assign(d,academicAchieveList.value[i])

      d.final_score = String(d.final_score)
      d.regular_score = String(d.regular_score)
      d.total_score = String(d.total_score)

      editScoreInfo.value.push(d)
    }
  }
  updateScoreDia.showModal()
}

const updateScore = () => {
  for(let i=0 ;i<editScoreInfo.value.length; i++){
    editScoreInfo.value[i].total_score = String(Math.round(Number(editScoreInfo.value[i].regular_score)*0.4 + Number(editScoreInfo.value[i].final_score) * 0.6))
  }
  useRequest(()=>updateScoreAPI({
    course_id: props.course_id,
    update_scores: editScoreInfo.value
  }),{
    onSuccess(res){
      if(res['code']===200){
        updateScoreDia.close()
        getAcademicAchieve()
        ElMessage({message: '保存成功', type: 'success', plain: true,})
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })
}

const delScore = () => {
  let student_ids = []
  for(let i=0; i<academicAchieveList.value.length; i++){
    if(isChoAcademicList.value[i]){
      student_ids.push(academicAchieveList.value[i]['student_id'])
    }
  }
  if(student_ids.length > 0){
    useRequest(()=>delScoreAPI({
      course_id: props.course_id,
      student_ids: student_ids,
    }),{
      onSuccess(res){
        if(res['code']===200){
          getAcademicAchieve()
          ElMessage({message: '成功删除', type: 'success', plain: true,})
        }else{
          ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
        }
      }
    })
  }
}

const exportScore = () => {
  if(academicAchieveList.value.length===0){
    ElMessage({message: '没有成绩信息记录！', type: 'warning', plain: true,})
    return
  }else{
    useRequest(()=>exportScoreAPI({course_id: props.course_id}),{
      onSuccess(res){
        if(res['code']===200){
          let fileUrl = res['data']['url']
          let fileName = fileUrl.split('/').slice(-1)[0]  // 包含后缀了
          // let extName = fileUrl.substring(fileUrl.lastIndexOf('.'))

          let link = document.createElement('a')
          link.download = fileName
          link.href = fileUrl
          link.target = '_blank'
          link.style.display = 'none'

          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }else{
          ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
        }
      }
    })
  }
}
</script>

<style scoped>

</style>