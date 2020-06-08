<template>
  <div>
    <layout></layout>
    <div class="layout loading" :style="{ height: contentHeight }">
        <div class="my_message"  :style="{ height: contentHeight }">
            <h2>我的消息</h2>
                <ul>
                    <router-link :to="item.path" v-for="(item,index) in titleList" :key="index" @click.native="activeRouter(index)">
                        <li>
                            <i :class="[item.class]" style="font-size:13px;margin-right:8px;"></i>
                            {{ item.title }}
                            <el-badge class="mark" :value="item.count" v-show="item.count !== 0"/>
                        </li>
                    </router-link>
                </ul>
        </div>
        <div class="message_content" ref="contentHeight" v-show="show">
            <router-view :sendList="sendList" v-on:changPage="changPage"></router-view>
        </div>
    </div>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
export default {
    data() {
        return {
            contentHeight: 0,
            titleList:[
                { title:"评论",path:'/message/commentMessage', class: "el-icon-chat-line-square",count: 0},  
                { title:"通知",path:'/message/noticeMessage', class: "el-icon-bell", count: 0},
            ],
            userId:'',
            queryList: {
                page: 1,
                rows: 10
            },
            sendList: [],
            show:true,
        }
    },
    mounted() {
        this.$nextTick( () =>{
            this.getContentHeight()
        })
    },
    created() {
        this.userId = VueCookies.get('userId')
        this.queryList.userId = this.userId
        // 若刷新页面，重定位到之前点击的路由  若退出当前页面，则默认type为空默认加载评论通知
        sessionStorage.getItem('messageIndex')? this.getIndex(sessionStorage.getItem('messageIndex')):this.getMessageList()
    },
    destroyed() {
        sessionStorage.removeItem('messageIndex')
    },
    methods: {
        // 激活路由事件
        activeRouter(index) {
            sessionStorage.setItem('messageIndex',index)
            // 获取内容区高度
            // this.getContentHeight()
            // 传参
            this.getIndex(index)
        },
        // 调整导航条长度
        getContentHeight() {
            520 > this.$refs.contentHeight.clientHeight? this.contentHeight = 520 + 'px':this.contentHeight = this.$refs.contentHeight.clientHeight + 'px'
        },
        // 激活路由下标与传参type的关系 
        // type:    1---评论       2---通知   
        // index:   0---评论     1---通知     
        getIndex(index) {
            this.queryList = {
                rows: 10,
                page: 1,
                userId: this.userId,
                type: parseInt(index) + 1
            }
            this.reloadMessage(index)
        },
        // 进入消息中心获得数据
        getMessageList() {
            this.$http.messageList(this.queryList).then( r => {
                if(r.code === 10000) {
                    let _data = r.data.data[0]
                    this.titleList[0].count = _data.commentUnreadCount
                    this.titleList[1].count = _data.systemUnreadCount
                    // 传页码总数量以及显示内容
                    let dataList = {
                        total: r.data.totalCount,
                        messageList: _data.messageList
                    }
                    // 向子组件传值
                   this.sendList = dataList
                   this.$nextTick( () =>{
                        this.getContentHeight()
                    })
                }
            })
        },
        // 点击消息列表模块重新加载
        reloadMessage(index) {
            this.show = false
            this.$http.reloadMessage(this.queryList).then( r => {
                if( r.code === 10000) {                    
                    let _data = r.data.data[0]
                    this.titleList[index].count = 0
                    let dataList = {
                        total: r.data.totalCount,
                        messageList: _data.messageList
                    }
                    // 向子组件传值
                   this.sendList = dataList
                   this.show = true
                    this.$nextTick( () =>{
                        this.getContentHeight()
                        
                    })
                }
            })
        },
        // type:    1---评论       2---通知   
        // index:   0---评论     1---通知 
        // 页码改变
        changPage(page,index) {
            this.queryList.page = page
            this.queryList.state = index
            this.reloadMessage(index-1)
        }
    }
};
</script>

<style scoped>
.layout{
    width: 80%;
    /* height: 520px; */
    margin: 0 auto;
    border: 1px solid #dfdfdf;
    border-top:none;
    margin-bottom:10px;
}
.layout .my_message{
    width: 18%;
    /* height: 520px; */
    float:left;
    border-right: 1px solid #dfdfdf;
    padding-top: 50px;
    box-sizing: border-box;
}
.layout .my_message h2{
    font-size: 20px;
    font-weight: normal;
    height: 30px;
    text-align: center;
    margin: 16px 0;
}
.layout .my_message ul{
    text-align: center;
    padding: 0px;
}
.layout .my_message li{
    width: 100%;
    height: 53px;
    line-height: 53px;
    border-top: 1px solid #dfdfdf;
    font-size: 12px;
    color:black;
}
.layout .my_message ul:last-child{
    border-bottom: 1px solid #dfdfdf;
}
.layout .my_message li:hover{
    background: #f7f7f7;
}

.layout .message_content{
    width: 81%;
    /* height: 420px; */
    float:right;
    box-sizing: border-box;
    padding:82px 30px 0px;
    /* padding:30px;
    padding-top: 52px; */
    /* border-right: 1px solid #dfdfdf; */
}
.router-link-active li{
  background: #f7f7f7;
}

</style>