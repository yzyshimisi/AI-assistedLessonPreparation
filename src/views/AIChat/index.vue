<template>
<div class="flex min-h-screen w-full bg-base-200 relative">
  <div class="card bg-base-100 w-[220px] shadow-md">
    <div class="card-body">
      <div>
        <span class="flex float-right">
          <div class="ml-1 lg:tooltip cursor-pointer hover:bg-base-300" data-tip="搜索" onclick="searchTopic.showModal()"><el-icon :size="23" class="m-1"><Search /></el-icon></div>
          <div class="ml-1 lg:tooltip cursor-pointer hover:bg-base-300" data-tip="新建会话" onclick="addTopic.showModal()"><el-icon :size="23" class="m-1"><Edit /></el-icon></div>
        </span>
      </div>
      <h2 class="card-title mb-1 flex justify-center">会话列表</h2>
      <div style="border-bottom: 2px solid #000000;"></div>
      <div v-for="(value,index) in topicList"
           class="w-[160px] rounded-xl hover:bg-base-300 hover:cursor-pointer text-base p-2"
           :class="[index === nowTopicInd ? 'bg-base-300' : '']"
           @mouseenter="showChoIcon(index)" @mouseleave="notShowChoIcon(index)"
           @click="chooseTopic(index)"
      >
        <div class="flex items-center justify-between">
          <div class="w-[120px]"><p class="truncate">{{ value.title }}</p></div>
          <div
              v-if="isShowChoIcon[index] || index===nowTopicInd"
              onclick="topicInfo.showModal()" @click.stop="changeDiaInd(index)"
              class="lg:tooltip" data-tip="更多">
            <div class="flex"><el-icon><More /></el-icon></div></div>
        </div>
      </div>
      <div class="flex flex-col gap-2 mt-[80px]">
        <h2 class="card-title flex justify-center mb-1">快速功能</h2>
        <div style="border-bottom: 2px solid #000000;"></div>
        <div v-for="(value,index) in funcList" @click="showFuncForms(index)">
          <div class="hover:bg-base-300 hover:cursor-pointer rounded-md text-center py-1 px-4">{{ value }}</div>
          <div style="border-bottom: 1px solid #000000;" class="mt-2"></div>
        </div>
      </div>
    </div>
  </div>
  <div v-show="nowFuncForms === 0">     <!-- 快速功能表单 -->
    <lessonPlanDesign
        @closeFuncForm="closeFuncForm"
        @startCreateLessonPlan="isWaitRes = true"
        @endCreateLessonPlan="endCreateLessonPlan"
        :session_id="nowTopicInd !== -1 ? topicList[nowTopicInd]['id'] : '-1'"
    ></lessonPlanDesign>
  </div>
  <div v-if="nowTopicInd === -1 && nowFuncForms === -1" class="flex absolute bottom-0 left-[200px]">
    <div>
      <img src="/aichat/aiPerson.png">
    </div>
    <div class="chat chat-start">
      <div class="chat-bubble bg-base-100 text-base-content max-w-96">你好！这里是教小帮，请选择会话记录或新建会话</div>
    </div>
  </div>
  <div v-if="nowTopicInd !== -1">
    <chatBox
        :id="topicList[nowTopicInd] ? topicList[nowTopicInd]['id'] : -1"
        :isWaitRes="isWaitRes"
        :lessonPlanRes="lessonPlanRes"
        :isOpenFuncForm="nowFuncForms!==-1"
    ></chatBox>
  </div>
