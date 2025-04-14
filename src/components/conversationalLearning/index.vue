<template>
<dialog id="conversationalLearningDia" class="modal">
  <div class="modal-box max-w-[1000px] w-full">
    <form method="dialog">
      <button @click="varemit('endPreview')" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <!-- 卡片 -->
    <div v-show="countdown>0" class="relative w-[330px] border-2 border-purple-900 rounded-lg p-4 flex flex-col items-center font-bold">
      <div class="avatar">
        <div class="ring-purple-950 ring-offset-base-100 w-24 rounded-full ring ring-offset-2">
          <img src="/conversationalLearning/林则徐.png"/>
        </div>
      </div>
      <div class="absolute right-4 w-[50px] h-[50px] bg-[#65558f] text-4xl flex justify-center items-center text-white">{{ countdown.toString().padStart(2, '0') }}</div>
      <div>
        <p class="mt-6">本局您的角色是：林则徐</p>
        <p class="text-xl">角色背景：</p>
        <p class="text-sm w-[250px]">19世纪初，清朝封建统治逐渐衰落，西方殖民势力悄然入侵。英国为扭转对华贸易逆差，向中国大量走私鸦片。鸦片泛滥，致白银外流、国库空虚、军队颓废、民生凋敝，社会危机四伏。林则徐临危受命，力主禁烟，在广州采取严厉措施查禁鸦片，引发与英国的激烈冲突，最终导致鸦片战争爆发，中国近代史由此开端。</p>
        <p class="text-3xl">开启对话吧！</p>
      </div>
    </div>
    <!-- 剧本 -->
    <div v-show="countdown<=0" class="w-full h-[80vh] bg-white mt-4 p-4">
      <div class="relative flex items-center">
        <p class="text-3xl text-purple-950">对话学习</p>
        <progress class="progress text-purple-800 w-64 h-[15px] absolute right-0" :value="step" :max="script.length"></progress>
      </div>
      <div class="w-full h-[85%] bg-[#f3f1ff] mt-4 rounded-lg p-8">
        <p class="text-center text-purple-900 text-lg">{{ scene }}</p>
        <!-- 聊天框 -->
        <div id="chatBox" class="relative w-full h-full overflow-y-scroll">
          <div v-for="(value,index) in chatMsg" class="chat mt-4" :class="value['role']==='林则徐' ? 'chat-end' : 'chat-start'">
            <div v-if="value['role']!=='summarize'" class="chat-image avatar flex flex-col gap-2">
              <div class="w-16 rounded-xl">
                <img
                    @click="getRoleInfo(value['role'])"
                    alt="Tailwind CSS chat bubble component"
                    :src="'/conversationalLearning/'.concat(value['role']).concat('.png')"

                    class="hover:cursor-pointer"
                />
              </div>
              <p v-show="value['role'] !== '林则徐'" class="text-center text-sm font-bold">{{ value['role'] }}</p>
            </div>
            <!-- 总结信息 -->
            <div v-if="value['role']!=='summarize'" class="chat-bubble bg-white text-black">{{ value['message'] }}</div>
            <div v-else class="bg-white text-black p-8">
              {{ value['message'] }}
            </div>
          </div>
          <!-- 下一个场景按钮 -->
          <div v-show="isShowNextButton" class="mt-4 mb-2 flex justify-center"><button @click="nextScene" class="btn bg-[#65558f] text-white hover:bg-purple-900 px-8">下一个场景</button></div>
          <!-- 加载图标 -->
          <div v-show="isLoadingMsg" class="mt-4 mb-2 flex w-full gap-2 justify-center">
            <span class="loading loading-dots loading-xs"></span>
            <span class="loading loading-dots loading-sm"></span>
            <span class="loading loading-dots loading-md"></span>
            <span class="loading loading-dots loading-lg"></span>
          </div>
          <!-- 用户选择按钮 -->
          <div v-show="isShowChoiceButton" class="mt-4 mb-2 flex gap-4 justify-center">
            <button @click="isShowChoiceButton=false" class="btn bg-[#65558f] text-white hover:bg-purple-900 px-8">A.强硬逼迫上交鸦片</button>
            <button onclick="choiceTipDia.showModal()" class="btn bg-[#65558f] text-white hover:bg-purple-900 px-8">B.算了，不管了</button>
          </div>
        </div>
      </div>
      <!-- 输入框 -->
      <div class="w-full bg-[#f3f1ff] h-[70px] flex justify-center mb-8">
        <div class="textarea textarea-bordered flex w-[95%] ">
            <textarea
                v-model="textInput"
                @keydown.enter.prevent="enterKeyDown"
                id="textArea"
                class="outline-none text-lg w-full resize-none"
                placeholder="请发言"
                :disabled="!isAllowedSend"
            >
            </textarea>
          <el-icon @click="sendMsg" :size="33" class="relative bottom-[-10px] ml-2 hover:bg-base-300 cursor-pointer"><Promotion /></el-icon>
        </div>
      </div>
    </div>
  </div>
  <!-- 人物信息 -->
  <dialog id="roleInfoDia" class="modal">
    <div class="modal-box max-w-[300px] w-full">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <div class="mt-4 flex flex-col gap-4 justify-center border-2 border-purple-950 rounded-lg p-4 px-8">
        <div class="avatar flex justify-center">
          <div class="w-40 rounded-xl">
            <img v-if="showRoleInfo" :src="'/conversationalLearning/'.concat(showRoleInfo['role']).concat('.png')" />
          </div>
        </div>
        <div class="flex flex-col">
          <p><span class="font-bold">角色名：</span>{{ showRoleInfo ? showRoleInfo['role'] : '' }}</p>
          <p><span class="font-bold">角色背景：</span>{{ showRoleInfo ? showRoleInfo['background'] : '' }}</p>
        </div>
      </div>
    </div>
  </dialog>
  <!-- 用户选择提示 -->
  <dialog id="choiceTipDia" class="modal">
    <div class="modal-box max-w-[250px] w-full">
      <h3 class="text-lg font-bold">选择提示：请重新选择</h3>
      <div class="modal-action">
        <form method="dialog">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn btn-sm bg-[#65558f] text-white hover:bg-purple-900 px-8">确定</button>
        </form>
      </div>
    </div>
  </dialog>
  <!-- 知识要点 -->
  <dialog id="pointsOfKnowledgeDia" class="modal">
    <div class="modal-box max-w-[420px] w-full">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <div class="mt-4 flex flex-col gap-4">
        <p class="text-xl font-bold">知识要点：</p>
        <div v-for="(value,index) in pointsKnowledge">
          <p><span>{{ value['info'] }}</span>{{ value['message'] }}</p>
        </div>
      </div>
    </div>
  </dialog>
</dialog>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch, watchEffect } from "vue";
import { chatBox } from "../index";
import { ElMessageBox } from 'element-plus'

