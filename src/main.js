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
import VueLazyload from 'vue-lazyload'

const app = createApp(App)
const vuetify = createVuetify({
  components,
  directives
})

app
  .use(router)
  .use(vuetify)
  .use(Toast, { newestOnTop: true })
  .use(VueSweetalert2)
  .use(VueLazyload, {
    preLoad: 1.3,
    error: './assets/images/loading-image.gif',
    loading:
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.superiorlawncareusa.com%2Fwp-content%2Fuploads%2F2020%2F05%2Floading-gif-png-5.gif&f=1&nofb=1&ipt=251ca2387ce67e804b94ac35b57909055f49565b0fc63ce981c6dafd8789f858&ipo=images',
    attempt: 1,
    listenEvents: ['scroll']
  })

app.mount('#app')
