import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import ECharts from 'vue-echarts'
import '../vue.config'
import zhCn from 'element-plus/es/locale/lang/zh-cn'


const app = createApp(App)

app
        .use(store)
        .use(router)
        .use(ElementPlus,{locale: zhCn,})
        .component('v-chart', ECharts)
        .mount('#app')
