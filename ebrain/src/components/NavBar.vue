<template>
  <nav :class="{ sticky: isSticky , hide: isHidden }" class="navbar">
    <div class="nav-inner">
      <div class="nav-left">
        <RouterLink class="logo" to="/">E-brain</RouterLink>
        <RouterLink class="nav-item" to="/projects">官方工程</RouterLink>
        <RouterLink class="nav-item" to="/community">社区</RouterLink>
        <RouterLink class="nav-item" to="/about">关于</RouterLink>
      </div>

      <div class="nav-right">
        <img :src="avatarUrl" v-if="avatarUrl" alt="User Avatar" class="avatar" @click="goToProfile" />
        <img v-else src="../assets/default-avatar.svg" alt="User Avatar" class="avatar" @click="goToProfile" />
      </div>  
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted, computed} from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const avatarUrl = computed(() => userStore.profile?.avatar || null)

const router = useRouter()

const isSticky = ref(false)
const isHidden = ref(false)

let lastScrollY = window.scrollY

const checkScroll = () => {
  const currentScroll = window.scrollY
  const delta = currentScroll - lastScrollY

  // 设置 sticky 状态
  isSticky.value = currentScroll > 50

  // 设置隐藏状态
  if (delta > 5 && currentScroll > 150) {
    // 向下滚动且滚动超过 100px 才隐藏
    isHidden.value = true
  } else if (delta < -5) {
    // 快速向上滚动则显示回来
    isHidden.value = false
  }

  lastScrollY = currentScroll
}

onMounted(() => {
  window.addEventListener('scroll', checkScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})

const goToProfile = () => {
  const uid = userStore.profile?.uid
  if (uid) {
    router.push(`/space/${uid}`)
  }else{
    router.push(`/login`)
  }
}
</script>

<style scoped>
.navbar {
  padding: 0.5% 1rem;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  transition: background-color 0.3s ease;
  background-color: rgba(255, 255, 255, 0); /* 初始透明 */
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  border-radius: 30px;
  transform: translateY(3px);

  transition: background-color 0.3s ease-in-out,
    transform 0.3s ease-in-out,
    opacity 0.3s ease-in-out,
    box-shadow 0.3s ease-in-out;
}

.navbar.sticky {
  background-color: rgba(111, 114, 121, 0.7);
  backdrop-filter: blur(12px); /* 模糊背景，适合玻璃感 */
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.navbar.hide {
  transform: translateY(-100%); /* 向上隐藏 */
  opacity: 0;
  pointer-events: none;
}

.nav-inner{
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
  display: flex;
  justify-content: space-between; /* 左右两边对齐 */
  align-items: center;
}

.nav-left, .nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  font-weight: bold;
  font-size: 1.3rem;
  color: #A6D6D6;
  text-decoration: none;
  margin-right: 1rem;
}

.nav-item {
  color: var(--color-text);
  text-decoration: none;
  font-weight: 500;
  padding: 0.1rem 0.2rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-item:hover {
  color: #333;
  background-color: #f0f0f0;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  object-fit: cover;
  transition: transform 0.2s;
}

.avatar:hover {
  transform: scale(1.05);
}
</style>