const textInput = ref<string>('')
const inputRes = ref<string>('')

// 角色信息
const roleInfo = [
    {role:'林则徐',background:'清朝钦差大臣，坚决主张禁烟。'},
    {role:'道光帝',background:'清朝皇帝，对鸦片问题和战争持谨慎态度。'},
    {role:'琦善',background:'清朝官员，与英国交涉，主张妥协。'},
    {role:'义律',background:'英国全权代表，推动鸦片贸易和战争。'},
    {role:'百姓甲',background:'普通百姓，深受鸦片之害。'},
    {role:'百姓乙',background:'商人，对鸦片贸易有一定看法。'},
]

const showRoleInfo = ref<object>({})

// 知识要点
const pointsKnowledge = [
  {info:'战争背景：', message:'19世纪初，英国为扭转对华贸易逆差，向中国大量走私鸦片。鸦片泛滥导致中国白银外流、社会动荡。'},
  {info:'禁烟运动：', message:'林则徐受命禁烟，采取严厉措施，包括查禁鸦片、整顿海防等。'},
  {info:'战争过程：', message:'英国以保护鸦片贸易为名，发动战争。清政府内部意见分歧，林则徐主张坚决抵抗，琦善等主张妥协。'},
  {info:'战争结果：', message:'清政府战败，签订《南京条约》，割让香港岛，赔款2100万银元，开放五口通商。'},
  {info:'影响：', message:'鸦片战争使中国开始沦为半殖民地半封建社会，是中国近代史的开端。战争暴露了清政府的腐败无能，也促使中国人民开始觉醒，探索救国救民的道路。'},
]

