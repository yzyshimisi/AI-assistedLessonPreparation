<template>
<div class="flex min-h-screen w-full relative">
  <!-- 工具栏 -->
  <div class="card bg-base-100 w-[13vw] shadow-md">
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
           class="w-full rounded-xl hover:bg-base-300 hover:cursor-pointer text-base p-2"
           :class="[index === nowTopicInd ? 'bg-base-300' : '']"
           @mouseenter="showChoIcon(index)" @mouseleave="notShowChoIcon(index)"
           @click="chooseTopic(index)"
      >
        <div class="flex items-center justify-between">
          <div class="w-[85%]"><p class="truncate">{{ value.title }}</p></div>
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
        <div v-for="(value,index) in funcList" @click="quickFun(index,value)">
          <div class="hover:bg-base-300 hover:cursor-pointer rounded-md text-center py-1 px-4 truncate">{{ value }}</div>
          <div style="border-bottom: 1px solid #000000;" class="mt-2"></div>
        </div>
      </div>
    </div>
  </div>
  <div>     <!-- 快速功能表单 -->
    <lessonPlanDesign
        v-show="nowFuncForms === 0"
        @closeFuncForm="closeFuncForm"
        @startQuickFunction="startQuickFunction"
        @endQuickFunction="endQuickFunction"
        :session_id="nowTopicInd !== -1 ? topicList[nowTopicInd]['id'] : '-1'"
    ></lessonPlanDesign>
    <unitTeachingDesign
        v-show="nowFuncForms === 1"
        @closeFuncForm="closeFuncForm"
        @startQuickFunction="startQuickFunction"
        @endQuickFunction="endQuickFunction"
        :session_id="nowTopicInd !== -1 ? topicList[nowTopicInd]['id'] : '-1'"
    ></unitTeachingDesign>
    <interdisciplinaryDesign
        v-show="nowFuncForms === 2"
        @closeFuncForm="closeFuncForm"
        @startQuickFunction="startQuickFunction"
        @endQuickFunction="endQuickFunction"
        :session_id="nowTopicInd !== -1 ? topicList[nowTopicInd]['id'] : '-1'"
    ></interdisciplinaryDesign>
    <unitHomeworkDesign
        v-show="nowFuncForms === 3"
        @closeFuncForm="closeFuncForm"
        @startQuickFunction="startQuickFunction"
        @endQuickFunction="endQuickFunction"
        :session_id="nowTopicInd !== -1 ? topicList[nowTopicInd]['id'] : '-1'"
    ></unitHomeworkDesign>
    <lessonProposalDesign
        v-show="nowFuncForms === 4"
        @closeFuncForm="closeFuncForm"
        @startQuickFunction="startQuickFunction"
        @endQuickFunction="endQuickFunction"
        :session_id="nowTopicInd !== -1 ? topicList[nowTopicInd]['id'] : '-1'"
    ></lessonProposalDesign>
    <generatePPT
        v-show="nowFuncForms === 5"
        @closeFuncForm="closeFuncForm"
        @startQuickFunction="startQuickFunction"
        @endQuickFunction="endQuickFunction"
        :session_id="nowTopicInd !== -1 ? topicList[nowTopicInd]['id'] : '-1'"
    ></generatePPT>
    <oneClickIllustration
        v-show="nowFuncForms === 6"
        @closeFuncForm="closeFuncForm"
        @startQuickFunction="startQuickFunction"
        @endQuickFunction="endQuickFunction"
        :session_id="nowTopicInd !== -1 ? topicList[nowTopicInd]['id'] : '-1'"
    ></oneClickIllustration>
  </div>
  <!-- 助手角色 -->
  <div v-if="nowTopicInd === -1" class="flex fixed left-[25vw] bottom-[10px]">
    <div>
      <img :src="assistantRoleSrc" class="h-[300px]">
    </div>
    <div class="chat chat-start">
      <div class="chat-bubble bg-base-100 text-base-content max-w-96">你好！这里是教小帮，请选择会话记录或新建会话</div>
    </div>
  </div>
  <div v-if="nowTopicInd !== -1">
    <chatBox
        :id="topicList[nowTopicInd] ? topicList[nowTopicInd]['id'] : -1"

        :isWaitRes="isWaitRes"
        :quickFuncReq="quickFuncReq"
        :quickFuncRes="quickFuncRes"

        :isOpenFuncForm="nowFuncForms!==-1"
        :getKnowledgeGraph="getKnowledgeGraph"

        @endGetKnowledgeGraph="getKnowledgeGraph=false"
    ></chatBox>
  </div>
