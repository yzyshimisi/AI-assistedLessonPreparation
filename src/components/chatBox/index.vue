<template>
<div id="container" class="fixed bottom-[20px]" :class="props['isOpenFuncForm'] ? 'ml-[40px]' : 'ml-[100px]'">
  <!-- 聊天框 -->
  <div
      id="chatBox"
      class="bg-base-300 overflow-y-scroll mt-4 px-5 py-8"
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
<!--        <div class="chat-bubble bg-base-100">-->
<!--          &lt;!&ndash; 渲染markdown格式 &ndash;&gt;-->
<!--          <div v-html="converter.makeHtml('# text\n## text2')" class="w-full prose" :class="[chatMsg[index]['role'] === 'user' ? 'text-white' : '']"></div>-->
<!--        </div>-->
        <!-- 正常信息 -->
        <div v-if="value['message_type'] <= 8" class="chat-bubble" :class="[chatMsg[index]['role'] === 'user' ? 'bg-blue-700' : 'bg-base-100']">
          <!-- 渲染markdown格式 -->
          <div v-html="converter.makeHtml(chatMsg[index]['message'])" class="w-full prose" :class="[chatMsg[index]['role'] === 'user' ? 'text-white' : '']"></div>
        </div>
        <!-- PPT文件 -->
        <div v-else-if="value['message_type'] === 9" class="chat-bubble bg-base-100 text-base-content">
          <div class="flex flex-col gap-2 max-w-[100px]">
            <img @click="downloadFileByUrl(value['message'].split(',')[1])" src="/myResources/fileIcon/display-ppt.png" class="hover:cursor-pointer hover:bg-slate-100">
            <p>{{ value['message'].split(',')[1].substring(value['message'].split(',')[1].lastIndexOf('/')+1) }}</p>
          </div>
        </div>
        <!-- 图片 -->
        <div v-else-if="value['message_type'] === 10" class="chat-bubble bg-base-100 text-base-content">
          <img :src="value['message']">
        </div>
        <!-- 知识图谱 -->
        <div v-else-if="value['message_type'] === 11" class="chat-bubble bg-base-100 text-base-content w-[670px] h-[530px]">
          <RelationGraph @click="nowShowDetailNodeID=''" :ref="(el) => drawKnowledgeGraph(el,value['message'])" :options="options">
            <template #node="{ node }">
              <div @contextmenu="showNodeDetail(node.id)" class="my-node flex flex-col gap-[40px]">
                <div class="my-node-text w-full text-center truncate">{{ node.text }}</div>
                <div
                    class="my-node-detail"
                    v-if="node.text && nowShowDetailNodeID===node.id"
                >
                  <div @dblclick="" @click.stop>{{ node.text }}</div>
                </div>
              </div>
            </template>
          </RelationGraph>
        </div>
      </div>
      <!-- 教案的导出与修改按钮 -->
      <div v-if="value['message_type']===3" class="w-full flex justify-center gap-8 mt-4 mb-4">
        <button @click="exportLessonPlan(value['id'])" class="btn btn-outline bg-white text-[#1d4ed8] border-blue-500 hover:bg-blue-100 hover:text-[#1d4ed8] hover:border-blue-500 px-8">导出教案</button>
        <button @click="" class="btn btn-outline bg-white text-[#1d4ed8] border-blue-500 hover:bg-blue-100 hover:text-[#1d4ed8] hover:border-blue-500 px-8">修改教案</button>
      </div>
      <!-- 单元教学设计按钮 -->
      <div v-if="value['message_type']===4" class="w-full flex justify-center gap-8 mt-4 mb-4">
        <button @click="" class="btn btn-outline bg-white text-[#1d4ed8] border-blue-500 hover:bg-blue-100 hover:text-[#1d4ed8] hover:border-blue-500 px-8">导出单元教学设计</button>
        <button @click="" class="btn btn-outline bg-white text-[#1d4ed8] border-blue-500 hover:bg-blue-100 hover:text-[#1d4ed8] hover:border-blue-500 px-8">修改单元教学设计</button>
      </div>
      <!-- 跨学科设计按钮 -->
      <div v-if="value['message_type']===5" class="w-full flex justify-center gap-8 mt-4 mb-4">
        <button @click="" class="btn btn-outline bg-white text-[#1d4ed8] border-blue-500 hover:bg-blue-100 hover:text-[#1d4ed8] hover:border-blue-500 px-8">导出跨学科设计</button>
        <button @click="" class="btn btn-outline bg-white text-[#1d4ed8] border-blue-500 hover:bg-blue-100 hover:text-[#1d4ed8] hover:border-blue-500 px-8">修改跨学科设计</button>
      </div>
      <!-- 单元作业设计按钮 -->
      <div v-if="value['message_type']===6" class="w-full flex justify-center gap-8 mt-4 mb-4">
        <button @click="" class="btn btn-outline bg-white text-[#1d4ed8] border-blue-500 hover:bg-blue-100 hover:text-[#1d4ed8] hover:border-blue-500 px-8">导出单元作业</button>
        <button @click="" class="btn btn-outline bg-white text-[#1d4ed8] border-blue-500 hover:bg-blue-100 hover:text-[#1d4ed8] hover:border-blue-500 px-8">修改单元作业</button>
      </div>
      <!-- 说课稿设计按钮 -->
      <div v-if="value['message_type']===7" class="w-full flex justify-center gap-8 mt-4 mb-4">
        <button @click="" class="btn btn-outline bg-white text-[#1d4ed8] border-blue-500 hover:bg-blue-100 hover:text-[#1d4ed8] hover:border-blue-500 px-8">导出说课稿</button>
        <button @click="" class="btn btn-outline bg-white text-[#1d4ed8] border-blue-500 hover:bg-blue-100 hover:text-[#1d4ed8] hover:border-blue-500 px-8">修改说课稿</button>
      </div>
      <!-- PPT大纲的修改与生成PPT按钮 -->
      <div v-if="value['message_type']===8" class="w-full flex justify-center gap-8 mt-4 mb-4">
        <button @click="" class="btn btn-outline bg-white text-[#1d4ed8] border-blue-500 hover:bg-blue-100 hover:text-[#1d4ed8] hover:border-blue-500 px-8">修改大纲</button>
        <button @click="generatePPT" class="btn btn-outline bg-white text-[#1d4ed8] border-blue-500 hover:bg-blue-100 hover:text-[#1d4ed8] hover:border-blue-500 px-8">一键生成PPT</button>
      </div>
      <!-- 知识图谱按钮 -->
      <div v-if="value['message_type']===11" class="w-full flex justify-center gap-8 mt-4 mb-4">
        <button @click="" class="btn btn-outline bg-white text-[#1d4ed8] border-blue-500 hover:bg-blue-100 hover:text-[#1d4ed8] hover:border-blue-500 px-8">导出知识图谱</button>
        <button @click="" class="btn btn-outline bg-white text-[#1d4ed8] border-blue-500 hover:bg-blue-100 hover:text-[#1d4ed8] hover:border-blue-500 px-8">修改知识图谱</button>
      </div>
    </div>
    <!-- 推荐提问 -->
    <div v-if="isShowRecom" class="flex flex-col gap-6 mt-8">
      <div v-for="(value,index) in recommendQues">
        <span @click="sendMsgRec(value)" class="p-2 border-2 bg-base-100 rounded-2xl hover:cursor-pointer hover:bg-base-200">{{ value }}</span>
      </div>
    </div>
    <!-- 加载图标-->
    <div v-show="isWaitingRes" class="mt-6 mb-2 gap-1 flex justify-center" :class="[props['isOpenFuncForm'] ? 'w-[900px]' : 'w-[1000px]']">
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
import { ref, onMounted, watch, nextTick, } from "vue";
import { useRequest } from "vue-hooks-plus";
import {
  exportLessonPlanAPI,
  getChatHistoryAPI,
  sendMsgAPI,
  getLessonPlanInfoAPI,
  modifyLessonPlanAPI,
  getLessonPreGraphAPI,
  generatePPTAPI,
} from "../../apis";
import { ElMessage, ElNotification } from 'element-plus';
import { useMainStore } from "../../stores";
import * as showdown from "showdown"
import RelationGraph from 'relation-graph-vue3'

