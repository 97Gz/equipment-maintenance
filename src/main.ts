import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import Vant from 'vant'
import '@vant/touch-emulator' // 直接导入模块，不用解构，它没有命名导出
import './utils/mock' // 引入Mock服务
import './style.css'
import 'vant/lib/index.css'
import App from './App.vue'

const app = createApp(App)

// 注册Pinia状态管理
app.use(createPinia())

// 注册路由
app.use(router)

// 注册Vant UI组件库
app.use(Vant)

// 挂载应用
app.mount('#app')
