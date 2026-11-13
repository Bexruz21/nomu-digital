import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import './workbench.css'
import { installI18n } from './i18n.js'

const app = createApp(App)
installI18n(app)
app.mount('#app')