</div>
<dialog id="topicInfo" class="modal">
  <div class="modal-box">
    <div class="overflow-x-auto">
      <table class="table text-base">
        <tbody>
        <tr>
          <td class="w-2/5">会话名称</td>
          <td>
            <dClickEdit
                :data="topicList[dialogInd] ? topicList[dialogInd]['title'] : '数据尚未加载'"
                @overModify="modifyTitle"
            ></dClickEdit>
          </td>
        </tr>
        <tr>
          <td>上一次更改时间</td>
          <td>{{topicList[dialogInd] ? topicList[dialogInd]['updated_at'] : "数据尚未加载"}}</td>
        </tr>
        <tr>
          <td>创建时间</td>
          <td>{{topicList[dialogInd] ? topicList[dialogInd]['created_at'] : "数据尚未加载"}}</td>
        </tr>
        <tr>
          <td></td>
          <td><button @click="deleteTopic" class="btn btn-block btn-error"><el-icon><DeleteFilled /></el-icon>删除会话</button></td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button id="closeDialog">close</button>
  </form>
</dialog>
<dialog id="addTopic" class="modal">
  <div class="modal-box">
    <div class="flex">
      <input v-model="newTopicTitle" @keyup.enter="createTopic" type="text" placeholder="The title of the topic" class="input input-bordered w-full max-w-xs" />
      <form method="dialog" class="ml-7">
        <button @click="createTopic" class="btn btn-info">创建会话</button>
      </form>
    </div>
    <div class="mt-4 ml-4">提示：<br />要创建多个会话，回车是不会退出对话框的<br />直接点击创建按钮会以当前的时间命名</div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
<dialog id="searchTopic" class="modal">
  <div class="modal-box">
    <div class="flex">
      <input v-model="searchTopicKey" type="text" placeholder="The title of the topic" class="input input-bordered w-full max-w-xs" />
    </div>
    <div class="mt-4 ml-2">提示：在所有历史记录中查找</div>
    <div class="divider"></div>
    <div v-for="(value,index) in searchResult"
         class="rounded-xl hover:bg-base-300 hover:cursor-pointer text-base p-2 mt-1"
         :class="[index === nowTopicInd ? 'bg-base-300' : '']"
         @click="chooseSearchTopic(index)"
         onclick="searchTopic.close()"
    >
      <div class="flex flex-col justify-between">
        <div class="w-[120px]"><p class="truncate font-bold">{{ value['title'] }}</p></div>
        <div class="flex gap-8">
          <p>修改于：{{ value['updated_at'].split(' ')[0] }}</p>
          <p>创建于：{{ value['created_at'].split(' ')[0] }}</p>
        </div>
      </div>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, watch, toRef } from "vue";
import { useRequest } from "vue-hooks-plus";
import { getTopicListAPI } from "../../apis/";
import { ElNotification, ElMessage } from 'element-plus';
import { useMainStore } from "../../stores";
import { deleteTopicAPI, modifyTitleAPI, createTopicAPI, searchTopicAPI } from "../../apis";
import router from "../../router";
import { useRoute } from "vue-router";
import { chatBox, dClickEdit, lessonPlanDesign } from "../../components";

const topicList = ref([]);
const isShowChoIcon = ref<Array<boolean>>([]);

const dialogInd = ref<number>(-1);

const newTopicTitle = ref<string>("");

const nowTopicInd = ref<number>(-1);

const funcList = reactive([
    '自定义教案设计',
    '大单元教学设计',
    '跨学科设计',
    '单元作业设计',
    '说课稿设计',
    '一键生成PPT',
    '一键配图',
])
const nowFuncForms = ref<number>(-1);

const searchTopicKey = ref<string>()
const searchResult = ref<Array<object>>([])

watch(()=>searchTopicKey.value,()=>{
  run()
})

const isWaitRes = ref<boolean>(false);    // 用来在教案生成与聊天框组件中的数据传递
const lessonPlanRes = ref<string>('');

onMounted(()=>{
  getTopicList()
})

const showChoIcon = (ind) => {
  isShowChoIcon.value[ind] = true;
}
const notShowChoIcon = (ind) => {
  isShowChoIcon.value[ind] = false;
}

const changeDiaInd = (ind) => {
  dialogInd.value = ind;
}

