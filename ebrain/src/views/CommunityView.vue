<template>
  <div class="community-view">
    <ClassFilter
      :classes="classList"
      :selected="selectedClass"
      @select="selectedClass = $event"
    />

    <div class="work-list">
      <WorkCard
        v-for="work in filteredWorks"
        :key="work.id"
        :work="work"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import WorkCard from '@/components/WorkCard.vue'
import ClassFilter from '@/components/ClassFilter.vue'
import { getEnumValues } from '@/utils/getEnumValues'

const classList = ref<string[]>([])
const selectedClass = ref<string | null>(null)
const works = ref<any[]>([])

onMounted(async () => {
  classList.value = await getEnumValues('work_class')
  const { data } = await supabase.from('works').select('*')
  works.value = data || []
})

const filteredWorks = computed(() => {
  if (!selectedClass.value) return works.value
  return works.value.filter(w => w.class === selectedClass.value)
})
</script>

<style scoped>
.community-view {
  display: flex;
  max-width: 1000px;
  margin: 0 auto;
}
.work-list {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  padding: 16px;
}
</style>
