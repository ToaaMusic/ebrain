<template>
  <div class="space-page" v-if="displayUser" :class="{'expanded' : isExpanded }">
    <div class="background" :class="{'expanded' : isExpanded }" :style="{background: `url(${displayUser.background}) center/cover no-repeat`}" @click="openWorkSpace">
      <div v-show="!isExpanded" class="background-content">
        <h1 class="bio">{{ displayUser.bio }}</h1>
      </div>
<!-- :style="{
    backgroundImage: `url(${displayUser.background})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // 半透明黑底
    backgroundBlendMode: 'darken'
  }" -->
      <div v-show="isExpanded" class="workspace">
        <WorkSpace />
      </div>
    </div>

    <div class="main" v-show="!isExpanded">
      <div class="content">
        <router-view />
        <div class="tabs">
          <button :class="{ active: currentTab === 'works' }" @click="currentTab = 'works'">资源</button>
          <button :class="{ active: currentTab === 'blogs' }" @click="currentTab = 'blogs'">文章</button>
        </div>

        <div class="tab-content">
          <div class="blogs" v-if="currentTab === 'blogs'">
            <p v-if="blogs.length === 0">还没有发布任何文章~</p>
            <div v-else>
              <div v-for="blog in blogs" :key="blog.id" class="post-card">
                <h3>{{ blog.title }}</h3>
                <p>{{ blog.description }}</p>
                <small>{{ new Date(blog.created_at).toLocaleDateString() }}</small>
              </div>
            </div>
          </div>

          <div v-else-if="currentTab === 'works'">
            <p v-if="works.length === 0">还没有发布任何作品~</p>
            <div v-else>
              <div v-for="work in works" :key="work.id" class="work-card">
                <img :src="work.cover_image" alt="cover" style="max-width: 100%; border-radius: 6px;" />
                <h3>{{ work.title }}</h3>
                <p>{{ work.description }}</p>
                <small>{{ new Date(work.created_at).toLocaleDateString() }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside class="user">
        <div class="user-head" >
          <div class="user-head-cover" :style="{background: `url(${displayUser.avatar}) center/cover no-repeat`}"></div>
          <img :src="displayUser.avatar" alt="avatar" class="avatar" @click="() => fileInput?.click()" />
          <input ref="fileInput" type="file" accept="image/*" @change="uploadAvatar" style="display: none;" />
          <h2 class="username">{{ displayUser.name }}</h2>
          
        </div>
        <div class="user-content">
          <button v-if="isSelf" class="button" @click="logout">退出登录</button>
          <button v-if="isSelf" class="button" @click="release">发布</button>
          <router-link :to="`/space/${displayUser.uid}/update`" class="button">编辑资料</router-link>
          <p><strong>注册邮箱：</strong>{{ displayUser.email || "未公开"}}</p>
          <p><strong>UID：</strong>{{ displayUser.uid }}</p>
        </div>
      </aside>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'
import WorkSpace from '@/components/WorkSpace.vue'

const userStore = useUserStore()
const blogs = ref<any[]>([])
const works = ref<any[]>([])

const fileInput = ref<HTMLInputElement | null>(null)
const currentTab = ref('blogs')
const route = useRoute()
const router = useRouter()
const uploading = ref(false)
const uid = route.params.uid as string
const displayUser = ref<any>(null)

const isSelf = computed(() => {
  return userStore.profile?.uid?.toString() === uid
})

const fetchUserByUid = async () => {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('uid', uid)
    .single()
  if (error || !profile) {
    router.push('/')
    return null
  }
  return profile
}

const uploadAvatar = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (!files?.length || !userStore.id) return

  uploading.value = true
  const file = files[0]
  const ext = file.name.split('.').pop()
  const path = `${userStore.id}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
  if (uploadError) return alert('上传失败')

  const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
  const { error: updateError } = await supabase.from('profiles').update({ avatar: publicUrl }).eq('id', userStore.id)

  if (!updateError) {
    const newProfile = { ...userStore.profile!, avatar: publicUrl }
    userStore.updateProfile(newProfile)
  }
  uploading.value = false
}

