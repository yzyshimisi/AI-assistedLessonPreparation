<template>
<dialog id="editCourseDia" class="modal">
  <div class="modal-box w-[1050px] max-w-[1200px]">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <h3 class="text-3xl font-bold">{{title}}</h3>
    <p class="py-4">请编辑课程相关信息</p>
    <div class="flex flex-col gap-10 text-base mt-4">
      <div class="flex items-center gap-4 ">
        <p class="font-bold">课程名称</p>
        <input v-model="courseInfo.course_name" type="text" placeholder="请输入课程名称" class="input input-bordered w-full max-w-[250px]" />
        <p class="font-bold ml-6">课程编号</p>
        <input v-model="courseInfo.course_number" type="text" placeholder="请输入课程编号" class="input input-bordered w-full max-w-[250px]" />
        <p class="font-bold ml-6">课程类别</p>
        <select v-model="courseInfo.course_type" class="select select-bordered text-base">
          <option disabled selected value=-1>请选择</option>
          <option value=1>必修课</option>
          <option value=2>选修课</option>
          <option value=3>任选课</option>
          <option value=4>体育课</option>
        </select>
      </div>
      <div class="flex items-center gap-4 ">
        <p class="font-bold">课程学分</p>
        <input v-model="courseInfo.credit" type="text" placeholder="请输入课程学分" class="input input-bordered w-full max-w-[250px]" />
        <p class="font-bold ml-6">课程班级</p>
        <input v-model="courseInfo.course_class" type="text" placeholder="请输入班级名称" class="input input-bordered w-full max-w-[250px]" />
      </div>
      <div class="divider"></div>
      <div class="flex items-center gap-4 ">
        <p class="font-bold">授课学年</p>
        <select v-model="academic_year_start" class="select select-bordered text-base">
          <option disabled selected value="">起始年份</option>
          <option v-for="(value,index) in startYears">{{value}}</option>
        </select>
        <select v-model="academic_year_end" class="select select-bordered text-base">
          <option disabled selected value="">结束年份</option>
          <option v-for="(value,index) in endYears">{{value}}</option>
        </select>
        <p class="font-bold ml-7">授课学期</p>
        <select v-model="courseInfo.academic_term" class="select select-bordered text-base">
          <option disabled selected value=-1>请选择</option>
          <option value=1>上学期</option>
          <option value=2>下学期</option>
        </select>
        <p class="font-bold ml-7">授课周次</p>
        <select v-model="week_start" class="select select-bordered text-base">
          <option disabled selected value="">起始周</option>
          <option v-for="(value,index) in startWeeks">{{value}}</option>
        </select>
        <select v-model="week_end" class="select select-bordered text-base">
          <option disabled selected value="">结束周</option>
          <option v-for="(value,index) in endWeeks">{{value}}</option>
        </select>
      </div>
      <div class="flex gap-4">
        <p class="font-bold">封面图片</p>
        <el-upload
            :file-list="uploadedImg"
            ref="uploadImg"
            :auto-upload="false"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-exceed="handleExceed"
            :limit="1"
            :on-change="getImage"
        >
        <el-icon><Plus /></el-icon>
        <template #tip>
          <div class="el-upload__tip">
            只能上传一张图片，多上传会覆盖
          </div>
        </template>
        </el-upload>
      </div>
      <div class="flex items-center gap-4">
        <p class="font-bold">课程时间</p>
        <div class="dropdown">
          <div tabindex="0" role="button" class="select select-bordered flex items-center m-1 text-base">{{ courseInfo.weekday.length>0 ? courseInfo.weekday : '请选择星期' }}</div>
          <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box border-2 w-[120px] p-2 shadow">
            <div class="form-control">
              <label v-for="(value,index) in weekdaysList" class="cursor-pointer rounded-lg label hover:bg-[#e8def7]">
                <span class="label-text text-base">{{value}}</span>
                <input @click="getFinalWeekday(index)" v-model="isChoWeekday[index]" type="checkbox" class="checkbox" />
              </label>
            </div>
          </ul>
        </div>
        <div class="dropdown">
          <div tabindex="0" role="button" class="btn m-1">选择节次</div>
          <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box border-2 shadow">
            <div v-for="(value,index) in sectionList" :class="choSectionNum === choWeekdayNum ? '' : ''">
              <button @click="chooseSection(index)" class="btn btn-ghost w-full bg-base-100 hover:bg-[#e8def7]">{{ value }}</button>
            </div>
          </ul>
        </div>
        <div v-for="(value,index) in choSectionList" class="border-2 rounded-lg p-2 relative">
          <span>{{value}}</span>
          <el-icon @click="removeSection(index)" class="absolute right-[-15px] top-[-18px] hover:cursor-pointer"><CloseBold /></el-icon>
        </div>
        <p class="font-bold ml-10">课程地点</p>
        <input v-model="courseInfo.course_addr" type="text" placeholder="请输入课程地点（以逗号分隔）" class="input input-bordered w-full max-w-xs" />
      </div>
      <div class="divider"></div>
      <div class="flex gap-4">
        <p class="font-bold">课程简介</p>
        <textarea v-model="courseInfo.course_introduction" class="textarea textarea-bordered text-base w-[500px] h-[90px] resize-none" placeholder="请输入内容"></textarea>
      </div>
      <div class="flex gap-4">
        <p class="font-bold">讲师介绍</p>
        <textarea v-model="courseInfo.lecturer_profile" class="textarea textarea-bordered text-base w-[500px] h-[90px] resize-none" placeholder="请输入内容"></textarea>
      </div>
      <div class="flex items-center gap-4">
        <p class="font-bold">行政班级</p>
        <div v-if="!props.courseData['id']" class="dropdown">
          <div tabindex="0" role="button" class="btn m-1">选择班级</div>
          <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box border-2 shadow">
            <div v-for="(value,index) in props['classList']">
              <button @click="chooseClass(index)" class="btn btn-ghost w-[200px] bg-base-100 hover:bg-[#e8def7]">{{ value }}</button>
            </div>
          </ul>
        </div>
        <div v-for="(value,index) in courseInfo.classes" class="border-2 rounded-lg p-2 relative">
          <span>{{value}}</span>
          <el-icon v-if="!props.courseData['id']" @click="removeClass(index)" class="absolute right-[-15px] top-[-18px] hover:cursor-pointer"><CloseBold /></el-icon>
        </div>
      </div>
    </div>
    <div class="flex justify-center gap-8 mt-[100px]">
      <button v-show="!isLoading" @click="saveEdit" class="btn bg-[#65568f] text-base-100 w-[80px] hover:bg-purple-800">确认</button>
      <button v-show="isLoading" class="btn btn-square bg-[#65568f] text-base-100 hover:bg-purple-800">
        <span class="loading loading-spinner"></span>
      </button>
      <button v-if="props.courseData['id']" @click="deleteCourse" class="btn btn-outline btn-error">删除课程</button>
      <button onclick="editCourseDia.close()" class="btn btn-outline w-[80px] hover:bg-base-300 hover:text-base-content">取消</button>
    </div>
  </div>
  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</dialog>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import type { UploadProps, UploadRawFile,UploadInstance,UploadUserFile  } from 'element-plus'