</div>
<dialog id="topicInfo" class="modal">     <!-- 会话信息对话框 -->
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
<dialog id="addTopic" class="modal">    <!-- 添加会话对话框 -->
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
<dialog id="searchTopic" class="modal">     <!-- 搜索对话框 -->
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
import { ref, reactive, onMounted, watch } from "vue";
import { useRequest } from "vue-hooks-plus";
import { getTopicListAPI } from "../../apis/";
import { ElNotification, ElMessage } from 'element-plus';
import { deleteTopicAPI, modifyTitleAPI, createTopicAPI, searchTopicAPI } from "../../apis";
import router from "../../router";
import { chatBox, dClickEdit, lessonPlanDesign, unitTeachingDesign, interdisciplinaryDesign, unitHomeworkDesign, lessonProposalDesign, generatePPT, oneClickIllustration } from "../../components";
import { getAssistantRoleSrc } from "../../themes"
import assistantRole from "../../themes/assistantRole";
import { useMainStore } from "../../stores";

const userinfostore = useMainStore().userInfoStore()

const topicList = ref([]);
const isShowChoIcon = ref<Array<boolean>>([]);

const dialogInd = ref<number>(-1);    // 详细信息对话框

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
    '查看知识图谱',
])
const nowFuncForms = ref<number>(-1);

const searchTopicKey = ref<string>()
const searchResult = ref<Array<object>>([])

watch(()=>searchTopicKey.value,()=>{
  run()
})

const isWaitRes = ref<boolean>(false);    // 用来在教案生成与聊天框组件中的数据传递
const quickFuncReq = ref<string>('');     // 在聊天框中显示的提问（description）
const quickFuncRes = ref<string>('');     // 快速功能的回答

const assistantRoleSrc= ref<string>('');

const getKnowledgeGraph = ref<boolean>(false)

onMounted(()=>{
  getTopicList()
  assistantRoleSrc.value = getAssistantRoleSrc(userinfostore.userInfo.assistantRole)
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
  useRequest(()=>getTopicListAPI(localStorage.getItem('token')),{
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
        dialogInd.value = -1;       // 关闭详细信息对话框
        nowTopicInd.value = -1;     // 关闭当前的聊天框
        nowFuncForms.value = -1     // 关闭快速功能表单
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
  useRequest(()=>createTopicAPI(localStorage.getItem('token'),{topic:newTopicTitle.value}),{
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
    if(topicList.value[i]['id'] === searchResult.value[ind]['session_id']){
      chooseTopic(i)
    }
  }
}

const chooseTopic = (ind) => {
  nowTopicInd.value = ind;
}

const quickFun = (ind,val) => {   // 快速功能的执行函数
  if(nowTopicInd.value === -1){
    ElMessage({message: '请先选择一个会话', type: 'warning',})
    return
  }
  if(val==='查看知识图谱'){
    getKnowledgeGraph.value = true
  }else{
    nowFuncForms.value = ind
  }
}

const closeFuncForm = () => {
  nowFuncForms.value = -1
}

const startQuickFunction = (str) => {
  isWaitRes.value = true
  quickFuncReq.value = str
}

const endQuickFunction = (str) => {
  isWaitRes.value = false
  quickFuncRes.value = str
}
</script>

<style scoped>

</style>