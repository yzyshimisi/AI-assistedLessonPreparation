<template>
<div class="bg-base-300 w-[7vw]">
  <ul class="menu rounded-box text-base">
    <li>
      <router-link to="/chat">
        <el-icon size="22"><ChatDotRound /></el-icon>
        <p>对话</p>
      </router-link>
    </li>
    <li>
      <router-link to="/lessonPreparationMaterials">
        <el-icon size="22"><Document /></el-icon>
        素材
      </router-link>
    </li>
    <li>
      <router-link to="/myResources">
        <el-icon size="22"><User /></el-icon>
        我的
      </router-link>
    </li>
  </ul>
</div>
</template>

<script setup lang="ts">

</script>
