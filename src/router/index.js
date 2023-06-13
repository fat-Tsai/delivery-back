import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/',
    name: 'main',
    component: () => import('@/views/Main.vue'),
    children: [
      {
        path: 'home',
        component: () => import('@/views/Home.vue')
      },
      {
        path: 'employee',
        component: () => import('@/views/EmployeeManage.vue')
      },
      {
        path: 'addEmployee',
        component: () => import('@/components/AddEmployee.vue')
      },
      {
        path: 'category',
        component: () => import('@/views/Category.vue')
      },
      {
        path: 'dish',
        component: () => import('@/views/Dish.vue')
      },
      {
        path: 'addDish',
        component: () => import('@/components/AddDish.vue')
      },
      {
        path: 'setmeal',
        component: () => import('@/views/Setmeal.vue')
      },
      {
        path: 'addSetmeal',
        component: () => import('@/components/AddSetmeal.vue')
      },
      {
        path: 'test',
        component: () => import('@/views/Test1.vue')
      },
      {
        path: 'tecentCos',
        component: () => import('@/views/TecentCos.vue')
      },
      {
        path: 'tecentCosSingle',
        component: () => import('@/views/TecentCosSingle.vue')
      },
      {
        path: 'order',
        component: () => import('@/views/Order.vue')
      },
      {
        path: 'user',
        component: () => import('@/views/User.vue')
      },
      {
        path: 'static',
        component: () => import('@/views/Static.vue')
      },
      {
        path: '/timePicker',
        component: () => import('@/views/TestTimePicker.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