import { ElNotification, ElMessage, genFileId } from 'element-plus'
import { userUploadAPI, createCourseAPI, deleteCourseAPI, editCourseAPI } from "../../apis"
import { useRequest } from "vue-hooks-plus";

const props = defineProps(['courseData','classList'])
const varemit = defineEmits(["update"])

const title = ref<string>('添加课程');

watch(()=>props['courseData'],()=>{         // 初始化数据
  if(props['courseData']['id']){
    title.value = '编辑课程'
    Object.assign(courseInfo.value,props['courseData'])
    academic_year_start.value = courseInfo.value.academic_year.split('-')[0]
    academic_year_end.value = courseInfo.value.academic_year.split('-')[1]

    week_start.value = courseInfo.value.week.split('-')[0]
    week_end.value = courseInfo.value.week.split('-')[1]

    // dialogImageUrl.value = courseInfo.value.course_img

    let l = courseInfo.value.section.split(',')
    choSectionNum.value = l.length
    choSectionList.value = []
    for(let val in l){
      choSectionList.value.push(l[val])
    }

    l = courseInfo.value.weekday.split(',')
    choWeekdayNum.value = l.length
    for(let i=0; i<weekdaysList.length; i++){
      if(l.includes(String(i+1)))
        isChoWeekday.value[i] = true
      else
        isChoWeekday.value[i] = false
    }

    uploadedImg.value = [{
      name: 'uploadedImg',
      url: courseInfo.value.course_img
    }]

    imgFile.value = null
  }else{
    if(title.value === '添加课程') return

    title.value = '添加课程'

    uploadedImg.value = []

    courseInfo.value = {
      course_name: '',
      course_number: '',
      course_img: '',
      course_introduction: '',
      course_type: -1,
      course_addr: '',
      lecturer_profile: '',
      credit: '',
      academic_year: '',
      academic_term: -1,
      week: '',
      weekday: '',
      section: '',
      course_class: '',
      classes: [],
    }
    academic_year_start.value = ''
    week_start.value = ''

    choWeekdayNum.value = 0
    isChoWeekday.value = [false,false,false,false,false]

    choSectionList.value = []
    choSectionNum.value = 0
  }
})

