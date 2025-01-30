<template>
<div class="flex h-full">
  <div class="card bg-base-200 w-80 shadow-xl">
    <div class="card-body">
      <div>
        <span class="flex float-right">
          <div class="ml-1 lg:tooltip cursor-pointer hover:bg-base-300" data-tip="搜索"><el-icon :size="23" class="m-1"><Search /></el-icon></div>
          <div class="ml-1 lg:tooltip cursor-pointer hover:bg-base-300" data-tip="新建会话" onclick="addTopic.showModal()"><el-icon :size="23" class="m-1"><Edit /></el-icon></div>
        </span>
      </div>
      <h2 class="card-title mb-1">会话列表</h2>
      <div v-for="(value,index) in topicList"
           class="w-[110%] rounded-lg hover:bg-base-300 hover:cursor-pointer text-lg"
           :class="[index === nowTopicInd ? 'bg-base-300' : '']"
           @mouseenter="showChoIcon(index)" @mouseleave="notShowChoIcon(index)"
           @click="chooseTopic(index)"
      >
        <div class="flex items-center justify-between m-1">{{value.title}}
          <div
              v-if="isShowChoIcon[index] || index===nowTopicInd"
              onclick="topicInfo.showModal()" @click.stop="changeDiaInd(index)"
              class="lg:tooltip" data-tip="more">
            <div class="flex"><el-icon><More /></el-icon></div></div>
        </div>
      </div>
    </div>
  </div>
  <div class="flex justify-center items-center w-full">
    <el-empty v-if="nowTopicInd === -1" description="还未选择会话" :image-size="200" />
    <div v-else="nowTopicInd !== -1">
        <chatBox></chatBox>
    </div>
  </div>
</div>
<dialog id="topicInfo" class="modal">
  <div class="modal-box">
    <div class="overflow-x-auto">
      <table class="table text-lg">
        <tbody>
        <!-- row 1 -->
        <tr>
          <td class="w-2/5">会话名称</td>
          <td v-if="!isModifyTitle" @dblclick="modifyTitle" class="hover:bg-base-200">
            <span>{{topicList[dialogInd] ? topicList[dialogInd]['title'] : "数据尚未加载"}}</span>
          </td>
          <td v-else class="hover:bg-base-200">
            <input v-model="topicList[dialogInd].title" @blur="overModifyTitle" @keyup.enter="overModifyTitle" id="titleInput" type="text" placeholder="Type here" class="input-xs w-full max-w-xs text-base" />
          </td>
        </tr>
        <!-- row 2 -->
        <tr>
          <td>上一次更改时间</td>
          <td>{{topicList[dialogInd] ? topicList[dialogInd]['updated_at'] : "数据尚未加载"}}</td>
        </tr>
        <!-- row 3 -->
        <tr>
          <td>创建时间</td>
          <td>{{topicList[dialogInd] ? topicList[dialogInd]['created_at'] : "数据尚未加载"}}</td>
        </tr>
        <!-- row 4 -->
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
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, watch } from "vue";
import { useRequest } from "vue-hooks-plus";
import { getTopicListAPI } from "../../apis/";
import { ElNotification } from 'element-plus';
import { useMainStore } from "../../stores";
import { deleteTopicAPI, modifyTitleAPI, createTopicAPI } from "../../apis";
import router from "../../router";
import { useRoute } from "vue-router";
import { chatBox } from "../../components"

const topicList = ref([]);
const isShowChoIcon = ref<Array<boolean>>([]);

const dialogInd = ref<number>(0);

const isModifyTitle = ref(false);

const newTopicTitle = ref<string>("");

const nowTopicInd = ref<number>(-1);
const nowRouter = useRoute();

onMounted(()=>{
  useRequest(()=>getTopicListAPI(),{
    onSuccess(res){
      if(res['code']===200){
        for(let i=0; i<res['data'].length; i++){
          topicList.value.push(reactive(res['data'][i]));
          isShowChoIcon.value[i] = false;
        }
        watch(()=>topicList.value[dialogInd.value],c=>{
          run();
        },{deep:true})
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    },
    onError(err){
      ElNotification({title: 'Error', message: err.toString(), type: 'error',})
    },
    onFinally(){
      if(nowRouter.query['index']){
        nowTopicInd.value = Number(nowRouter.query['index']);
      }else{
        nowTopicInd.value = -1;
      }
      watch(()=>nowRouter.query,(newQuery,oldQuery)=>{
        if(nowRouter.query['index']){
          nowTopicInd.value = Number(nowRouter.query['index']);
        }else{
          nowTopicInd.value = -1;
        }
      })
    }
  })
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

const modifyTitle = () => {
  isModifyTitle.value = true;
  nextTick(()=>{
    let titleInput = document.getElementById('titleInput') as HTMLInputElement;
    titleInput.focus();
    titleInput.setSelectionRange(titleInput.value.length, titleInput.value.length);
  })
}
const overModifyTitle = () => {
  isModifyTitle.value = false;
}

const { data, run } = useRequest(()=>modifyTitleAPI({
  id: topicList.value[dialogInd.value]['id'],
  new_topic: topicList.value[dialogInd.value]['title'],
}),{
  debounceWait: 4000,
  manual: true,
  onSuccess(res){
    if(res['code'] !== 200){
      ElNotification({title: 'Warning', message: res['msg'], type: 'warning',});
    }else{
      console.log(res)
    }
  },
  onError(err){
    ElNotification({title: 'Error', message: err.toString(), type: 'error',});
  }
})

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

const chooseTopic = (ind) => {
  nowTopicInd.value = ind;
  router.push("/chat?index=".concat(String(nowTopicInd.value)))
}
</script>

<style scoped>

</style>