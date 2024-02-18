import { createRouter, createWebHistory, RouteRecordRaw, RouterView } from 'vue-router'
import {
  Grid,
  Layers,
  PersonSharp,
  Settings,
  Aperture,
  LayersSharp,
  PeopleSharp,
  AppsSharp,
  Calendar
} from '@vicons/ionicons5'
import { createVNode, render } from 'vue'
/** 挂载注册ProgressBar组件 */
import ProgressBar from '../components/ProgressBar.vue'
/** 将组件转换成虚拟DOM */
const Vnode = createVNode(ProgressBar)
/** 将虚拟DOM挂载到真实DOM元素上 */
render(Vnode, document.body)

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue') // 注意这里要带上 文件后缀.vue
  },
  {
    path: '/redirect',
    name: 'redirect',
    component: () => import('@/views/redirect/index.vue') // 注意这里要带上 文件后缀.vue
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404/index.vue') // 注意这里要带上 文件后缀.vue
  },
  {
    path: '/',
    name: 'layout',
    component: () => import('@/layout/index.vue'),
    redirect: '/project',
    beforeEnter: (to, from) => {
      const token = localStorage.getItem('token')
      if (!token) {
        return {
          path: '/login'
        }
      }
    },
    children: [
      {
        path: '/project',
        name: 'project',
        meta: {
          show: true,
          type: 'static',
          title: '全部项目',
          icon: AppsSharp
        },
        component: () => import('@/views/project/index.vue')
      },
      {
        path: '/member',
        name: 'member',
        meta: {
          show: true,
          type: 'static',
          title: '成员',
          icon: PeopleSharp
        },
        component: () => import('@/views/project/index.vue')
      },
      {
        path: '/calendar',
        name: 'calendar',
        meta: {
          show: true,
          type: 'static',
          title: '项目日历',
          icon: Calendar
        },
        component: () => import('@/views/calendar/index.vue')
      },
      {
        path: '/project/:id',
        name: 'task',
        meta: {
          show: true,
          title: '任务'
        },
        component: () => import('@/views/task/index.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由前置拦截器用于户权限判断
router.beforeEach((to, from) => {
  Vnode.component?.exposed?.startLoading()
  // 根据路由修改网站标题
  if (to.meta && to.meta.title) {
    document.title = to.meta.title as string
  }
  // 未匹配到路由 比如浏览器输入路由表中不存在的路由
  if (to.matched.length === 0) {
    return {
      name: '404'
    }
  }
  return true
})

router.afterEach((to, from) => {
  Vnode.component?.exposed?.endLoading()
})

export default router
