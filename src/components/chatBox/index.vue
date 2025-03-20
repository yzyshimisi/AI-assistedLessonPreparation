<template>
<div class="fixed bottom-[20px] mt-5" :class="props['isOpenFuncForm'] ? 'ml-[40px]' : 'ml-[100px]'">
  <div
      id="chatBox"
      class="overflow-auto bg-base-300"
      :class="[props['isOpenFuncForm'] ? 'w-[900px]' : 'w-[1000px]']"
  >
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
          {{ chatMsg[index]['message'] }}
        </div>
      </div>
    </div>
  </div>
  <div class="textarea textarea-bordered  flex w-[1000px] mt-7" :class="props['isOpenFuncForm'] ? 'w-[900px]' : 'w-[1000px]'">
    <textarea
        v-model="textInput"
        id="textArea"
        class="outline-none text-lg w-[1100px] max-h-[210px] resize-none"
        placeholder="请输入你想问的问题">
    </textarea>
    <el-icon :size="33" class="relative bottom-[-10px] ml-2 hover:bg-base-300 cursor-pointer"><Promotion /></el-icon>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch, nextTick,} from "vue";
import { useRequest } from "vue-hooks-plus";
import { getChatHistoryAPI } from "../../apis";
import { ElNotification } from 'element-plus';
import { useMainStore } from "../../stores";

const userinfostore = useMainStore().userInfoStore();

const textInput = ref<string>("");

const chatMsg = ref([]);

const props = defineProps(['id','isOpenFuncForm']);  // 接收父组件传来的会话id、是否开启功能表单

watch(()=>props.id,()=>{
  if(props.id !== -1)
    getChatHistory();
})

const pageInfo = ref<object>({
  page_num: 1,
  page_size: 10,
})


const chatBoxHeight = ref<number>(500)    // 这里的高度是除去文本框的高度，页面的滚动不会影响其值

const originBoxHeight = window.scrollY > 145 ? chatBoxHeight.value + 145 :  chatBoxHeight.value + window.scrollY
// 最原始的对话框高度（考虑到从滚动条中间位置刷新网页）

console.log(originBoxHeight)

const textArea = ref<HTMLElement>()    // 文本框DOM元素
const textAreaOldH = ref<number>()   // 文本框的高度

const windowScrollY = ref<number>(-1);
const oldScrollY = ref<number>(-1);

watch(()=>windowScrollY.value,()=>{

  let chatBox = document.getElementById('chatBox')
  let scrollH = windowScrollY.value <= 145 ?  windowScrollY.value : 145

  chatBox.style.height = (chatBoxHeight.value + scrollH).toString().concat('px')
  oldScrollY.value = windowScrollY.value
})

const getChatHistory = () => {
  if(props.id === -1) return
  useRequest(()=>getChatHistoryAPI({
    id:props.id,
    page_num: pageInfo.value['page_num'],
    page_size: pageInfo.value['page_size']
  }),{
    onSuccess(res){
      if(res['code']===200){
        if(res['data']['chat_history']){
          for(let i=0; i<res['data']['chat_history'].length; i++){
            chatMsg.value.push(reactive(res['data']['chat_history'][i]));
          }
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
  nextTick(()=>{
    handleScroll()
  })

  getChatHistory();

  window.addEventListener('scroll', handleScroll, true);  // 监听页面的滚动

  setTextArea()   // 设置文本框的监听
})

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
          let changedH = newHeight - textAreaOldH.value;
          if (chatBox && chatBox.style.height) {
            chatBoxHeight.value = chatBoxHeight.value - changedH
            chatBox.style.height = `${ Number(chatBox.style.height.split('px')[0]) - changedH }px`;
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