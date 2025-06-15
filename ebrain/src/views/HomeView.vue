<template>
  <div class="home-container">
    <!-- 顶部海报区域 -->
    <section class="hero">
      <!-- <div class="overlay">
        <img src="@/assets/logo.svg" alt="E-brain Logo" class="hero-logo" />
        <div class="hero-buttons">
          <button class="btn primary" @click="downloadGame">立即下载</button>
          <button class="btn secondary" @click="viewDetails">了解详情</button>
        </div>
      </div> -->
    </section>

    <section class="news">
      <h1>NEWS</h1>
      <div class="news-list">
        <div v-for="(item, index) in news" :key="index" class="news-card">
          <img :src="item.image" alt="news" />
          <div class="news-content">
            <h3>{{ item.title }}</h3>
            <p>{{ item.summary }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const news = ref([
  {
    title: '伊布琳AI 大语言模型交互软件1.0测试版',
    summary: '基于LLamasharp',
    image: new URL('../assets/E-brain 2025_4_30 15_40_37.png', import.meta.url).href,
  },
])

const downloadGame = () => {
  alert('开始下载（未来这里跳转到下载链接）')
}

const viewDetails = () => {
  alert('跳转到游戏详情页（你可以做一个详情页面）')
}
</script>

<style scoped>
.home-container {
  font-family: 'Segoe UI', sans-serif;
}

/* 海报区域 */
.hero {
  position: relative;
  height: 35vh;
  background: url('../assets/aebeb30b2ff70bc92b26ac0969f428dc1808351.jpg') center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay {
  text-align: center;
  background: transparent;
  padding: 2rem;
  border-radius: 1rem;
}

.hero-logo {
  width: 100px;
  margin-bottom: 2rem;
}

.hero-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn {
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.3s ease;
}

.btn.primary {
  background-color: #F7CFD8;
  color: white;
}

.btn.secondary {
  background-color: #D1E9F6;
  color: black;
}

.btn:hover {
  transform: scale(1.05);
}

.news {
  max-width: 1000px;
  margin: 0 auto;
  padding: 16px;

}

.news h1{
  padding: 1rem;
}

.news-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
}

.news-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.news-card:hover {
  transform: translateY(-5px);
}

.news-card img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.news-content {
  padding: 1rem;
  text-align: left;
}

.news-content h3 {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
}

.news-content p {
  margin: 0;
  font-size: 0.95rem;
}
</style>
