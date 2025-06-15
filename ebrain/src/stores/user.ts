// import { defineStore } from 'pinia'

//  export interface Profile {
//   uid: number
//   name: string
//   avatar: string
//   bio: string
// }

// export interface UserState {
//   id: string
//   email: string
//   profile: Profile | null
// }

// export const useUserStore = defineStore('user', {
//   state: (): UserState => ({
//     id: '',
//     email: '',
//     profile: null
//   }),

//   actions: {
//     setUser(payload: { id: string; email: string; profile: Profile }) {
//       this.id = payload.id
//       this.email = payload.email
//       this.profile = payload.profile
//       localStorage.setItem('user', JSON.stringify(this.$state))
//     },

//     updateProfile(profile: Profile) {
//       this.profile = profile
//       localStorage.setItem('user', JSON.stringify(this.$state))
//     },

//     loadFromLocal() {
//         const raw = localStorage.getItem('user')
//         try {
//             if (raw) {
//             const parsed = JSON.parse(raw)
//             if (parsed.id && parsed.profile && parsed.profile.uid) {
//                 this.id = parsed.id
//                 this.email = parsed.email
//                 this.profile = parsed.profile
//             } else {
//                 this.clear()
//                 alert("登陆记录缓存结构错误，请重新登录")
//             }
//             }
//         } catch {
//             this.clear()
//             alert("登陆记录解析失败，请重新登录")
//         }
//         },

//     clear() {
//       this.id = ''
//       this.email = ''
//       this.profile = null
//       localStorage.removeItem('user')
//     }
//   },
//   persist: {
//   storage: localStorage,
//   key: 'user'
// } // ✅ 自定义配置写法
// })
import { defineStore } from 'pinia'

export interface Profile {
  uid: number
  name: string
  avatar: string
  bio: string
  background: string
}

export interface UserState {
  id: string
  email: string
  profile: Profile | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    id: '',
    email: '',
    profile: null
  }),

  actions: {
    setUser(payload: { id: string; email: string; profile: Profile }) {
      this.id = payload.id
      this.email = payload.email
      this.profile = payload.profile
    },

    updateProfile(profile: Profile) {
      this.profile = profile
    },

    clear() {
      this.id = ''
      this.email = ''
      this.profile = null
    }
  },

  persist: {
        key: 'user',
        storage: localStorage

  }
})