const getRoleInfo = (role) => {
  for(let i=0; i<roleInfo.length; i++){
    if(roleInfo[i]['role'] === role){
      showRoleInfo.value = roleInfo[i]
      break
    }
  }
  roleInfoDia.showModal()
}

// 剧本
const script = ref<Array<{scene:string, role:string, msg_type?:string, msg:string}>>([
  { scene:'场景一：朝堂议事', role:'道光帝', msg:'诸位爱卿，这鸦片之害，已至膏肓！民间白银外流，库银空虚，军队军心涣散，朕夜不能寐啊！林则徐，你有何良策？' },
  { scene:'场景一：朝堂议事', role:'琦善', msg:'皇上，林大人之策虽好，但若断了洋人财路，恐引得他们狗急跳墙。这战争一起，我大清可有十足把握稳操胜券？'},
  { scene:'场景一：朝堂议事', role:'道光帝', msg:'琦善所虑，亦有道理。林卿，你到广州后，务必先礼后兵，能以抚代剿，自是上上之策。'},

  { scene:'场景二：市井民声', role:'百姓甲', msg:'这鸦片，真是害人不浅啊！我那儿子，原本身强力壮，如今染上烟瘾，身子骨一天不如一天，家里积蓄也快被他败光了！'},
  { scene:'场景二：市井民声', role:'百姓乙', msg:'是啊！这洋人为了赚钱，不顾我们死活，把这害人的东西往我们这儿运。我那店铺，也快撑不下去了，客人都被这鸦片给祸害得没了！'},
  { scene:'场景二：市井民声', role:'百姓甲', msg:'听说朝廷要派林大人来禁烟，也不知道能不能成。这林大人，是不是真有办法啊？'},
  { scene:'场景二：市井民声', role:'百姓乙', msg:'林大人素来是个清官，听说他到广州后，就严查烟贩，已经抓了不少人。说不定真能有所作为。'},

  { scene:'场景三：广州交涉', role:'林则徐', msg:'义律，你等在粤贩卖鸦片，毒害我百姓，掠我财富，天理难容！今日本大人奉旨前来，限你等三日内，将所有鸦片尽数缴出，否则休怪我大清不客气！'},
  { scene:'场景三：广州交涉', role:'义律', msg:'林大人，这鸦片贸易，乃我国合法买卖，且为贵国百姓自愿购买，何来毒害之说？我大英帝国，乃文明之邦，绝不会做此等不道德之事！你难道还想让我交出鸦片？'},
  { scene:'场景三：广州交涉', role:'林则徐',msg:'放肆！你们以牟利为目的，不顾我百姓死活，这鸦片已使我大清民生凋敝，你等还执迷不悟！若再不缴烟，我便封港，断你等贸易，驱逐尔等出境！'},

  { scene:'场景四：再次朝堂议事', role:'琦善',msg:'皇上，不好了！义律拒不缴烟，还叫嚣要与我大清开战！这林则徐，也太刚愎自用了，竟将局面闹得如此僵！'},
  { scene:'场景四：再次朝堂议事', role:'道光帝',msg:'什么？林卿怎可如此鲁莽！他难道不知，我大清如今国力衰弱，难以承受一场大战吗？'},
  { scene:'场景四：再次朝堂议事', role:'林则徐',msg:'皇上，义律实乃无耻之徒！若不严惩，我大清将永无宁日！且微臣已做好充分准备，若其敢开战，我定叫他有来无回！'},

  { scene:'场景五：战争爆发', role:'义律',msg:'林则徐，你已无退路！我国舰队已至，今日便是你大清的末日！'},

  { scene:'场景六：条约签订', role:'琦善',msg:'义律，皇上已答应你们的条件，割让香港岛，赔款2100万银元，开放广州、厦门、福州、宁波、上海五处为通商口岸。希望你们能信守承诺，不再滋事。'},
  { scene:'场景六：条约签订', role:'义律',msg:'琦善大人，你们大清这次输得彻底！这都是你们自不量力，惹怒了我们大英帝国！希望你们以后能学聪明点，不要轻易挑战我们的权威！'},
])

