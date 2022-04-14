/*
 * @Description: 路由
 * @Author: Wangyl
 * @Date: 2021-10-05 17:48:13
 * @LastEditors: Wangyl
 * @LastEditTime: 2022-04-14 20:06:44
 */
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect:'/login'
  },
  {
    path:'/login',
    component:()=>import('../views/Login')
  },
  {
    path: '/home',
    name: 'Home',
    component:()=>import('../views/Home'),
    children:[
      {
        path:'/home',
        redirect:'/index',
      },
      {
        path:'/index',
        name: "index",
        meta: {
          title: '首页',
          requireAuth: true
        },
        component:()=>import('../views/Index')
      },
      {
        path:'/user',
        name: "user",
        meta: {
          title: '个人信息',
          requireAuth: true
        },
        component:()=>import('../views/User')
      },
      {
        path:'/users',
        name: "users",
        meta: {
          title: '管理员维护',
          requireAuth: true
        },
        component:()=>import('../views/Users')
      },
      {
        path:'/statistical',
        name: "statistical",
        meta: {
          title: '选修课统计',
          requireAuth: true
        },
        component:()=>import('../views/Statistical')
      },
      {
        path:'/course',
        name: "course",
        meta: {
          title: '课程管理',
          requireAuth: true
        },
        component:()=>import('../views/Course')
      },
      {
        path:'/chooseCourse',
        name: "chooseCourse",
        meta: {
          title: '必修课',
          requireAuth: true
        },
        component:()=>import('../views/ChooseCourse')
      },
      {
        path:'/checkCourse',
        name: "checkCourse",
        meta: {
          title: '选修课',
          requireAuth: true
        },
        component:()=>import('../views/CheckCourse')
      },
      {
        path:'/teacher',
        name: "teacher",
        meta: {
          title: '教师管理',
          requireAuth: true
        },
        component:()=>import('../views/Teacher')
      },
      {
        path:'/college',
        name: "college",
        meta: {
          title: '院系管理',
          requireAuth: true
        },
        component:()=>import('../views/College')
      },
      {
        path:'/professional',
        name: "professional",
        meta: {
          title: '专业管理',
          requireAuth: true
        },
        component:()=>import('../views/Professional')
      },
      {
        path:'/grade',
        name: "grade",
        meta: {
          title: '年级管理',
          requireAuth: true
        },
        component:()=>import('../views/Grade')
      },
      {
        path:'/classes',
        name: "classes",
        meta: {
          title: '班级管理',
          requireAuth: true
        },
        component:()=>import('../views/Classes')
      },
      {
        path:'/student',
        name: "student",
        meta: {
          title: '学生管理',
          requireAuth: true
        },
        component:()=>import('../views/Student')
      },
      {
        path:'/driverClasses',
        name: "driverClasses",
        meta: {
          title: '分班管理',
          requireAuth: true
        },
        component:()=>import('../views/DriverClasses')
      },
      {
        path:'/score',
        name: "score",
        meta: {
          title: '成绩管理',
          requireAuth: true
        },
        component:()=>import('../views/Score')
      },
      {
        path:'/quartz',
        name: "quartz",
        meta: {
          title: '定时任务',
          requireAuth: true
        },
        component:()=>import('../views/Quartz')
      },
      {
        path:'/captcha',
        name: "captcha",
        meta: {
          title: '定时任务',
        },
        component:()=>import('../views/Captcha')
      },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(res => res.meta.requireAuth)) {// 判断是否需要登录权限
    if (sessionStorage.getItem("user")) {// 判断是否登录
      next()
    } else {// 没登录则跳转到登录界面
      next({
        path: '/login',
        query: {redirect: to.fullPath}
      })
    }
  } else {
    next()
  }
})

export default router
