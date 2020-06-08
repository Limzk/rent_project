import Vue from 'vue'
import Router from 'vue-router'
import home from '@/views/Home/home'
import search from '@/views/Search/search'
import searchDetail from '@/views/Search/search-detail'
import login from '@/views/Login/login'
import register from '@/views/Register/register'
import detail from '@/views/Detail/detail'
import personal from '@/views/PersonalCentral/personalCenter'
import message from '@/views/MyMessage/message'
import commentMessage from '@/views/MyMessage/comment-message'
import noticeMessage from '@/views/MyMessage/notice-message'
import personalInfo from '@/views/PersonalInfo/personal-info'
import uploadItem from '@/views/UploadItem/upload-item'
import myPublish from '@/views/MyPublish/myPublish'
import soldOut from '@/views/SoldOut/sold-out'
import auditing from '@/views/Auditing/auditing'


Vue.use(Router)

export default new Router({
  //去掉地址中的哈希#
  mode: 'history',
  routes: [
    {
      path: '/',
      // name: 'home',
      component: home,
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: home
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/search',
      name: 'search',
      component: search
    },
    {
      path: '/searchDetail',
      name: 'searchDetail',
      component: searchDetail
    },
    {
      path: '/detail',
      name: 'detail',
      component: detail
    },
    {
      path: '/personal',
      component: personal,
      name: "personal",
      redirect:'/personal/personalInfo',
      children:[
        { path: 'personalInfo', name:'personalInfo', component: personalInfo},
        { path: 'myPublish', name:'myPublish', component: myPublish},
        { path: 'auditing', name:'auditing', component: auditing},
        { path: 'soldOut', name:'soldOut', component: soldOut},
      ]
    },
    {
      path: '/uploadItem',
      name: 'uploadItem',
      component: uploadItem,
    },
    {
      path: '/message',
      name: 'message',
      component: message,
      redirect:'/message/commentMessage',
      children:[
        {path:'commentMessage',name:'commentMessage',component:commentMessage},
        {path:'noticeMessage',name:'noticeMessage',component:noticeMessage},
      ]
    },
    
  ]
})
