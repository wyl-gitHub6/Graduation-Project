import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect:'/home'
  },
  {
    path: '/home',
    name: 'Home',
    component:()=>import('../views/Home'),
    children:[
      {
        path:'/home',
        redirect:'/index'
      },
      {
        path:'/index',
        name: "index",
        meta: {
          title: '首页'
        },
        component:()=>import('../views/Index')
      },
      {
        path:'/user',
        name: "user",
        meta: {
          title: '个人信息'
        },
        component:()=>import('../views/User')
      },
      {
        path:'/statistical',
        name: "statistical",
        meta: {
          title: '选课统计'
        },
        component:()=>import('../views/Statistical')
      },
      {
        path:'/scoreStatistical',
        name: "scoreStatistical",
        meta: {
          title: '成绩统计'
        },
        component:()=>import('../views/ScoreStatistical')
      },
      {
        path:'/course',
        name: "course",
        meta: {
          title: '课程管理'
        },
        component:()=>import('../views/Course')
      },
      {
        path:'/chooseCourse',
        name: "chooseCourse",
        meta: {
          title: '选课'
        },
        component:()=>import('../views/ChooseCourse')
      },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