const isAllowedSend = ref<boolean>(false)

const props = defineProps(['startPreview'])
const varemit = defineEmits(['endPreview'])

watch(()=>props.startPreview,async ()=>{
  if(!props.startPreview) return

  chatMsg.value = []    // 防止上一次的数据对这次的影响

  countdown.value = 5

  let countInterval = setInterval(()=>{
    countdown.value--;
    if(countdown.value <= 0){
      clearInterval(countInterval);
    }
  },1000)
  await wait(5500);

  isLoadingMsg.value = true
  await posToBottom()
  await wait(2000)
  isLoadingMsg.value = false

  chatMsg.value.push({role:script.value[step.value]['role'], message:''})   // 道光帝
  await print(script.value[step.value]['msg'])

  isAllowedSend.value = true
  await waitForInputRes()   // 林则徐（等待用户输入）
  isAllowedSend.value = false

  isLoadingMsg.value = true
  await wait(2000)    // 林则徐（用户）停两秒、其他剧情停一秒
  isLoadingMsg.value = false

  chatMsg.value.push({role:script.value[step.value]['role'],message:''})    // 琦善
  await posToBottom()
  await print(script.value[step.value]['msg'])

  step.value++
  isLoadingMsg.value = true
  await posToBottom()
  await wait(1000)
  isLoadingMsg.value = false

  chatMsg.value.push({role:script.value[step.value]['role'],message:''})  // 道光帝
  await posToBottom()
  await print(script.value[step.value]['msg'])

  step.value++
  isShowNextButton.value = true   // 切换场景=============================================
  await posToBottom()
  await waitForNextScene()

  // 场景二 ===================================================================================

  chatMsg.value = []

  isLoadingMsg.value = true
  await posToBottom()
  await wait(1000)
  isLoadingMsg.value = false

  chatMsg.value.push({role:script.value[step.value]['role'],message:''})    // 百姓甲
  await posToBottom()
  await print(script.value[step.value]['msg'])

  step.value++
  isLoadingMsg.value = true
  await posToBottom()
  await wait(1000)
  isLoadingMsg.value = false

  chatMsg.value.push({role:script.value[step.value]['role'],message:''})    // 百姓乙
  await posToBottom()
  await print(script.value[step.value]['msg'])

  step.value++
  isLoadingMsg.value = true
  await posToBottom()
  await wait(1000)
  isLoadingMsg.value = false

  chatMsg.value.push({role:script.value[step.value]['role'],message:''})    // 百姓甲
  await posToBottom()
  await print(script.value[step.value]['msg'])

  step.value++
  isLoadingMsg.value = true
  await posToBottom()
  await wait(1000)
  isLoadingMsg.value = false

  chatMsg.value.push({role:script.value[step.value]['role'],message:''})    // 百姓乙
  await posToBottom()
  await print(script.value[step.value]['msg'])

  step.value++
  isShowNextButton.value = true   // 切换场景=============================================
  await posToBottom()
  await waitForNextScene()

  // 场景三 =============================================================================

  chatMsg.value = []

  isLoadingMsg.value = true
  await posToBottom()
  await wait(1000)
  isLoadingMsg.value = false

  chatMsg.value.push({role:script.value[step.value]['role'],message:''})    // 林则徐
  await posToBottom()
  await print(script.value[step.value]['msg'])

  step.value++
  isLoadingMsg.value = true
  await posToBottom()
  await wait(1000)
  isLoadingMsg.value = false

  chatMsg.value.push({role:script.value[step.value]['role'],message:''})    // 义律
  await posToBottom()
  await print(script.value[step.value]['msg'])

  isShowChoiceButton.value = true
  await waitForChoose()   // 用户选择按钮

  step.value++
  isLoadingMsg.value = true
  await posToBottom()
  await wait(1000)
  isLoadingMsg.value = false

  chatMsg.value.push({role:script.value[step.value]['role'],message:''})    // 林则徐
  await posToBottom()
  await print(script.value[step.value]['msg'])

  step.value++
  isShowNextButton.value = true   // 切换场景=============================================
  await posToBottom()
  await waitForNextScene()

  // 场景四 =============================================================================

  chatMsg.value = []

  isLoadingMsg.value = true
  await posToBottom()
  await wait(1000)
  isLoadingMsg.value = false

  chatMsg.value.push({role:script.value[step.value]['role'],message:''})    // 琦善
  await posToBottom()
  await print(script.value[step.value]['msg'])

  step.value++
  isLoadingMsg.value = true
  await posToBottom()
  await wait(1000)
  isLoadingMsg.value = false

  chatMsg.value.push({role:script.value[step.value]['role'],message:''})    // 道光帝
  await posToBottom()
  await print(script.value[step.value]['msg'])

  step.value++
  isLoadingMsg.value = true
  await posToBottom()
  await wait(2000)
  isLoadingMsg.value = false

  chatMsg.value.push({role:script.value[step.value]['role'],message:''})    // 林则徐
  await posToBottom()
  await print(script.value[step.value]['msg'])

  step.value++
  isShowNextButton.value = true   // 切换场景=============================================
  await posToBottom()
  await waitForNextScene()

  // 场景五 =============================================================================

  chatMsg.value = []

  isLoadingMsg.value = true
  await posToBottom()
  await wait(1000)
  isLoadingMsg.value = false

  chatMsg.value.push({role:script.value[step.value]['role'],message:''})    // 义律
  await posToBottom()
  await print(script.value[step.value]['msg'])

  step.value++
  isLoadingMsg.value = true
  await posToBottom()
  await wait(1000)
  isLoadingMsg.value = false

  isShowNextButton.value = true   // 切换场景=============================================
  await posToBottom()
  await waitForNextScene()

  // 场景六 =============================================================================

  chatMsg.value = []

  isLoadingMsg.value = true
  await posToBottom()
  await wait(1000)
  isLoadingMsg.value = false

  chatMsg.value.push({role:script.value[step.value]['role'],message:''})    // 琦善
  await posToBottom()
  await print(script.value[step.value]['msg'])

  step.value++
  isLoadingMsg.value = true
  await posToBottom()
  await wait(1000)
  isLoadingMsg.value = false

  chatMsg.value.push({role:script.value[step.value]['role'],message:''})    // 义律
  await posToBottom()
  await print(script.value[step.value]['msg'])

  step.value++
  isLoadingMsg.value = true
  await posToBottom()
  await wait(1000)
  isLoadingMsg.value = false

  chatMsg.value.push({role:'summarize',message:''})
  await posToBottom()
  await print(summarize)

  isLoadingMsg.value = true
  await posToBottom()
  await wait(3000)
  isLoadingMsg.value = false

  pointsOfKnowledgeDia.showModal()    // 总结对话框卡片
})

