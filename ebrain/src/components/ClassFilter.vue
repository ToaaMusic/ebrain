<template>
  <div class="class-filter">
    <h3>分类</h3>
    <ul>
      <li
        :class="{ selected: selected === null }"
        @click="$emit('select', null)"
      >
        全部
      </li>
      <li
        v-for="cls in classes"
        :key="cls"
        :class="{ selected: selected === cls }"
        @click="$emit('select', cls)"
      >
        {{ cls }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  classes: string[]
  selected: string | null
}>()
defineEmits(['select'])
</script>

<style scoped>
.class-filter {
  width: 180px;
  padding: 16px;
  border-right: 1px solid #ddd;
}
.class-filter ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.class-filter li {
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
}
.class-filter li:hover {
  background-color: #eee;
}
.class-filter li.selected {
  background-color: #4285f4;
  color: white;
}
</style>