const dialogImageUrl = ref('')      // 上传图片预览链接
const dialogVisible = ref(false)

const uploadImg = ref<UploadInstance>()   // 上传的图片
const imgFile = ref<Object|null>(null)

const uploadedImg = ref<UploadUserFile[]>([])

const courseInfo = ref({    // 基本信息
  course_name: '',
  course_number: '',
  course_img: '',
  course_introduction: '',
  course_type: -1,
  course_addr: '',
  lecturer_profile: '',
  credit: '',
  academic_year: '',
  academic_term: -1,
  week: '',
  weekday: '',
  section: '',
  course_class: '',
  classes: [],
})

const startYears = ref<Array<string>>([])   // 授课学年列表（可供选择的列表）
const endYears = ref<Array<string>>([])

const academic_year_start = ref<string>('');  // 授课学年
const academic_year_end = ref<string>('');

watch(()=>academic_year_start.value,()=>{
  if(academic_year_start.value === ''){
    academic_year_end.value = ''
    return
  }
  let y = Number(academic_year_start.value)
  endYears.value = []
  for(let i=0; i<8; i++){
    endYears.value.push((y+i+1).toString())
  }

  if(Number(academic_year_end.value)<=Number(academic_year_start.value) || Number(academic_year_end.value)>y+8){
    academic_year_end.value = (y + 1).toString()
  }
})

const startWeeks = ref<Array<string>>([])   // 授课周次（选择列表）
const endWeeks = ref<Array<string>>([])

const week_start = ref<string>('');   // 授课周次
const week_end = ref<string>('');

watch(()=>week_start.value,()=>{
  if(week_start.value === ''){
    week_end.value = ''
    return
  }
  if(Number(week_end.value)<=Number(week_start.value)){
    week_end.value = (Number(week_start.value)+1).toString()
  }
  endWeeks.value = startWeeks.value.filter((val)=>Number(val)>Number(week_start.value))
  endWeeks.value.push('16')
})

const weekdaysList = [    // 授课时间（星期）
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
]

const isChoWeekday = ref<Array<boolean>>([false,false,false,false,false])
const choWeekdayNum = ref<number>(0)

const getFinalWeekday = (ind) => {
  if(isChoWeekday.value[ind]){        // 切换状态
    isChoWeekday.value[ind] = false
    choWeekdayNum.value--

    if(choWeekdayNum.value < choSectionNum.value){
      choSectionList.value = choSectionList.value.slice(0,choWeekdayNum.value)
      choSectionNum.value--
    }
  }else{
    isChoWeekday.value[ind] = true
    choWeekdayNum.value++
  }

  courseInfo.value.weekday = ''

  for(let i=0; i<5; i++){         // 通过逗号连接
    if(isChoWeekday.value[i]){
      courseInfo.value.weekday = courseInfo.value.weekday.concat((i+1).toString()).concat(',')
    }
  }
  if(courseInfo.value.weekday.length>1){
    courseInfo.value.weekday = courseInfo.value.weekday.substring(0,courseInfo.value.weekday.length-1)
  }
}

const sectionList = [   // 授课时间（节次）
    '1-2',
    '3-4',
    '3-5',
    '6-7',
    '8-9',
    '10-11',
    '10-12',
]

const choSectionList  = ref<Array<string>>([])
const choSectionNum = ref<number>(0)

const chooseSection = (ind) => {    // 添加节次
  if(choWeekdayNum.value > choSectionNum.value){
    choSectionList.value.push(sectionList[ind])
    choSectionNum.value++
  }
}