const fetchBlogsAndWorks = async (authId: string) => {
  const [{ data: blogData }, { data: workData }] = await Promise.all([
    supabase.from('blogs').select('*').eq('user_id', authId),
    supabase.from('works').select('*').eq('user_id', authId)
  ])
  blogs.value = blogData || []
  works.value = workData || []
}


onMounted(async () => {
  console.log('Pinia 用户状态：', useUserStore().$state)
  if (isSelf.value) {
    displayUser.value = userStore.profile
    await fetchBlogsAndWorks(userStore.id)
  } else {
    const profile = await fetchUserByUid()
    if (!profile) return
    displayUser.value = profile
    await fetchBlogsAndWorks(profile.id)
  }
})


const logout = async () => {
  await supabase.auth.signOut()
  userStore.clear()
  router.push('/login')
}

const release = async () =>{

}

const openWorkSpace = async () => {
  isExpanded.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const isExpanded = ref(false)

// onMounted(() => {
//   const onScroll = () => {
//     if (window.scrollY <= 0) {
//       isExpanded.value = true
//     } else if (window.scrollY > 100) {
//       isExpanded.value = false
//     }
//   }
//   window.addEventListener('scroll', onScroll)
// })


</script>

<style scoped>
.space-page {
  transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  padding-top: 60px;
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
}

.space-page.expanded{
  padding-top: 0;
  max-width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.background {
  position: relative;
  height: 250px;
  /* transition: all 0.5s ease-in-out; */
  transform-origin: center center;
  /* transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1); */
  transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);

  background-color: rgba(111, 114, 121, 0.7);
  backdrop-filter: blur(12px); /* 模糊背景，适合玻璃感 */
  -webkit-backdrop-filter: blur(12px);

  z-index: 1;
  overflow: hidden;
  min-height: 250px;
  border-radius:10px;
  display: flex;
  align-items:center;
  justify-content: center;

}

.background:not(.expanded):hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.3s ease;
}


.background.expanded {
  height: 100vh;
  position: absolute;
  z-index: 1;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

.workspace {
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.background-content{
  display: flex;
  align-items:center;
  justify-content: center;
}

.main{
  padding-top: 10px;
  display: flex;
  min-height: 150vh;
  gap: 1rem;
}

.content{
  flex: 2;
  padding: 1rem 1rem;
}

.user {
  height: auto;
  max-width: 200px;
}

.user-head {
  position: relative;
  /* overflow: hidden; */
  z-index: 0;

  text-align: center;
  padding: 1rem;
  border-radius:10px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  height: 200px;
  width: 200px;
  
  background-color: rgba(111, 114, 121, 0.7);
  backdrop-filter: blur(12px); 
  -webkit-backdrop-filter: blur(12px);
}


.user-head-cover{
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: blur(14px);
  transform: scale(1.05); /* 扩大避免边缘模糊空白 */
  z-index: -1;
  opacity: 0.4;
}

.user-content{
  margin-top: 1rem;
  padding: 1rem;
  border-radius:10px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  background-color: rgba(162, 165, 170, 0.7);
  backdrop-filter: blur(12px); /* 模糊背景，适合玻璃感 */
  -webkit-backdrop-filter: blur(12px);
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid #ccc;
  object-fit: cover;
}

.avatar:hover{
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
  transition: box-shadow 0.3s ease;
}

.username {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  font-size: auto;
  margin: 0;
}

.bio {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.email {
  color: #555;
  font-size: 0.95rem;
}

.button {
  background-color: #ff6666;
  border: none;
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 4px;
  margin-top: 0.8rem;
  cursor: pointer;
  transition: 0.2s;
}

.button:hover {
  background-color: #e05050;
}

.tabs {
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid #ddd;
  margin-bottom: 1rem;
}

.tabs button {
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  font-weight: bold;
  color: #666;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.tabs button.active {
  color: #000;
  border-bottom: 2px solid #42b983;
}

.tab-content {
  font-size: 1rem;
}

.tab-content p{
  display: block;
  /* color: #000; */
}

.post-card, .work-card {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
</style>
