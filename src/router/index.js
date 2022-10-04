import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login.vue'
import Main from '@/views/Main.vue'
import Home from '@/views/Home.vue'
import EmployeeManage from '@/views/EmployeeManage.vue'
import AddEmployee from '@/components/AddEmployee.vue'
import Category from '@/views/Category.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    name: 'main',
    component: Main,
    children: [
      {
        path: 'home',
        component: Home
      },
      {
        path: 'employeeManage',
        component: EmployeeManage
      },
      {
        path: 'addEmployee',
        component: AddEmployee
      },
      {
        path: 'category',
        component: Category
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
