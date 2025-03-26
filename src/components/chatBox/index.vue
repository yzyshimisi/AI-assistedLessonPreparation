<template>
<div id="container" class="fixed bottom-0" :class="props['isOpenFuncForm'] ? 'ml-[40px]' : 'ml-[100px]'">
  <!-- 聊天框 -->
  <div
      id="chatBox"
      class="h-[82%] bg-base-300 overflow-y-scroll px-5 py-8"
      :class="[props['isOpenFuncForm'] ? 'w-[52vw]' : 'w-[59vw]']"
  >
    <div v-for="(value,index) in chatMsg" class="mb-2">
      <div class="chat" :class="[chatMsg[index]['role'] === 'user' ? 'chat-end' : 'chat-start']">
        <div class="chat-image avatar">
          <div class="w-12 rounded-full">
            <img
                alt="Failed"
                :src="[chatMsg[index]['role'] === 'user' ? userinfostore.userInfo.avatar : '/aichat/aiAvatar.png']" />
          </div>
        </div>
        <div class="chat-bubble" :class="[chatMsg[index]['role'] === 'user' ? 'bg-blue-700 text-base-100' : 'bg-base-100 text-base-content']">
          {{ chatMsg[index]['message'] }}
        </div>
      </div>
    </div>
    <!-- 加载图标-->
    <div v-show="isWaitingRes" class="mt-2 mb-4 gap-1 flex justify-center" :class="[props['isOpenFuncForm'] ? 'w-[900px]' : 'w-[1000px]']">
      <span class="loading loading-dots loading-xs"></span>
      <span class="loading loading-dots loading-sm"></span>
      <span class="loading loading-dots loading-md"></span>
      <span class="loading loading-dots loading-lg"></span>
    </div>
  </div>
  <!-- 输入框 -->
  <div class="textarea textarea-bordered flex mt-4" :class="props['isOpenFuncForm'] ? 'w-[52vw]' : 'w-[59vw]'">
    <textarea
        v-model="textInput"
        @keydown.enter.prevent="enterKeyDown"
        id="textArea"
        class="outline-none text-lg w-[1100px] max-h-[210px] resize-none"
        placeholder="请输入你想问的问题">
    </textarea>
    <el-icon @click="sendMsg" :size="33" class="relative bottom-[-10px] ml-2 hover:bg-base-300 cursor-pointer"><Promotion /></el-icon>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from "vue";
import { useRequest } from "vue-hooks-plus";
import { getChatHistoryAPI, sendMsgAPI } from "../../apis";
import { ElMessage, ElNotification } from 'element-plus';
import { useMainStore } from "../../stores";

const userinfostore = useMainStore().userInfoStore();

const textInput = ref<string>("");    // 文本框

const chatMsg = ref([]);    // 记录
const resMsg = ref<string>('')    // 用于实现打字效果

const isWaitingRes = ref<boolean>(false)

const props = defineProps(['id','isOpenFuncForm','isWaitRes','lessonPlanRes']);  // 接收父组件传来的会话id、是否开启功能表单（开启功能表单，对话框的位置、宽度会有所变化）

watch([()=>props.isWaitRes],()=>{
  if(props.isWaitRes === true){
    isWaitingRes.value = props.isWaitRes
    let chatBox = document.getElementById('chatBox')    // 定位到最底部
    chatBox.scrollTop = chatBox.scrollHeight
  }else{
    isWaitingRes.value = props.isWaitRes
    chatMsg.value.push({
      role: 'ai',
      message: '',
    })
    resMsg.value = props.lessonPlanRes
    print()
  }
})

watch(()=>props.id,()=>{    // 选择不同的会话，获取不同的历史记录
  if(props.id !== -1)
    getChatHistory();
})

const pageInfo = ref<object>({  // 滚动加载（还未实现）
  page_num: 1,
  page_size: 10,
})

const originHeight = ref<number>(0);

const textArea = ref<HTMLElement>()    // 文本框DOM元素
const textAreaOldH = ref<number>()   // 文本框的高度

const windowScrollY = ref<number>(-1);  // 页面滚动条距离顶端的长度
const oldScrollY = ref<number>(-1);

watch(()=>windowScrollY.value,()=>{
  let container = document.getElementById('container')
  let scrollTop = windowScrollY.value <= 145 ?  windowScrollY.value : 145

  container.style.height = (originHeight.value + scrollTop).toString().concat('px')   // 聊天框加上对应的高度

  oldScrollY.value = windowScrollY.value
})

onMounted(()=>{
  // 初始化容器的高度
  originHeight.value = window.innerHeight - 75 - 65 - 4 - 20
  let container = document.getElementById('container')
  container.style.height = originHeight.value.toString().concat('px')   // 初始高度：首图、导航栏、mt-1

  nextTick(()=>{    // 当页面加载好后，处理一次滚动条的事件，避免在滚动条中间刷新页面时，造成的高度错误
    handleScroll()
  })

  getChatHistory();

  window.addEventListener('scroll', handleScroll, true);  // 监听页面的滚动，让聊天框始终占满用户的可视区域

  setTextArea()   // 监听文本框的高度变化
})

