import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(fas, far)

import * as IconPark from '@icon-park/vue-next'
import Directive from '@/directives'
// import 'animate.css'

import '@/assets/styles/index.scss'

const app = createApp(App)

Object.keys(IconPark).forEach(key => {
  app.component(key, IconPark[key as keyof typeof IconPark])
})

app.component('FontAwesomeIcon', FontAwesomeIcon)
app.use(createPinia())
app.use(Directive)
app.mount('#app')
