// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI, { TabPane } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import store from './store'
import $ from 'jquery'
import '@/style/global.css'   //global style
import '@/icon/iconfont.js'   // global icon
// import * as api from '@/utils/api'
import * as api from '@/request/request'
import VueCookies from 'vue-cookies'

import header from '@/components/header' //global component
import location from '@/components/location' //global component
import store from './store'
import md5 from 'js-md5'

Vue.component(header.name,header)
Vue.component(location.name,location)

Vue.prototype.$http = api

Vue.prototype.$md5 = md5
window.$ = $
Vue.config.productionTip = false  //阻止启动生产消息


Vue.use(ElementUI)
Vue.use(VueCookies)

//路由守卫
router.beforeEach((to,from,next) =>{
  // if(to.name !=="home" && to.name !== "detail"){
  //   sessionStorage.setItem("page",1) 
  // }
  next()
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
