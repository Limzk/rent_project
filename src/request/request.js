
import Axios from '../utils/api'

// 登录接口
export function login(params) {
    return Axios.get('/api/user/login', { params } ).then( res => res.data )
}
// 注册判断用户名接口
export function checkUsername(params) {
    return Axios.get('/api/user/check', { params } ).then( res => res.data )
}
// 注册插入接口
export function register(params) {
    return Axios.post('/api/user/register', params).then( res => res.data )
}
// 获取首页数据
export function getItemList(params) {
    // return Axios.get('/api/item/list', { params }).then( res => res.data)
    return Axios({
        url: '/api/item/list',
        method: 'get',
        disabledAutoMessage: true,
        params
    }).then( res => res.data)
}
// 获取首页未读消息总数
export function  messageCount(params) {
    return Axios.get('/api/message/unread/count', {params}).then( res => res.data)
}
// 获取用户状态
export function  getUserstate(params) {
    return Axios.get('/api/user/state', {params}).then( res => res.data)
}
// 获取详情
export function getDetailList(params) {
    return Axios.get('/api/item/info', { params }).then( res => res.data)
}
// 获取评论列表
export function getCommentList(params) {
    return Axios.get('/api/comment/list', { params }).then( res => res.data)
}
// 获取回复列表
export function getReplytList(params) {
    return Axios.get('/api/reply/list', { params }).then( res => res.data)
}
// 添加评论
export function comment(params) {
    return Axios.post('/api/comment/insert', params).then( res => res.data)
}
// 添加回复
export function reply(params) {
    return Axios.post('/api/reply/insert', params).then( res => res.data)
}
// 点赞评论
export function thumbsUpComment(params) {
    return Axios.post('/api/comment/thumbsUp', params).then( res => res.data)
}
// 点赞回复
export function thumbsUpReply(params) {
    return Axios.post('/api/reply/thumbsUp', params).then( res => res.data)
}
// 个人中心获取信息
export function personalInfo(params) {
    return Axios.get('/api/user/info', {params}).then( res => res.data)
}
// 个人中心更换头像
export function changeAvatar(params) {
    return Axios.post('/api/user/upload', params).then( res => res.data)
}
// 个人中心编辑基本信息
export function editInfo(params) {
    return Axios.post('/api/user/update', params).then( res => res.data)
}
// 查看物品列表
export function itemList(params) {
    return Axios.get('/api/item/list',{params}).then( res => res.data)
}
// 查看物品详情
export function itemDetail(params) {
    return Axios.get('/api/item/info', { params }).then( res => res.data)
}
// 更改物品
export function itemUpdate(params) {
    return Axios.post('/api/item/update', params).then( res => res.data)
}
// 发布物品
export function uploadItem(params) {
    return Axios.post('/api/item/insert', params).then( res => res.data)
}
// 删除物品
export function deleteItem(params) {
    return Axios.post('/api/item/delete', params).then( res => res.data)
}
// 获取消息中心列表
export function messageList(params) {
    return Axios.get('/api/message/list', {params}).then( res => res.data)
}
// 获取消息详情
export function reloadMessage(params) {
    return Axios.post('/api/message/adjust', params).then( res => res.data)
}



