import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login.vue'
import Main from '@/views/Main.vue'
import Home from '@/views/Home.vue'
import EmployeeManage from '@/views/EmployeeManage.vue'
import AddEmployee from '@/components/AddEmployee.vue'
import Category from '@/views/Category.vue'
import Dish from '@/views/Dish.vue'
import AddDish from '@/components/AddDish.vue'
import Setmeal from '@/views/Setmeal.vue'
import AddSetmeal from '@/components/AddSetmeal.vue'

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
      },
      {
        path: 'dish',
        component: Dish
      },
      {
        path: 'addDish',
        component: AddDish
      },
      {
        path: 'setmeal',
        component: Setmeal
      },
      {
        path: 'addSetmeal',
        component: AddSetmeal
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
