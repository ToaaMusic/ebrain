import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import ProjectView from '@/views/ProjectView.vue'
import CommunityView from '@/views/CommunityView.vue'
import SpaceView from '../views/SpaceView.vue'
import UpdateView from '../views/UpdateView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/about', name: 'about', component: AboutView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/projects', name: 'projects', component: ProjectView},
  { path: '/community', name: 'community', component: CommunityView},
  { path: '/space/:uid', name: 'userHome', component: SpaceView ,
    children:[
      {
        path: 'update',
        component: UpdateView,
        name :'UpdateProfile'
      }
    ]
  },

]

const router = createRouter({
  history: createWebHistory('/ebrain/'),
  routes: [
    {
      path: '/',
      component: () => import('@/views/HomeView.vue')
    },
  ]
})

export default router
