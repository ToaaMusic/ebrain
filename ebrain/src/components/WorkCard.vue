<template>
  <div class="work-card">
    <div class="work-header">
      <h2>{{ work.title }}</h2>
      <span v-if="work.isofficial" class="official-badge">官方</span>
    </div>
    <p class="desc">{{ work.description }}</p>
    <div class="tags">
      <span v-for="tag in work.tags" :key="tag" class="tag">#{{ tag }}</span>
    </div>
    <a :href="work.file_url" target="_blank" class="file-link">查看文件</a>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  work: {
    title: string
    description: string
    tags: string[]
    file_url: string
    isofficial: boolean
  }
}>()
</script>

<style scoped>
.work-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 12px;
  background: #fafafa;
}
.work-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.official-badge {
  font-size: 12px;
  color: green;
}
.desc {
  margin-top: 8px;
  color: #555;
}
.tags {
  margin-top: 8px;
}
.tag {
  font-size: 12px;
  margin-right: 6px;
  color: #888;
}
.file-link {
  display: block;
  margin-top: 10px;
  color: #007acc;
}
</style>
