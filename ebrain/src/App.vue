<template>
  
  <div class="app-container">
    <ButterflyUniverse v-if="showEffect"/>
    <NavBar v-if="showNavBar"/>
    <div :class="['main-content', { 'padding': isPadding }]">
      <RouterView />
    </div>
    <p v-show="isPadding" class="footer">© 2025 E-brain 伊布琳 by ToaaM.</p>
    <ThemeSwitcher />
  </div>
</template>


<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'
import ButterflyUniverse from './components/ButterflyUniverse.vue'
import ThemeSwitcher from './components/ThemeSwitcher.vue'



const showNavBar = ref(true)

const isPadding = ref(true)

const showEffect = ref(false)

const route = useRoute()

// 监听路由变化
watch(() => route.name, (newName) => {
  if (newName === 'login' || newName === 'userHome') {
    isPadding.value = false
  } else {
    isPadding.value = true
  }
})

</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.footer{
  text-align: center;
  padding: 1rem;
  font-size: 0.9rem;
  border-top: 1px solid #eee;
}

.main-content {
  flex: 1;
  padding-top: 0;
}

.main-content.padding {
  padding-top: 60px;
  flex: 1;
}

</style>
