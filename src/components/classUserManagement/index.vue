<template>
<div class="flex flex-col mt-4 gap-5">
  <div class="flex gap-4 items-center h-[40px]">
    <select v-model="courseId" class="select select-bordered select-sm h-full text-base bg-base-200 font-normal w-[200px]">
      <option disabled selected value="-1">请选择课程</option>
      <option v-for="(value,key,index) in courseList" :value="value['id']">{{value['course_name']}}</option>
    </select>
    <button onclick="oneClickInput.showModal()" class="btn btn-sm h-full btn-outline hover:bg-[#e8def7] hover:text-base-content pl-8 pr-8 text-base font-normal">班级成员一键录入</button>
    <button onclick="manualInput.showModal()" @click="isShowAddUserForm=true" class="btn btn-sm h-full btn-outline hover:bg-[#e8def7] hover:text-base-content text-base font-normal">手动导入</button>
<!--    <div v-show="isShowAddUserForm" @blur="isShowAddUserForm=false" class="bg-[#f0eefc] border-[1px] border-base-content rounded-lg flex items-center gap-4 pl-2 pr-6 py-1">-->
<!--      <p class="ml-2">姓名</p>-->
<!--      <input type="text" placeholder="Type here" class="input input-bordered input-sm w-36" />-->
<!--      <p>学号</p>-->
<!--      <input type="text" placeholder="Type here" class="input input-bordered input-sm w-56" />-->
<!--      <button class="btn bg-[#65558f] btn-sm pl-14 pr-14 text-base-100 hover:bg-purple-900">添加</button>-->
<!--    </div>-->
  </div>
  <div class="flex gap-4 items-center h-[30px]">
    <button
        v-for="(value,index) in courseClassesList"
        @click="chooseCourseClass(index)"
        class="btn btn-sm h-full btn-outline hover:bg-[#e8def7] hover:text-base-content pl-6 pr-6 text-base font-normal"
        :class="index===nowCourseClassInd ? 'bg-[#e8def7]' : ''"
    >
      <el-icon v-show="index===nowCourseClassInd"><Select /></el-icon>
      {{ value }}
    </button>
  </div>
  <div class="divider w-[1000px]"></div>
  <div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
    <table class="table text-base bg-[#fef7ff]">
      <thead>
      <tr class="text-base">
        <th v-if="isMultiChoice"></th>
        <th>学生姓名</th>
        <th>班级</th>
        <th>学号</th>
        <th>学院</th>
        <th>专业</th>
        <th v-if="!isMultiChoice"><button @click="isMultiChoice=true" class="btn btn-outline btn-sm">多选</button></th>
        <th v-else class="flex gap-2">
          <button @click="delMultiple" class="btn btn-outline btn-sm">确认删除</button>
          <button @click="endMultiChoice" class="btn btn-outline btn-sm">取消多选</button>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="(value,index) in stuList"
          @click="changeCho(index)"
          class="hover:bg-[#e8def7]"
          :class="[isChoStuList[index] ? 'bg-[#e8def7]' : '',isMultiChoice ? 'cursor-pointer' : '']"
      >
        <td v-if="isMultiChoice"><input v-model="isChoStuList[index]" type="checkbox" class="checkbox checkbox-sm" /></td>
        <td>{{ value['name'] }}</td>
        <td>{{ value['class']}}</td>
        <td>{{ value['student_id']}}</td>
        <td>{{ value['college']}}</td>
        <td>{{ value['major']}}</td>
        <td class="flex gap-2">
          <button @click="editStuInfo(index)" class="btn btn-outline btn-info btn-sm">编辑</button>
          <button @click="delOneInfo(index)" class="btn btn-outline btn-error btn-sm">删除</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</div>
<dialog id="oneClickInput" class="modal">
  <div class="modal-box  w-[550px] max-w-[2000px]">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <h3 class="text-lg font-bold">Excel格式说明</h3>
    <p class="pt-4">Sheet1</p>
    <p>第一行 必填列：学号</p>
    <p>可选列：姓名，学院，班级，专业，平时成绩，期末成绩，最终成绩</p>
    <p>第二行以下为数据</p>
    <p>注意：可选列可以为空，如果第一行有该标题，其数据不得为空</p>
    <div class="mt-8 flex justify-center">
      <button @click="oneClickInput" onclick="oneClickInput.close()" class="btn bg-[#65558f] pl-14 pr-14 text-base-100 hover:bg-purple-900">确认</button>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
