import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

const app = createApp(App)
const vuetify = createVuetify({
  components,
  directives
})

app.use(router).use(vuetify).use(Toast, { newestOnTop: true }).use(VueSweetalert2)

app.mount('#app')