const countdown = ref<number>(-1) // 提示卡片的倒计时

const scene = ref<string>('')   // 当前场景
const chatMsg = ref<Array<object>>([])

const step = ref<number>(0);  // 当前剧情

const isLoadingMsg = ref<boolean>(false)
const isShowNextButton = ref<boolean>(false)
const isShowChoiceButton = ref<boolean>(false)
const isShowSummarize = ref<boolean>(true)

const summarize = '清朝在面对鸦片问题和外来侵略时，内部存在分歧，且对世界形势缺乏清晰认知。林则徐虽有禁烟决心，但其手段和策略，也引发了战争。这场战争，暴露了清朝的衰弱，也开启了中国近代史的屈辱篇章。'

onMounted(()=>{
  scene.value = script.value[step.value]['scene']
})

const nextScene = () => {
  scene.value = script.value[step.value]['scene']
  isShowNextButton.value = false
}

const waitForInputRes = async () => {       // 等待用户的第一个输入
  await new Promise((resolve) => {
    const stop = watchEffect(async () => {
      if (inputRes.value.length > 0) {
        if (inputRes.value.includes('烟')) {
          step.value++
          stop()
          resolve()
        } else {
          isLoadingMsg.value = true
          await wait(2000)
          isLoadingMsg.value = false

          inputRes.value = ''
          isAllowedSend.value = false
          chatMsg.value.push({role: '道光帝', message: ''})
          await print('林卿，朕问的是关于鸦片之策。你所言之事虽也有道理，但如今鸦片横行，若不解决此问题，其他举措也难见成效。你再仔细思量思量，可有针对鸦片的具体办法？')
          isAllowedSend.value = true
        }
      }
    })
  })
}

