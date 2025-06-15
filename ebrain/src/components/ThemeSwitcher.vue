<template>
    <button class="theme-switcher" @click="toggleTheme">
        {{ isDark ? '🌞' : '🌙' }}
    </button>
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue'

    const isDark = ref(false)

    onMounted(() => {
        // 读取本地缓存，恢复上次切换状态
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme === 'dark') {
            isDark.value = true
            document.documentElement.setAttribute('data-theme', 'dark')
        }
    })

    function toggleTheme() {
        isDark.value = !isDark.value
            if (isDark.value) {
                document.documentElement.setAttribute('data-theme', 'dark')
                localStorage.setItem('theme', 'dark')
            } else {
                document.documentElement.removeAttribute('data-theme')
                localStorage.setItem('theme', 'light')
            }
    }
</script>

<style scoped>
    .theme-switcher {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--button-bg, rgba(255, 255, 255, 0.7));
        color: var(--button-color, #333);
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 1.5rem;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        cursor: pointer;
        z-index: 1000;
        transition: background-color 0.3s, color 0.3s;
    }

    .theme-switcher:hover {
        background-color: var(--button-hover-bg, rgba(0,0,0,0.8));
        color: white;
    }
</style>
  