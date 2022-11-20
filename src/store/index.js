import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: sessionStorage.getItem('userInfo') || '',
    isLogin: !!sessionStorage.getItem('userInfo') || false
  },
  getters: {
    getName: state => {
      return JSON.parse(state.userInfo).name
    }
  },
  mutations: {
    updateUserInfo (state, playload) {
      state.userInfo = playload
      this.commit('saveUserInfo')
    },
    saveUserInfo (state) {
      // localStorage.setItem('userInfo', state.userInfo)
      sessionStorage.setItem('userInfo', state.userInfo)
    }
  },
  actions: {
  },
  modules: {
  }
})
