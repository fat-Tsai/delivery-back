import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入并注册 ElementUI 组件库
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 导入全局样式表
import '@/assets/css/global.css'
// 导入iconfont库的样式文件
import '@/assets/iconfont/iconfont.css'
// 导入全局变量
import global from '@/common/global'
// 将全局变量挂载到Vue上
Vue.prototype.$GLOBAL = global

Vue.config.productionTip = false
Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