const getTopicList = () => {
  useRequest(()=>getTopicListAPI(),{
    onSuccess(res){
      topicList.value = []
      if(res['code']===200){
        if(!res['data']) return
        for(let i=0; i<res['data'].length; i++){
          topicList.value.push(reactive(res['data'][i]));
          isShowChoIcon.value[i] = false;
        }
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    },
    onError(err){
      ElNotification({title: 'Error', message: err.toString(), type: 'error',})
    },
  })
}

const modifyTitle = (newTitle) => {
  console.log(newTitle)
  topicList.value[dialogInd.value]['title'] = newTitle
  useRequest(()=>modifyTitleAPI({
    id: topicList.value[dialogInd.value]['id'],
    new_topic: topicList.value[dialogInd.value]['title'],
  }),{
    onSuccess(res){
      if(res['code'] !== 200){
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',});
      }else{
        ElMessage({message: '修改成功', type: 'success',})
      }
    },
    onError(err){
      ElNotification({title: 'Error', message: err.toString(), type: 'error',});
    }
  })
}

const { data, run } = useRequest(()=>searchTopicAPI({key:searchTopicKey.value}),{
  debounceWait: 500,
  manual: true,
  onSuccess(res){
    if(res['code']===200){
      searchResult.value = res['data']
      console.log(searchResult.value)
    }else{
      ElNotification({title: 'Warning', message: res['msg'], type: 'warning',});
    }
  }
})

// const { data, run } = useRequest(()=>modifyTitleAPI({
//   id: topicList.value[dialogInd.value]['id'],
//   new_topic: topicList.value[dialogInd.value]['title'],
// }),{
//   debounceWait: 4000,
//   manual: true,
//   onSuccess(res){
//     if(res['code'] !== 200){
//       ElNotification({title: 'Warning', message: res['msg'], type: 'warning',});
//     }else{
//       console.log(res)
//     }
//   },
//   onError(err){
//     ElNotification({title: 'Error', message: err.toString(), type: 'error',});
//   }
// })
//
// watch(()=>topicList.value[dialogInd.value],c=>{
//   run();
// },{deep:true})

const deleteTopic = () => {
  useRequest(()=>deleteTopicAPI({id:topicList.value[dialogInd.value]["id"]}),{
    onSuccess(res){
      if(res['code'] === 200){
        topicList.value.splice(dialogInd.value,1);
        dialogInd.value = -1;
        nowTopicInd.value = -1
        router.push("/chat");
        document.getElementById("closeDialog").click();
        ElNotification({title: 'Success', message: "删除成功", type: 'success',});
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',});
      }
    },
    onError(err){
      ElNotification({title: 'Error', message: err.toString(), type: 'error',});
    },
  })
}

const createTopic = () => {
  if(newTopicTitle.value === ""){
    newTopicTitle.value = new Date().toLocaleString();
    console.log(newTopicTitle.value);
  }
  useRequest(()=>createTopicAPI({topic:newTopicTitle.value}),{
    onSuccess(res){
      if(res['code']===200){
        getTopicList()
        ElNotification({title: 'Success', message: "会话添加成功", type: 'success',});
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',});
      }
    },
    onError(err){
      ElNotification({title: 'Error', message: err.toString(), type: 'error',});
    },
    onFinally(){
      newTopicTitle.value = "";
    }
  })
}

const chooseSearchTopic = (ind) => {
  for(let i=0; i<topicList.value.length; i++){
    // if(topicList.value[i][''])
  }
}

const chooseTopic = (ind) => {
  nowTopicInd.value = ind;
}

const showFuncForms = (ind) => {
  if(nowTopicInd.value === -1){
    ElMessage({message: '请先选择一个会话', type: 'warning',})
    return
  }
  nowFuncForms.value = ind
}

const closeFuncForm = () => {
  nowFuncForms.value = -1
}

const endCreateLessonPlan = (str) => {
  isWaitRes.value = false
  lessonPlanRes.value = str
}
</script>

<style scoped>

</style>