<template>
  <div class="edit-profile">
    <h2>编辑个人信息</h2>
    <form @submit.prevent="save">
      <label>用户名</label>
      <input v-model="form.name" required />

      <label>简介</label>
      <textarea v-model="form.bio" />

      <button type="submit">保存</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const form = ref({
  name: userStore.profile?.name || '',
  bio: userStore.profile?.bio || ''
})

const save = async () => {
  const { error } = await supabase.from('profiles')
    .update(form.value)
    .eq('id', userStore.id)

  if (!error) {
    userStore.updateProfile({ ...userStore.profile!, ...form.value })
    router.push(`/space/${userStore.profile?.uid}`)
  } else {
    alert('保存失败')
  }
}
</script>

<style scoped>
.edit-profile {
  padding: 0rem;
  display: contents;
}
</style>