<dialog id="manualInput" class="modal">
  <div class="modal-box w-[800px] max-w-[1200px]">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <h3 class="text-lg font-bold">手动导入学生信息</h3>
    <div class="flex flex-col mt-7 gap-4">
      <div class="flex items-center gap-2">
        <p>姓名：</p><input @keyup.enter.stop="addStudentInfo" v-model="addedStudentInfo.name" type="text" placeholder="请输入学生的姓名" class="input input-bordered w-[280px]" />
        <p class="ml-8">学号：</p><input @keyup.enter.stop="addStudentInfo" v-model="addedStudentInfo.student_id" type="text" placeholder="请输入学生的学号" class="input input-bordered w-[280px]" />
      </div>
      <div class="flex items-center gap-2 mt-2">
        <p>学院：</p><input @keyup.enter.stop="addStudentInfo" v-model="addedStudentInfo.college" type="text" placeholder="请输入学生所在的学院" class="input input-bordered w-[280px]" />
        <p class="ml-8">专业：</p><input @keyup.enter.stop="addStudentInfo" v-model="addedStudentInfo.major" type="text" placeholder="请输入学生的专业" class="input input-bordered w-[280px]" />
      </div>
      <div class="flex items-center gap-2 mt-2">
        <p>班级：</p><input @keyup.enter.stop="addStudentInfo" v-model="addedStudentInfo.class" type="text" placeholder="请输入学生所在的行政班级" class="input input-bordered w-[280px]" />
      </div>
      <div class="divider">输入完信息后，按回车可以持续输入</div>
      <div class="flex justify-center gap-7">
        <button @click="addStudentInfo" onclick="manualInput.close()" class="btn bg-[#65558f] pl-14 pr-14 text-base-100 hover:bg-purple-900">添加</button>
        <button onclick="manualInput.close()" class="btn btn-active pl-14 pr-14">取消</button>
      </div>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
<dialog id="editDialog" class="modal">
  <div class="modal-box w-[800px] max-w-[1200px]">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <h3 class="text-lg font-bold">编辑学生信息</h3>
    <div class="flex flex-col mt-7 gap-4">
      <div class="flex items-center gap-2">
        <p>姓名：</p><input @keyup.enter.stop="editStudentInfo" v-model="editedStudentInfo.name" type="text" placeholder="请输入学生的姓名" class="input input-bordered w-[280px]" />
        <p class="ml-8">学号：</p><input @keyup.enter.stop="editStudentInfo" v-model="editedStudentInfo.student_id" type="text" placeholder="请输入学生的学号" class="input input-bordered w-[280px]" />
      </div>
      <div class="flex items-center gap-2 mt-2">
        <p>学院：</p><input @keyup.enter.stop="editStudentInfo" v-model="editedStudentInfo.college" type="text" placeholder="请输入学生所在的学院" class="input input-bordered w-[280px]" />
        <p class="ml-8">专业：</p><input @keyup.enter.stop="editStudentInfo" v-model="editedStudentInfo.major" type="text" placeholder="请输入学生的专业" class="input input-bordered w-[280px]" />
      </div>
      <div class="flex items-center gap-2 mt-2">
        <p>班级：</p><input @keyup.enter.stop="editStudentInfo" v-model="editedStudentInfo.class" type="text" placeholder="请输入学生所在的行政班级" class="input input-bordered w-[280px]" />
      </div>
      <div class="flex justify-center gap-7 mt-4">
        <button @click="editStudentInfo" onclick="manualInput.close()" class="btn bg-[#65558f] pl-14 pr-14 text-base-100 hover:bg-purple-900">保存</button>
        <button onclick="editDialog.close()" class="btn btn-active pl-14 pr-14">取消</button>
      </div>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { getCourseListAPI } from "../../apis"
import { useRequest } from "vue-hooks-plus";
import { ElMessage,ElNotification } from "element-plus";
import { oneClickInputAPI, getCourseClassesListAPI, addStudentInfoAPI, getStudentInfoAPI, editStudentInfoAPI, delStudentInfoAPI } from "../../apis"

const isShowAddUserForm = ref<boolean>(false);

const courseList = ref<Array<Object>>([]);
const courseId = ref<number>(-1);

watch(()=>courseId.value,()=>{
  nowCourseClassInd.value = -1
  stuList.value = []
  getCourseClassesList();
})

const courseClassesList = ref<Array<string>>([])
const nowCourseClassInd = ref<number>(-1);

const excelFile = ref<File|null>(null);

const addedStudentInfo = ref({    // 添加学生的信息存储
  name: '',
  student_id: '',
  college: '',
  class: '',
  major: '',
  course_id: -1,
})

