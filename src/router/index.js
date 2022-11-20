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
        path: 'employeeManage',
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
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