const options = {
  "backgroundImage": "",
  "backgroundImageNoRepeat": true,
  "allowAutoLayoutIfSupport": false,
  "allowShowDownloadButton": false,
  "defaultExpandHolderPosition": "right",
  "defaultLineWidth": 5,
  "layouts": [
    {
      "label": "中心",
      "layoutName": "center",
      "centerOffset_x": 0,
      "centerOffset_y": 0,
      "distance_coefficient": 1
    }
  ]
}

// const jsonData = {
//   rootId: 'a',
//   nodes: [
//     { id: 'a', text: 'a', },
//     { id: 'b', text: 'b', },
//     { id: 'c', text: 'c', },
//     { id: 'd', text: 'd', },
//     { id: 'e', text: 'e', },
//     { id: 'f', text: 'f', },
//   ],
//   lines: [
//     { from: 'a', to: 'b', },
//     { from: 'a', to: 'c', },
//     { from: 'a', to: 'd', },
//     { from: 'a', to: 'e', },
//     { from: 'a', to: 'f', },
//   ],
// }

const varemit = defineEmits(["endGetKnowledgeGraph"])

const converter = new showdown.Converter({
  parseImgDimensions: true,
  simplifiedAutoLink: true,
  excludeTrailingPunctuationFromURLs: true,
  tables: true,
  ghCodeBlocks: true
})  // 将markdown转为html
converter.setOption("tables",true);