const removeSection = (ind) => {    // 删除节次
  choSectionList.value = choSectionList.value.slice(0,ind).concat(choSectionList.value.slice(ind+1,choSectionList.value.length))
  choSectionNum.value--
}

const chooseClass = (ind) => {  // 添加行政班级
  if(!courseInfo.value.classes.includes(props['classList'][ind]))  courseInfo.value.classes.push(props['classList'][ind])
}

const removeClass = (ind) => {  // 删除行政班级
  courseInfo.value.classes = courseInfo.value.classes.filter((val)=>courseInfo.value.classes.indexOf(val)!==ind)
}

onMounted(()=>{
  let nowYear = new Date().getFullYear()    // 当前年份
  for(let i=0; i<10; i++){
    startYears.value.push((nowYear+i).toString())
  }

  for(let i=1; i<16; i++){
    startWeeks.value.push(i.toString())
  }
})

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {  // 上传图片预览
  console.log(uploadImg.value)
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

const handleExceed: UploadProps['onExceed'] = (files) => {  // 上传图片超过一张（替换）
  uploadImg.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadImg.value!.handleStart(file)
}

const getImage = (uploadFile, uploadFiles) => {   // 获取上传图片（包含File对象）
  imgFile.value = uploadFile
  // console.log(imgFile.value)
}

const isLoading = ref<boolean>(false)   // 加载按钮

const saveEdit = () => {    // 编辑课程（包括创建与编辑）
  isLoading.value = true

  courseInfo.value.section = ''
  for(let i=0; i<choSectionNum.value-1; i++){
    courseInfo.value.section = courseInfo.value.section.concat(choSectionList.value[i]).concat(',')
  }
  courseInfo.value.section = courseInfo.value.section.concat(choSectionList.value[choSectionNum.value-1])

  courseInfo.value.academic_year = academic_year_start.value.concat('-').concat(academic_year_end.value)
  courseInfo.value.week = week_start.value.concat('-').concat(week_end.value)

  courseInfo.value.course_type = Number(courseInfo.value.course_type)
  courseInfo.value.academic_term = Number(courseInfo.value.academic_term)

  if(!props.courseData['id'] || imgFile.value ){

    uploadCourseImg();    // 先上传图片

    const flag = watch(()=>courseInfo.value.course_img,()=>{
      if(props.courseData['id'])
        editCourse();
      else
        createCourse()
      flag()
    })
  }else{
    if(props.courseData['id'])
      editCourse();
    else
      createCourse()
  }
}

const createCourse = () => {
  useRequest(()=>createCourseAPI(courseInfo.value),{
    onSuccess(res){
      if(res['code']===200){
        title.value = '编辑课程'
        editCourseDia.close()
        ElMessage({message: '创建成功', type: 'success', plain: true,})
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    },
    onFinally(){
      isLoading.value = false
      varemit('update')
    }
  })
}

const editCourse = () => {
  let d = {}
  Object.assign(d,courseInfo.value)

  d['is_completed'] = false
  d['id'] = props.courseData['id']

  d['course_type'] = Number(d['course_type'])
  d['academic_term'] = Number(d['academic_term'])

  useRequest(()=>editCourseAPI(d),{
    onSuccess(res){
      if(res['code']===200){
        editCourseDia.close()
        ElMessage({message: '编辑成功', type: 'success', plain: true,})
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    },
    onFinally(){
      isLoading.value = false
      varemit('update')
    }
  })
}

const uploadCourseImg = () => {     // 上传图片，将链接赋值进courseInfo
  let file = imgFile.value['raw']
  let formData = new FormData()

  formData.append('type','1')
  formData.append('file', file)

  useRequest(()=>userUploadAPI(formData),{
    onSuccess(res){
      if(res['code']===200){
        courseInfo.value.course_img = res['data']['url']
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })
}

const deleteCourse = () => {
  useRequest(()=>deleteCourseAPI(props['courseData']['id']),{
    onSuccess(res){
      if(res['code']===200){
        editCourseDia.close()
        ElMessage({message: '删除成功', type: 'success', plain: true,})
      }else{ElNotification({title: 'Warning', message: res['msg'], type: 'warning',}) }
    },
    onFinally(){
      varemit('update')
    }
  })
}
</script>

<style scoped>
</style>