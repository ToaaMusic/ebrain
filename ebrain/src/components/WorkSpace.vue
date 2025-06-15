<template>
  <div class="desktop" @mousedown.left="startPress($event)" @mouseup="onMouseUp" @mousemove="onMouseMove">
    <!-- 文件夹和内容项 -->
    <div
      v-for="item in items"
      :key="item.id"
      class="folder"
      :class="{ opened: openedFolderId === item.id }"
      :style="{ top: item.y + 'px', left: item.x + 'px' }"
      @mousedown.stop.prevent="startDrag($event, item)"
    >
      📁 {{ item.name }}
      <div v-if="item.children && openedFolderId === item.id" class="folder-content">
        <div v-for="child in item.children" :key="child.id" class="child-item">
          • {{ child.name }}
        </div>
      </div>
    </div>

    <!-- 圆形选项面板 -->
    <div
      v-if="menu.active"
      class="circle-menu"
      :style="{ top: menu.y + 'px', left: menu.x + 'px', transform: 'translate(-50%, -50%)' }"
    >
      <div
        class="menu-item"
        v-for="(option, index) in menu.options"
        :key="option.label"
        :style="circlePosition(index, menu.options.length, 60, { x: 0, y: 0 }) as CSSProperties"
        :class="{ hovered: hoveredOption === option.label }"
      >
        {{ option.label }}
      </div>
      <div
        v-if="hoveredOption && menu.subOptions[hoveredOption]"
        class="sub-menu"
        v-for="(sub, i) in menu.subOptions[hoveredOption]"
        :key="sub.label"
        :style="circlePosition(i, menu.subOptions[hoveredOption].length, 50, getHoveredOptionPosition()) as CSSProperties"
      >
        {{ sub.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { CSSProperties } from 'vue'

interface Item {
  id: number
  name: string
  x: number
  y: number
  children?: Item[]
}

const items = ref<Item[]>([])
let idCounter = 0
const openedFolderId = ref<number | null>(null)

const menu = reactive({
  active: false,
  x: 0,
  y: 0,
  options: [
    { label: '新建' },
    { label: '更多' }
  ],
  subOptions: {
    '新建': [
      { label: '文件夹' },
      { label: '文章' },
      { label: '作品' }
    ]
  } as Record<string, { label: string }[]>
})

const hoveredOption = ref<string | null>(null)
let pressTimer: number | null = null
let longPressTriggered = false

function startPress(e: MouseEvent) {
  pressTimer = window.setTimeout(() => {
    longPressTriggered = true
    menu.active = true
    menu.x = e.clientX
    menu.y = e.clientY
  }, 500)
}

function onMouseUp(e: MouseEvent) {
  if (pressTimer) clearTimeout(pressTimer)
  if (!longPressTriggered) return

  if (hoveredOption.value === '文件夹') {
    items.value.push({ id: idCounter++, name: '新建文件夹', x: menu.x, y: menu.y, children: [] })
  } else if (hoveredOption.value === '文章') {
    items.value.push({ id: idCounter++, name: '新建文章', x: menu.x, y: menu.y })
  } else if (hoveredOption.value === '作品') {
    items.value.push({ id: idCounter++, name: '新建作品', x: menu.x, y: menu.y })
  }

  longPressTriggered = false
  menu.active = false
  hoveredOption.value = null
}

function onMouseMove(e: MouseEvent) {
  if (!menu.active) return
  const dx = e.clientX - menu.x
  const dy = e.clientY - menu.y
  const angle = Math.atan2(dy, dx)
  for (const [index, option] of menu.options.entries()) {
    const theta = (2 * Math.PI / menu.options.length) * index
    if (Math.abs(angle - theta) < 0.6) {
      hoveredOption.value = option.label
      return
    }
  }
  hoveredOption.value = null
}

function getHoveredOptionPosition(): { x: number; y: number } {
  const index = menu.options.findIndex(o => o.label === hoveredOption.value)
  const angle = (2 * Math.PI / menu.options.length) * index
  return {
    x: 60 * Math.cos(angle),
    y: 60 * Math.sin(angle)
  }
}

let dragging: Item | null = null
let offsetX = 0
let offsetY = 0

function startDrag(e: MouseEvent, item: Item) {
  dragging = item
  offsetX = e.clientX - item.x
  offsetY = e.clientY - item.y
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

function onDrag(e: MouseEvent) {
  if (dragging) {
    dragging.x = e.clientX - offsetX
    dragging.y = e.clientY - offsetY
  }
}

function stopDrag() {
  dragging = null
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

function circlePosition(index: number, total: number, radius: number, center = { x: 0, y: 0 }): CSSProperties {
  const angle = (2 * Math.PI / total) * index
  return {
    position: 'absolute',
    top: `${center.y + radius * Math.sin(angle)}px`,
    left: `${center.x + radius * Math.cos(angle)}px`,
    transform: 'translate(-50%, -50%)'
  }
}
</script>

<style scoped>
.desktop {
  width: 100%;
  height: 100vh;
  position: relative;
  background-color: transparent;
  user-select: none;
  overflow: hidden;
}

.folder {
  position: absolute;
  width: 120px;
  min-height: 40px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: move;
  font-size: 14px;
}
.folder.opened {
  background-color: #d0ebff;
}
.folder-content {
  margin-top: 8px;
  padding-left: 10px;
  font-size: 13px;
}
.child-item {
  padding: 2px 0;
}

.circle-menu {
  position: absolute;
  width: 0;
  height: 0;
  z-index: 999;
  pointer-events: none;
}
.menu-item,
.sub-menu {
  width: 80px;
  height: 30px;
  background: white;
  border-radius: 4px;
  border: 1px solid #ccc;
  text-align: center;
  line-height: 30px;
  font-size: 13px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  pointer-events: auto;
}
.menu-item.hovered {
  background-color: #42b983;
  color: white;
}
</style>