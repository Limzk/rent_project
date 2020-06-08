<template>
  <div >
    <layout></layout>
    <div class="container">
    <div class="nav">
      <el-aside width="auto">
        <div class="asideAvatar">
          <el-avatar :size="85"  :src="'http://47.107.235.13:80'+userAvatar" fit="cover" ></el-avatar>
        </div>
        <el-menu :default-active="activeIndex"  class="el-menu-vertical-demo"   background-color="#fff"  text-color="#000"  active-text-color="#ffd04b" @select="changeSelect">
          <router-link v-for="(item,index) in navList" :to="item.path" :key="index" >
            <el-menu-item :index="item.index" class="titleContent">
              <i :class="item.class" ></i>
              <span slot="title" >{{ item.title }}</span>
            </el-menu-item>
          </router-link>
        </el-menu>
        <!-- <div class="asideAvatar">
        </div> -->
      </el-aside>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
    </div>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
export default {
  name: "personal",
  data() {
    return {
      activeIndex: "1",
      navList: [
        {title:"个人信息",path:"/personal/personalInfo",class:"el-icon-s-custom",index:"1"},
        {title:"我的发布",path:"/personal/myPublish",class:"el-icon-edit-outline",index:"2"},
        {title:"待审核物品",path:"/personal/auditing",class:"el-icon-view",index:"3"},
        {title:"下架物品",path:"/personal/soldOut",class:"el-icon-sort-down",index:"4"},
        // {title:"修改密码",path:"/personal/personalMessage",class:"el-icon-s-tools",index:"4"},
      ],
      userAvatar: ''
    };
  },
  watch:{

  },
  created() {
    // 刷新页面，激活图标
    if(sessionStorage.getItem("navIndex"))  this.activeIndex = sessionStorage.getItem("navIndex")
    this.getAvatar() 
  },
  destroyed() {
    sessionStorage.removeItem("navIndex")
  },
  methods: {
    getAvatar() {
      this.userAvatar = VueCookies.get('userAvatar')
    },
    // 点击菜单事件
    changeSelect(index) {
      sessionStorage.setItem("navIndex",index)
    },
    personalMessage() {
      // this.$router.push('personal/personalMessage')
    },

  }
};
</script>

<style scoped>
body {
  /* height:100%;
  background-color: pink; */
}
.container{
  width: 80%;
  margin: 0 auto;
 
  /* border: 2px solid #efefef; */
  /* border-top: none; */
}
.container:after{
  display: block;
  content:'';
  clear: both;
}
.container .nav{
  width: 19%;
  float:left;
  margin-top:20px;
  border: 2px solid #efefef;
  /* border-top:none; */
  border-radius:5px;

}
.container .nav span{
  /* color:#303133; */
}
.container .nav .el-menu-vertical-demo{
  /* color:#303133; */
  /* border-left: 2px solid #efefef; */
  border: none;
  overflow: hidden;
}
.container .nav .el-menu-vertical-demo .titleContent{
  font-size: 11px;
}

.container .content{
  width: 80%;
  float: right;
}
.container .nav .router-link-active span{
  color:rgb(255, 208, 75);
}
.container .nav .el-menu-item{
  /* border-top:1px solid #a8a8a887; */
}
.container .nav a:last-child li{
   /* border-bottom:1px solid #a8a8a887; */
}

.asideAvatar {
  padding:50px 0;
  /* height: 105px; */
  /* border: 1px solid #efefef; */
  border-top:none;
  text-align: center;
  overflow: hidden;
}
.asideAvatar:first-child {
  border-bottom:none;
}
.asideAvatar .el-button {
  height: 20px;
  padding-top: 4px;
  margin-top: 12px;
}

</style>