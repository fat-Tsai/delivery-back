import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入并注册 ElementUI 组件库
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 导入全局样式表
import '@/assets/css/global.css'

Vue.config.productionTip = false
Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
