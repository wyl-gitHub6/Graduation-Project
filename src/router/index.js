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
      {
        path:'/teacher',
        name: "teacher",
        meta: {
          title: '教师管理'
        },
        component:()=>import('../views/Teacher')
      },
      {
        path:'/college',
        name: "college",
        meta: {
          title: '院系管理'
        },
        component:()=>import('../views/College')
      },
      {
        path:'/professional',
        name: "professional",
        meta: {
          title: '专业管理'
        },
        component:()=>import('../views/Professional')
      },
      {
        path:'/grade',
        name: "grade",
        meta: {
          title: '年级管理'
        },
        component:()=>import('../views/Grade')
      },
      {
        path:'/classes',
        name: "classes",
        meta: {
          title: '班级管理'
        },
        component:()=>import('../views/Classes')
      },
      {
        path:'/student',
        name: "student",
        meta: {
          title: '学生管理'
        },
        component:()=>import('../views/Student')
      },
      {
        path:'/driverClasses',
        name: "driverClasses",
        meta: {
          title: '分班管理'
        },
        component:()=>import('../views/DriverClasses')
      },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
