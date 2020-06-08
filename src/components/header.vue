<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
    active-text-color="#1fad4e"
    text-color="#000"
  >
    <el-menu-item  @click="goHome(item.title)" v-for="(item,i) in typeList"  :index="item.index" :key="i" >{{ item.title }}</el-menu-item>
      <el-submenu index="3" style="float:right" v-if="username !==''">
        <template slot="title">{{ username }}</template>
        <el-menu-item index="2-1" @click="enterPersonal" style="width:100%">个人中心</el-menu-item>
        <el-menu-item index="2-4" @click="wantRent" style="width:100%">我要发布</el-menu-item>
        <el-menu-item index="2-2" @click="myMessage" style="width:100%" class="loading">信息中心
          <el-button size="mini" type="danger" circle class="badge_btn" v-show="count !== 0">{{ count }}</el-button>
        </el-menu-item>
        <el-menu-item  @click="logout" style="width:100%">退出登录</el-menu-item>
      </el-submenu>
      <el-avatar
        v-if="username !==''"
        :size="30"
        :src="'http://47.107.235.13:80'+userAvatar"
        fit="cover"
        
      ></el-avatar>

    <div class="header_user" v-if="username ===''">
      <a  @click="goLogin">登录&nbsp;</a>
      <span>|</span>
      <a @click="goRegister">&nbsp;注册</a>
    </div>

    <div class="header_input" >
      <el-input v-model="keyword" placeholder="请输入物品名称" @keyup.enter.native="search" clearable>
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </div>
  </el-menu>
</template>

<script>
import VueCookies from "vue-cookies";
import { mapState } from 'vuex'
export default {
  name: "layout",
  data() {
    return {
      keyword: "",
      show: true,
      username: '',
      count: 0,
      typeList:[
        { title: '全部' , index: "1"},
        { title: '体育器材' , index: "2"},
        { title: '电子产品' , index: "3"},
        { title: '生活用品' , index: "4"},
        { title: '书籍' , index: "5"},
        { title: '其他' , index: "6"},
      ],
      userAvatar:'',
    };
  },
  computed: {
    // ...mapState(['index']),
    activeIndex() {
      return this.$store.state.index.toString();
    }
  },
  watch: {
    $route(to,from){
      console.log(to.path)
      console.log(from.path)
    }
  },
  created() {
    // 刷新页面
    this.getIndex();
    this.getUserInfo()
  },
  methods: {
    getIndex() {
      //刷新页面时获取index
      var getIndex = sessionStorage.getItem("index");  // null
      //当getIndex为空表示第一次打开页面，得到vuex存储的默认值index=1
      if (getIndex) {
        this.$store.dispatch("changIndexAc", getIndex);
      }
      // else {
      //   this.$store.dispatch("changIndexAc", 1)
      // }
      // getIndex === null ?this.$store.dispatch("changIndexAc", 1):this.$store.dispatch("changIndexAc", getIndex);
    },
    // 获得用户信息
    getUserInfo() {
      // VueCookies.set('username',"lim")       //测试用
      if(VueCookies.isKey('username')) {
          this.username = VueCookies.get('username')
          this.userAvatar = VueCookies.get('userAvatar')
          // 获取未读消息数量
          this.$http.messageCount({
            userId: VueCookies.get('userId'),
            state: 0
          }).then( r => {
            this.count = r
          })
          // 获取用户状态
          this.$http.getUserstate({userId:VueCookies.get('userId')}).then( r =>{
            let state = r.data.state
            if(state !== parseInt(VueCookies.get('userState')) && state === 0) {
                let time = this.parse(r.data.time)
                this.$confirm(`您的账号由于违反用户协议被限制发言与发布，已被限制${time}${time === 20?'秒':'天'}，请遵守协议`, '警告', {
                  showCancelButton: false,
                  showClose:false,
                  closeOnClickModal:false,
                  confirmButtonText: '确定',
                  type: 'warning',
                  center: true
                }).then(() => {
              })
            }
            VueCookies.set('userState',state)   
         })
      }
    },
    parse(time) {
      return time === 20? 20: time/60/60/24
    },
    goLogin() {
      this.$router.push("login");
    },
    goRegister() {
      this.$router.push("register");
    },
    // 进入不同路由后切换导航栏，页码重新设置为 1
    goHome(title) {
      sessionStorage.setItem("page",1)
      sessionStorage.setItem("itemType",title)
      this.$router.push({ name:"home" });
      // 在相同home路由切换导航栏，页码通过子组件传参重新设置为1
      this.$emit('setPage',title)
      
    },
    wantRent() {
      this.$router.push({ path: "/uploadItem" });
    },
    myMessage() {
      this.$router.push({ name:"message" })
    },
    search() {
      // this.$emit('setPage',"全部",this.keyword)
      let routeData = this.$router.resolve({
          path: "/search",
          query:{ keyword:this.keyword }
        });
        window.open(routeData.href, '_blank');
    },
    handleSelect(index) {
      //将当前点击的菜单index存储到sessionStorage中
      sessionStorage.setItem("index", index);
      //将当前点击的菜单index存储到Vuex中
      // this.$store.dispatch('changIndexAc',index)
    },
    enterPersonal() {
        this.$router.push({name:"personal"});
    },
    logout() {
      this.$confirm("是否退出当前用户？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          this.show = false;
          this.$message({
            message: "退出成功!",
            type: "success"
          });
          // 重定向
          sessionStorage.setItem("page",1)
          sessionStorage.setItem("index",1)
          sessionStorage.removeItem("itemType")
          VueCookies.remove('username')
          VueCookies.remove('token')
          VueCookies.remove('userId')
          this.$router.push({name:"home"});
          // 重新刷新页面
          this.$router.go(0)
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped>

.el-menu-demo {
  padding: 0 20px;
  box-shadow: 0 8px 16px 0 rgba(28,31,33,.1);
}
.el-menu-demo .el-menu-item {
  margin-right: 30px;
}
.el-menu-demo .el-menu-item:first-child {
  margin-left: 26px;
}
.el-avatar--circle {
  float: right;
  margin-top: 15px;
}
.header_user {
  float: right;
  font-size: 14px;
  margin-top: 20px;
  margin-right:10px;
  color:#000;
}

.header_user a {
  cursor: pointer;
  color:#000;
}
.header_right a:hover {
  color: yellow;
}
.header_input {
  float: right;
  margin-top: 10px;
  margin-right: 40px;
  display:flex;
}
.header_input >>>.el-cascader--mini{
  line-height:none;
}
.header_input >>>.el-cascader--mini .el-input input{
  border-radius: none;
}
.el-button {
  /* float: right */
}
.badge_btn {
  padding: 1px;
  border-radius: 0;
  margin-top: -4px;
}

@media screen and (max-width: 1150px) {
  .header_input {
    display: none;
  }
}
</style>