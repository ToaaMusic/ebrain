import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://localhost:7116', // 你的后端根地址
})

// 请求拦截器：每次请求自动附加 token
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default instance