const userinfostore = useMainStore().userInfoStore();

const textInput = ref<string>("");    // 文本框

const chatMsg = ref([]);    // 记录

const isAllowDrawGraph = ref<boolean>(true)   // 判断是否允许画图（防止打字效果时，知识图谱重复渲染）

const isWaitingRes = ref<boolean>(false)    // 当前是否正在等待响应（显示加载图标）

watch(()=>isWaitingRes.value,()=>{
  if(isWaitingRes.value === true){
    isShowRecom.value = false;
  }
})

const props = defineProps(['id','isOpenFuncForm','isWaitRes','quickFuncReq','quickFuncRes','knowledgeGraphRes']);  // 接收父组件传来的会话id、是否开启功能表单（开启功能表单，对话框的位置、宽度会有所变化）

watch([()=>props.isWaitRes],()=>{   // 快速功能的结果
  if(props.isWaitRes === true){
    isWaitingRes.value = props.isWaitRes
    chatMsg.value.push({
      role: 'user',
      message: props.quickFuncReq,
      message_type: 1
    })
    nextTick(()=>{
      let chatBox = document.getElementById("chatBox");  // 定位到最底部
      chatBox.scrollTop = chatBox.scrollHeight
    })
  }else{
    isWaitingRes.value = props.isWaitRes
    if(props.quickFuncRes){   // 其他的快速功能回答内容
      if(props.quickFuncRes.startsWith("https://")){  // 图片等链接，就不进行打字效果了
        getChatHistory();   // 直接重新获取一下记录
        isAllowDrawGraph.value = true
        return
      }else{  // 文本信息显示
        chatMsg.value.push({
          role: 'ai',
          message: '',
          message_type: '3',
        })
        print({message: props.quickFuncRes})
      }
    }else{   // 知识图谱
      isAllowDrawGraph.value = true
      chatMsg.value.push({'role':'ai', 'message_type':11, 'message':JSON.stringify(props.knowledgeGraphRes)})
      nextTick(()=>{
        let chatBox = document.getElementById("chatBox");  // 定位到最底部
        chatBox.scrollTop = chatBox.scrollHeight
      })
    }
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

const originHeight = ref<number>(0);    // chatBox的高度（不考虑滚动条，考虑文本输入框）

const textArea = ref<HTMLElement>()    // 文本框DOM元素
const textAreaOldH = ref<number>(-1);

const windowScrollY = ref<number>(-1);  // 页面滚动条距离顶端的长度
const oldScrollY = ref<number>(-1);

const recommendQues = ref<Array<string>>([])
const isShowRecom = ref<boolean>(false)   // 希望在打字效果后显示

watch(()=>windowScrollY.value,()=>{
  let chatBox = document.getElementById('chatBox')
  let scrollTop = windowScrollY.value <= 145 ?  windowScrollY.value : 145

  chatBox.style.height = (originHeight.value + scrollTop).toString().concat('px')   // 聊天框加上对应的高度

  oldScrollY.value = windowScrollY.value
})

// watch(()=>props.getKnowledgeGraph,async ()=>{
//   if(props.getKnowledgeGraph && !isWaitingRes.value){
//     chatMsg.value.push({'role':"user", 'message':'查看备课知识图谱', 'message_type':'1'})
//     isWaitingRes.value = true
//     await nextTick(()=>{
//       let chatBox = document.getElementById("chatBox");  // 定位到最底部
//       chatBox.scrollTop = chatBox.scrollHeight
//     })
//     await sleep(1000)
//     chatMsg.value.push({'role':"ai", 'message':'正在生成备课知识图谱...', 'message_type':'1'})
//     await nextTick(()=>{
//       let chatBox = document.getElementById("chatBox");  // 定位到最底部
//       chatBox.scrollTop = chatBox.scrollHeight
//     })
//     getLessonPreGraph()
//   }else{
//     varemit('endGetKnowledgeGraph')
//   }
// })

onMounted(()=>{
  // 初始化聊天框的高度
  originHeight.value = window.innerHeight - 75 - 65 - 4 - 20 - 110
  let chatBox = document.getElementById('chatBox')
  chatBox.style.height = originHeight.value.toString().concat('px')   // 初始高度：首图、导航栏、mt-1

  nextTick(()=>{    // 当页面加载好后，处理一次滚动条的事件，避免在滚动条中间刷新页面时，造成的高度错误
    handleScroll()
    textAreaOldH.value = document.getElementById('textArea').offsetHeight
  })

  getChatHistory();

  window.addEventListener('scroll', handleScroll, true);  // 监听页面的滚动，让聊天框始终占满用户的可视区域

  setTextArea()   // 监听文本框的高度变化
})

const sendMsg = () => {     // 发送信息
  if(isWaitingRes.value ===true){
    ElMessage({message: '当前正在等待回答！', type: 'warning',})
    return
  }
  if(props.id === -1) return  // 未选择会话
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
      isShowRecom.value = false
      chatMsg.value.push({
        role: 'user',
        message: textInput.value,
        message_type: 1
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
          message_type: 2
        })
        print(res['data'])
        recommendQues.value = []
        recommendQues.value.push(res['data']['follow_1'])
        recommendQues.value.push(res['data']['follow_2'])
        recommendQues.value.push(res['data']['follow_3'])
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

const print = (data) => {   // 实现打字效果
  let chatBox = document.getElementById("chatBox");
  if( chatMsg.value[chatMsg.value.length-1]['message'].length >= data['message'].length){
    getChatHistory();   // 打字打完后，重新获取一下记录
    if(data['follow_1']) isShowRecom.value = true
    return
  }
  setTimeout(()=>{
    let flag = false

    if(chatBox.scrollHeight - chatBox.scrollTop - chatBox.clientHeight < 80){   // 保持聊天框在滚动条最底部
      flag = true
    }
    chatMsg.value[chatMsg.value.length-1]['message'] += data['message'].charAt(chatMsg.value[chatMsg.value.length-1]['message'].length);
    if(flag){
      chatBox.scrollTop = chatBox.scrollHeight
    }
    print(data)
  },50)
}

const getChatHistory = () => {    // 获取会话记录
  if(props.id === -1) return
  useRequest(()=>getChatHistoryAPI({
    id:props.id,
    page_num: pageInfo.value['page_num'],
    page_size: pageInfo.value['page_size']
  }),{
    onSuccess(res){
      if(res['code']===200){
        isAllowDrawGraph.value = true

        chatMsg.value = []
        if(res['data']['chat_history']){
          for(let i=0; i<res['data']['chat_history'].length; i++){
            res['data']['chat_history'][i]['message_type']
            chatMsg.value.push(res['data']['chat_history'][i]);
          }
        }
        console.log(chatMsg.value)
        nextTick(()=>{    // 定位到聊天框最底部
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

const enterKeyDown = (e) => {     // 文本框的换行与发送
  if(e.ctrlKey && e.keyCode==13) {    //用户点击了ctrl+enter触发
    let textarea = document.getElementById('textArea') as HTMLTextAreaElement
    textarea.value += '\n';
  }else {     //用户点击了enter触发
    sendMsg()
  }
}

const setTextArea = () => {   // 设置文本区域
  const observe = (element, event, handler) => {
    element.addEventListener(event, handler, false);
  };

  textArea.value = document.getElementById('textArea')

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

  // 监听高度变化，并更改聊天框的高度
  let mutationObserver = new MutationObserver(function (mutations) {
    let height = Number(window.getComputedStyle(textArea.value).getPropertyValue('height').split('px')[0]);
    if (height !== textAreaOldH.value) {
      let dH = textAreaOldH.value - height

      let chatBox = document.getElementById('chatBox')
      chatBox.style.height = (chatBox.offsetHeight + dH).toString().concat('px')  // 实时修改

      originHeight.value = originHeight.value + dH    // 适配滚动条

      textAreaOldH.value = height
    }
  })

  mutationObserver.observe(textArea.value, {
    childList: true, // 子节点的变动（新增、删除或者更改）
    attributes: true, // 属性的变动
    characterData: true, // 节点内容或节点文本的变动
    subtree: true // 是否将观察器应用于该节点的所有后代节点
  })
}

const handleScroll = () => {
  windowScrollY.value = window.scrollY
}

const exportLessonPlan = (id) => {    // 导出教案
  useRequest(()=>exportLessonPlanAPI(localStorage.getItem('token'),{message_id:id}),{
    onSuccess(res){
      if(res['code']===200){
        downloadFileByUrl(res['data']['url'])
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })
}

const generatePPT = () => {
  isWaitingRes.value = true
  nextTick(()=>{
    let chatBox = document.getElementById("chatBox");  // 定位到最底部
    chatBox.scrollTop = chatBox.scrollHeight
  })
  useRequest(()=>generatePPTAPI(localStorage.getItem('token'),{session_id:props.id}),{
    onSuccess(res){
      if(res['code']===200){
        chatMsg.value.push({'user':'ai', 'message_type':5, 'message':res['data']['message']})
        getChatHistory()
        nextTick(()=>{
          let chatBox = document.getElementById("chatBox");  // 定位到最底部
          chatBox.scrollTop = chatBox.scrollHeight
        })
      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    },
    onFinally(){
      isWaitingRes.value = false
    }
  })
}

const downloadFileByUrl = (url:string) => {
  let fileUrl =  url
  let fileName = fileUrl.substring( fileUrl.lastIndexOf("/")+1 );

  const link = document.createElement('a');
  link.download = fileName;  // 指定下载文件的名称
  link.href = fileUrl;
  link.target = "_blank"
  link.style.display = "none"          // 这个元素不用呈现在页面上，隐藏掉。

  document.body.appendChild( link );
  link.click();

  document.body.removeChild( link );   // 防止多次下载
}

const getLessonPlanInfo = (id) => {
  useRequest(()=>getLessonPlanInfoAPI(localStorage.getItem('token'),{message_id:id}),{
    onSuccess(res){
      if(res['code']===200){

      }else{
        ElNotification({title: 'Warning', message: res['msg'], type: 'warning',})
      }
    }
  })
}

const sendMsgRec = (text) => {
  textInput.value = text
  sendMsg()
}

// const getLessonPreGraph = () => {   // 获取备课资料的知识图谱
//   useRequest(()=>getLessonPreGraphAPI(localStorage.getItem('token')),{
//     onSuccess(res){
//       if(res['code']===200){
//         chatMsg.value.push({'role':'ai', 'message_type':10})
//         nodes.value = res['data']['nodes']
//         relationships.value = res['data']['relationships']
//         isWaitingRes.value = false
//         drawKnowledgeGraph()
//         nextTick(()=>{
//           let chatBox = document.getElementById("chatBox");  // 定位到最底部
//           chatBox.scrollTop = chatBox.scrollHeight
//         })
//       }else{
//         ElNotification({title: 'Warning', message: res['msg'], type: 'warning',});
//       }
//     },
//     onFinally(){
//       varemit('endGetKnowledgeGraph')
//     }
//   })
// }

const drawKnowledgeGraph = async (ref,data) => {
  if(!isAllowDrawGraph.value) return
  let graphJson = JSON.parse(data)    // 获取到的知识图谱数据
  let nodes = graphJson['nodes']
  let relationships = graphJson['relationships']

  let jsonData: knowledgeGraphType = {    // 作图需要的数据格式
    nodes: [],
    lines: [],
  }
  let processNode = []
  let lines = []

  for(let i=0; i<nodes.length; i++){    // 提取节点信息
    let o = {}
    o['id'] = nodes[i]['element_id']

    if(nodes[i]['labels'][0] === 'Document')    // 根节点
    {
      o['text'] = nodes[i]['properties']['fileName']
      o['width'] = 150
      o['height'] = 150
    }
    else if(nodes[i]['labels'][0] === 'Chunk')
    {
      o['text'] = nodes[i]['properties']['text']
      o['nodeShape'] = '1'
      o['width'] = 150
      o['height'] = 100
    }
    else if(nodes[i]['labels'][0] === "__Entity__")
    {
      o['text'] = nodes[i]['properties']['id']
    }else{
      console.log(nodes[i])
    }

    processNode.push(o)
  }
  for(let i=0; i<relationships.length; i++){
    let o = {}
    o['from'] = relationships[i]['start_node_element_id']
    o['to'] = relationships[i]['end_node_element_id']
    o['lineShape'] = 3
    lines.push(o)
  }
  jsonData['nodes'] = processNode
  jsonData['lines'] = lines

  await nextTick()
  ref.setJsonData(jsonData)

  isAllowDrawGraph.value = false
}

const nowShowDetailNodeID = ref<string>('')   // 右键显示节点详细信息

const showNodeDetail = (id) => {
  nowShowDetailNodeID.value = id
}

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
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

.my-node {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  .my-node-detail {
    display: block;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: -50%;
    width: 250px;
    height: auto;
    min-height: 60px;
    line-height: 30px;
    background: #fff;
    padding: 10px 0;
    border: 3px solid #f90;
    color: #000;
    z-index: 1;
    font-size: 18px;
    user-select: all;
  }
}
</style>