const editedStudentInfo = ref({    // 编辑学生的信息存储
  name: '',
  student_id: '',
  college: '',
  class: '',
  major: '',
})

const stuList = ref<Array<Object>>([])

const isChoStuList = ref<Array<boolean>>([])

const isMultiChoice = ref<boolean>(false)

watch(()=>nowCourseClassInd.value,()=>{
  getStudentInfo();
})

onMounted(()=>{
  getCourseList()
})

const getStudentInfo = () => {
  if(courseId.value === -1 || nowCourseClassInd.value === -1){
    return
  }
  useRequest(()=>getStudentInfoAPI({
    course_id: courseId.value,
    class: courseClassesList.value[nowCourseClassInd.value]
  }),{
    onSuccess(res){
      if(res['code']===200){
        stuList.value = res['data']
        isChoStuList.value = []
        for(let i=0; i<stuList.value.length; i++){
          isChoStuList.value.push(false)
        }
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })
}

const getCourseList = () => {
  useRequest(()=>getCourseListAPI(),{
    onSuccess(res){
      if(res['code']===200){
        courseList.value = res['data']
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })
}

const oneClickInput = () => {
  if(courseId.value === -1){
    ElMessage({message: '请先选择课程', type: 'warning',})
    return
  }

  const inpEle = document.createElement('input')    // 弹出文件选择器
  inpEle.type = 'file'
  inpEle.style.display = 'none'
  inpEle.addEventListener("change", event => excelFile.value=inpEle.files[0], {once: true});
  inpEle.click();

  const f = watch(()=>excelFile.value,()=>{
    let exp = excelFile.value.name.split('.')[1]
    let type = excelFile.value.type
    if(!((exp === 'xlsx' && type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || (exp === 'xls' && type === 'application/vnd.ms-excel'))){
      ElMessage({message: '文件类型有误！', type: 'warning',})
      f()
      return
    }

    useRequest(()=>oneClickInputAPI({course_id:courseId.value,file:excelFile.value}),{
      onSuccess(res){
        if(res['code']===200){
          ElMessage({message: '录入成功', type: 'success',})
        }else{
          ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
        }
      }
    })
    f()
  })
}

const getCourseClassesList = () => {
  useRequest(()=>getCourseClassesListAPI({course_id:courseId.value}),{
    onSuccess(res){
      if(res['code']===200){
        courseClassesList.value = res['data']['class_list']
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })
}

const chooseCourseClass = (ind) => {
  nowCourseClassInd.value = ind
}

const addStudentInfo = () => {
  if(courseId.value === -1){
    manualInput.close()
    ElMessage({message: '请先选择课程！', type: 'warning',})
    return
  }

  addedStudentInfo.value.course_id = courseId.value
  useRequest(()=>addStudentInfoAPI(addedStudentInfo.value),{
    onSuccess(res){
      if(res['code']===200){
        ElMessage({message: '添加成功', type: 'success',})
        addedStudentInfo.value = {
          name: '',
          student_id: '',
          college: '',
          class: '',
          major: '',
          course_id: -1,
        }
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })
}

const endMultiChoice = () => {
  isMultiChoice.value = false
  for(let i=0; i<isChoStuList.value.length; i++){
    isChoStuList.value[i] = false
  }
}

const changeCho = (ind) => {
  if(!isMultiChoice.value) return

  if(isChoStuList.value[ind]) isChoStuList.value[ind] = false
  else isChoStuList.value[ind] = true
}

const editStuInfo = (ind) => {
  Object.assign(editedStudentInfo.value,stuList.value[ind])
  editDialog.showModal()
}

const editStudentInfo = () => {
  useRequest(()=>editStudentInfoAPI(editedStudentInfo.value),{
    onSuccess(res){
      if(res['code']===200){
        editDialog.close()
        getStudentInfo()
        ElMessage({message: '保存成功', type: 'success',})
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })
}

const delOneInfo = (ind) => {
  isChoStuList.value[ind] = true;
  delStudentInfo()
}

const delStudentInfo = () => {
  let student_ids = []
  for(let i=0; i<isChoStuList.value.length; i++){
    if(isChoStuList.value[i]){
      student_ids.push(stuList.value[i]['student_id'])
    }
  }
  if(student_ids.length === 0) return
  useRequest(()=>delStudentInfoAPI({student_ids:student_ids}),{
    onSuccess(res){
      if(res['code']===200){
        getStudentInfo();
        ElMessage({message: '删除成功！', type: 'success',})
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })
}

const delMultiple = () => {
  delStudentInfo();
  isMultiChoice.value = false
}
</script>

<style lang="css">
</style>