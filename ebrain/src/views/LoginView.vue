<template>
  <div class="main">

    <div class="login-container">
      <section class="photo">
        <img src="../assets/129294365_p1.png" alt="Login Art" />
      </section>
      <div class="login-form">
        <form @submit.prevent="login">
          <input v-model="email" type="email" placeholder="邮箱" required />
          <input v-model="password" type="password" placeholder="密码" required />
          <button type="submit" @click="loginButton">登录</button>
        </form>

        <!-- 注册按钮单独处理 -->
        <div class="register-row">
          <transition name="slide-fade">
            <input
              v-if="showVerification"
              v-model="otp"
              type="text"
              class="otp-input"
              placeholder="验证码"
            />
          </transition>
          <button class="register-button" @click="register">注册</button>
        </div>
        <p class="error" v-if="error">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

  
<script setup lang="ts">
  import { ref ,onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { supabase } from '@/lib/supabase'
  import { useUserStore } from '@/stores/user'
  
  const userStore = useUserStore()
  const router = useRouter()
  const email = ref('')
  const otp = ref('')
  const password = ref('')
  const error = ref('')
  const showVerification = ref(false)
  const loading = ref(false)

  onMounted(async () => {
    if(userStore.profile){
      router.push("/space/"+ userStore.profile.uid)
    }

  })

  const loginButton = async () => {
    showVerification.value = false
  }

  const login = async () => {
  loading.value = true
  try {
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })

    if (authError) throw authError

    const user = data.user
    if (!user) throw new Error('未获取到用户')
    console.log('登录成功，user.id =', data.user.id)

    // 🔁 获取 profile 信息
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError) throw profileError

    // ✅ 保存用户数据
    userStore.setUser({
      id: user.id,
      email: user.email!,
      profile: {
        uid: profile.uid,
        name: profile.name,
        avatar: profile.avatar,
        bio: profile.bio,
        background: profile.background_url
      }
    })

    router.push(`/space/${profile.uid}`)

  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}


  const register = async () => {
  error.value = ''
  showVerification.value = true

  if (!email.value) {
    error.value = '请输入邮箱以接收验证码'
    return
  }

  try {
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/space/redirect`
      }
    })

    if (otpError) throw otpError

    error.value = '验证码已发送，请查收邮箱'
  } catch (err: any) {
    error.value = err.message || '验证码发送失败'
  }
}


  </script>
  
  <style scoped>
.main {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
}

.login-container {
  display: flex;
  width: 800px;
  height: 500px;
  background: #fff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  overflow: hidden;
}

/* 左边图片 */
.photo {
  flex: 1;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo img {
  max-width: 100%;
  height: auto;
  object-fit: cover;
}

/* 右边表单 */
.login-form {
  flex: 1;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-form h2 {
  margin-bottom: 2rem;
  font-size: 1.8rem;
  color: #333;
}

.login-form input {
  display: block;
  width: 93.1%;
  margin-bottom: 1rem;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.login-form button {
  width: 100%;
  padding: 0.75rem;
  background-color: pink;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background-color 0.2s ease;
}

.login-form button:hover {
  background-color: pink;
}

.register {
  background-color: transparent;
  border: 1px solid #ccc;
  color: #666;
}

.error {
  color: red;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}
/* 动画 */
.register-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px; /* 按钮和输入框之间间距 */
  margin-top: 1rem;
}

/* transition name: slide-fade */
.slide-fade-enter-active {
  transition: all 0.4s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.slide-fade-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.slide-fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.otp-input {
  flex: 1 1 120px;
  padding: 0.4em 0.8em;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

.register-button {
  padding: 0.4em 1.2em;
  border: none;
  border-radius: 6px;
  background-color: #3b82f6;
  color: white;
  font-weight: bold;
  cursor: pointer;
}
</style>