<template>
<div class="ml-6 mt-5">
  <div id="chatBox" class="w-[78%] h-[87%] overflow-auto absolute bg-base-200">
    <div v-for="(value,index) in chatMsg" class="mt-2">
      <div class="chat" :class="[chatMsg[index]['role'] === 'user' ? 'chat-end' : 'chat-start']">
        <div class="chat-image avatar">
          <div class="w-14 rounded-full">
            <img
                alt="Failed"
                :src="[chatMsg[index]['role'] === 'user' ? userinfostore.userInfo.avatar : '/aichat/aiAvatar.png']" />
          </div>
        </div>
        <div class="chat-bubble" :class="[chatMsg[index]['role'] === 'user' ? 'bg-blue-700 text-base-100' : 'bg-base-100 text-base-content']">
          {{ chatMsg[index]['message']}}
        </div>
      </div>
    </div>
  </div>
  <div class="textarea textarea-bordered absolute bottom-[0%] flex w-[78%]">
    <textarea
        v-model="textInput"
        id="textArea"
        class="outline-none text-lg w-[1100px] max-h-[210px] resize-none"
        placeholder="请输入你想问的问题">
    </textarea>
    <el-icon :size="33" class="relative bottom-[-10px] ml-4 hover:bg-base-300 cursor-pointer"><Promotion /></el-icon>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive,} from "vue";
import { useRequest } from "vue-hooks-plus";
import { getChatHistoryAPI } from "../../apis";
import { ElNotification } from 'element-plus';
import { useMainStore } from "../../stores";

const userinfostore = useMainStore().userInfoStore();

const textInput = ref<string>("");

const chatMsg = ref([]);

const props = defineProps(['id']);  // 接收父组件传来的会话id

const getChatHistory = () => {
  useRequest(()=>getChatHistoryAPI({id:props.id}),{
    onSuccess(res){
      if(res['code']===200){
        for(let i=0;i<res['data']['chat_history'].length;i++){
          chatMsg.value.push(reactive(res['data']['chat_history'][i]));
        }
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    },
    onError(err){
      ElNotification({title: 'Error', message: err.toString(), type: 'error',})
    }
  })
}

onMounted(()=>{
  getChatHistory();

  const  observe = (element, event, handler) => {
    element.addEventListener(event, handler, false);
  };

  let textArea = document.getElementById('textArea');
  function resize(){
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + 'px';
    if(textArea.scrollHeight >= 210){
      textArea.style.overflow = 'visible';
    }else{
      textArea.style.overflow = 'hidden';
    }
  }
  function delayedResize(){
    setTimeout(()=>{
      resize();
    },0)
  }
  observe(textArea,'change',resize);
  observe(textArea, 'cut',     delayedResize);
  observe(textArea, 'paste',   delayedResize);
  observe(textArea, 'drop',    delayedResize);
  observe(textArea, 'keydown', delayedResize);

  resize();
})
</script>

<style scoped lang="scss">
#chatBox{
  /* 适用于 Firefox */
  scrollbar-width: none;

  /* 适用于 WebKit 浏览器（例如 Chrome, Safari） */
  -webkit-scrollbar {
    width: 12px; /* 设置滚动条的宽度 */
  }

  /* 适用于 IE 和 Edge */
  -ms-overflow-style: -ms-autohiding-scrollbar; /* 隐藏滚动条，但鼠标悬停时显示 */
}
</style>