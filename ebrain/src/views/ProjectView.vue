<template>
  <div class="official-works-page">
    <h1>开发中</h1>

    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="projects.length === 0" class="empty">暂无官方工程</div>

    <div class="projects-grid" v-else>
      <div class="project-card" v-for="item in projects" :key="item.id">
        <img :src="item.image_url" alt="封面图" class="cover" />
        <h2>{{ item.title }}</h2>
        <p>{{ item.description }}</p>
        <p class="date">📅 {{ formatDate(item.created_at) }}</p>
      </div>
    </div>

    <h1>筹备中</h1>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="projects.length === 0" class="empty">暂无</div>

    <h1>未来计划</h1>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="projects.length === 0" class="empty">暂无</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { supabase } from '@/lib/supabase'

interface Work {
  id: string
  title: string
  description: string
  image_url: string
  created_at: string
}

const projects = ref<Work[]>([])
const loading = ref(true)

onMounted(async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (!error && data) {
    projects.value = data
  }
  loading.value = false
})

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
</script>

<style scoped>
.official-works-page {
  padding: 2rem;
  max-width: 960px;
  margin: auto;
}
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}
.project-card {
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  padding: 1rem;
  transition: transform 0.2s ease;
}
.project-card:hover {
  transform: translateY(-5px);
}
.cover {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}
.date {
  color: #666;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}
.loading, .empty {
  text-align: center;
  color: #999;
  margin-top: 3rem;
}
</style>