const sendMsg = () => {
  if(props.id === -1) return
  if(textInput.value === '' || textInput.value === '\n'){
    textInput.value = ''
    ElMessage({message: '请输入你的问题', type: 'warning',})
    return
  }
  useRequest(()=>sendMsgAPI({
    session_id: props.id,
    message: textInput.value,
  }),{
    onBefore(){
      isWaitingRes.value = true
      chatMsg.value.push({
        role: 'user',
        message: textInput.value,
      })
      nextTick(()=>{
        let chatBox = document.getElementById("chatBox");
        chatBox.scrollTop = chatBox.scrollHeight
      })
    },
    onSuccess(res){
      if(res['code']===200){
        chatMsg.value.push({
          role: 'ai',
          message: '',
        })
        resMsg.value = res['data']['message']
        print()
      }else{
        getChatHistory()
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    },
    onError(err){
      getChatHistory()
      ElNotification({title: 'Error', message: err.toString(), type: 'error',})
    },
    onFinally(){
      isWaitingRes.value = false
    }
  })
  textInput.value = ''
}

const print = () => {   // 通过chatMsg与resMsg实现打字效果
  let chatBox = document.getElementById("chatBox");
  if( chatMsg.value[chatMsg.value.length-1]['message'].length >= resMsg.value.length){
    return
  }
  setTimeout(()=>{
    let flag = false

    if(chatBox.scrollHeight - chatBox.scrollTop - chatBox.clientHeight < 40){
      flag = true
    }
    chatMsg.value[chatMsg.value.length - 1]['message'] += resMsg.value.charAt(chatMsg.value[chatMsg.value.length - 1]['message'].length);
    if(flag){
      chatBox.scrollTop = chatBox.scrollHeight
    }
    print()
  },50)
}

const getChatHistory = () => {
  if(props.id === -1) return
  useRequest(()=>getChatHistoryAPI({
    id:props.id,
    page_num: pageInfo.value['page_num'],
    page_size: pageInfo.value['page_size']
  }),{
    onSuccess(res){
      if(res['code']===200){
        chatMsg.value = []
        if(res['data']['chat_history']){
          for(let i=0; i<res['data']['chat_history'].length; i++){
            chatMsg.value.push(res['data']['chat_history'][i]);
          }
        }
        nextTick(()=>{
          let chatBox = document.getElementById("chatBox");
          chatBox.scrollTop = chatBox.scrollHeight
        })
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    },
    onError(err){
      ElNotification({title: 'Error', message: err.toString(), type: 'error',})
    }
  })
}

const enterKeyDown = (e) => {
  if(e.ctrlKey && e.keyCode==13) {    //用户点击了ctrl+enter触发
    let textarea = document.getElementById('textArea') as HTMLTextAreaElement
    textarea.value += '\n';
  }else {       //用户点击了enter触发
    sendMsg()
  }
}

const setTextArea = () => {
  const observe = (element, event, handler) => {
    element.addEventListener(event, handler, false);
  };

  textArea.value = document.getElementById('textArea')
  nextTick(()=>{
    textAreaOldH.value = Number(textArea.value.style.height.split('px')[0])
  })

  const observer = new MutationObserver((mutationsList) => {    // 监听文本框的变化，改变对话框的高度
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        let chatBox = document.getElementById('chatBox');
        const newHeight = textArea.value.offsetHeight;
        if (newHeight !== textAreaOldH.value) {
          let dH = newHeight - textAreaOldH.value;
          if (chatBox && chatBox.style.height) {
          }
          textAreaOldH.value = newHeight; // 更新初始高度
        }
      }
    }
  });

  observer.observe(textArea.value, {
    attributes: true, // 监听属性变化
  });

  function resize(){  // 监听文本框的高度并进行滚动条的调整，同时修改对话框的高度
    textArea.value.style.height = 'auto';
    textArea.value.style.height = textArea.value.scrollHeight + 'px';
    if(textArea.value.scrollHeight >= 210){
      textArea.value.style.overflow = 'visible';
    }else{
      textArea.value.style.overflow = 'hidden';
    }
  }
  function delayedResize(){
    setTimeout(()=>{
      resize();
    },0)
  }
  observe(textArea.value,'change', resize);
  observe(textArea.value, 'cut', delayedResize);
  observe(textArea.value, 'paste', delayedResize);
  observe(textArea.value, 'drop', delayedResize);
  observe(textArea.value, 'keydown', delayedResize);

  resize();
}

const handleScroll = () => {
  windowScrollY.value = window.scrollY
}
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