import Axios from 'axios';
import VueCookies from 'vue-cookies';
import Vue from 'vue'


//设置Axios默认值
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'


// loading框设置局部刷新，且所有请求完成后关闭loading框
let loading;
function startLoading() {
  loading = Vue.prototype.$loading({
    lock: true,
    text: "Loading...",
    target: document.querySelector('.loading')//设置加载动画区域
  });
}
function endLoading() {
  loading.close();
}

// 添加请求拦截器
Axios.interceptors.request.use( config => {
    // 在发送请求之前做些什么
    // var username = VueCookies.get("username");
    if(VueCookies.isKey('token')) {
      config.headers['Authorization'] = VueCookies.get('token');
    }
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
Axios.interceptors.response.use( response => {
    // 对响应数据做点什么
    // startLoading()
    // if(response.status === 200) endLoading()
    return response;
  }, error => {
    // 对响应错误做点什么
    // endLoading()
    return Promise.reject(error);
  });

export default Axios