const waitForNextScene = async () => {       // 等待用户切换场景
  await new Promise((resolve) => {
    const stop = watchEffect(async () => {
      if (!isShowNextButton.value) {
        stop()
        resolve()
      }
    })
  })
}

const waitForChoose = async () => {       // 等待用户选择
  await new Promise((resolve) => {
    const stop = watchEffect(async () => {
      if (!isShowChoiceButton.value) {
        stop()
        resolve()
      }
    })
  })
}

const print = (data) => {   // 实现打字效果
  return new Promise((resolve) => {
    let chatBox = document.getElementById("chatBox");
    let currentLength = chatMsg.value[chatMsg.value.length-1]['message'].length;

    if (currentLength >= data.length) {
      resolve();
      return;
    }

    const printNextChar = () => {
      if (currentLength >= data.length) {
        resolve();
        return;
      }

      let flag = false;
      if (chatBox.scrollHeight - chatBox.scrollTop - chatBox.clientHeight < 40) {
        flag = true;
      }

      chatMsg.value[chatMsg.value.length-1]['message'] += data.charAt(currentLength);
      currentLength++;

      if (flag) {
        chatBox.scrollTop = chatBox.scrollHeight;
      }

      if (currentLength < data.length) {
        setTimeout(printNextChar, 50);
      } else {
        resolve();
      }
    };

    printNextChar();
  });
}

const sendMsg = () => {
  if(!isAllowedSend.value) return
  inputRes.value = textInput.value
  chatMsg.value.push({role:'林则徐',message:textInput.value})
  nextTick(()=>{
    let chatBox = document.getElementById("chatBox");  // 定位到最底部
    chatBox.scrollTop = chatBox.scrollHeight
  })
  textInput.value = ''  // 清空输入框
}

const enterKeyDown = (e) => {     // 文本框的换行与发送
  if(e.ctrlKey && e.keyCode==13) {    //用户点击了ctrl+enter触发
    let textarea = document.getElementById('textArea') as HTMLTextAreaElement
    textarea.value += '\n';
  }else {     //用户点击了enter触发
    sendMsg()
  }
}

const wait = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const posToBottom = async () => {
  await nextTick(()=>{
    let chatBox = document.getElementById("chatBox");  // 定位到最底部
    chatBox.scrollTop = chatBox.scrollHeight
  })
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