import { createStore } from 'vuex'

export const store = createStore({
  state: {
    baseUrl: 'http://localhost:8000/',
    isAuth: false
  },
  mutations: {
    login(state) {
      state.isAuth = true
    }
  },
  actions: {
    login(context) {
      context.commit('login')
    }
  }
})
