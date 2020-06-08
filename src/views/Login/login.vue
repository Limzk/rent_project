<template>
  <div class="login_content">
    <div class="title">
      <div class="login">
        <p>欢迎登录</p>
      </div>
      <div class="home">
        <a href="/home" >前往首页</a>
      </div>
    </div>
    <!-- <el-menu
      class="el-menu-demo"
      mode="horizontal"
      background-color="#464c5b"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <div class="login_font">
        <span>欢迎登录</span>
      </div>
      <el-menu-item style="float:right" @click="goHome">前往首页</el-menu-item>
    </el-menu> -->
    <div class="login_form">
      <el-form
        :model="ruleForm"
        status-icon
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        :rules="rules"
      >
        <p>用户名</p>
        <el-form-item prop="username">
          <el-input
            type="text"
            v-model="ruleForm.username"
            autocomplete="off"
            placeholder="请输入用户名"
            ref="usernameInput"
            @keyup.enter.native="toPassword"
          ></el-input>
        </el-form-item>
        <p>密码</p>
        <el-form-item prop="pass">
          <el-input
            type="password"
            v-model="ruleForm.pass"
            autocomplete="off"
            placeholder="请输入密码"
            ref="passwordInput"
            @keyup.enter.native="submitForm('ruleForm')"
          ></el-input>
        </el-form-item>
        <!-- <el-checkbox v-model="checked">记住密码</el-checkbox> -->
        <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
      </el-form>

      <div class="register">
        <p>没有账号？</p>
        <a @click="register">前往注册</a>
      </div>
    </div>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
import defaultAvatar from "../../assets/default.jpg";
import { login } from "@/utils/api"
export default {
  data() {
    var checkPassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    var checkUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        pass: "",
        username: "",
        checked: false
      },
      rules: {
        pass: [{ validator: checkPassword, trigger: "blur" }],
        username: [{ validator: checkUsername, trigger: "blur" }]
      },
    };
  },
  mounted() {
    // this.usernameInputFocus()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http.login({
            username: this.ruleForm.username,
            password: this.$md5(this.ruleForm.pass)
          }).then( r => {
            if( r.code === 10000) {
              this.$message({
                message: '登录成功',
                type: 'success',
              })
            //初始化sessionStorage存储的index
            sessionStorage.setItem("index",1)
            sessionStorage.setItem("page",1)
            sessionStorage.removeItem("itemType")
            VueCookies.set("username", r.data.username);
            // VueCookies.set("token"+ r.data.username,r.data.token);
            VueCookies.set("token",r.data.token);
            VueCookies.set("userId", r.data.userId);
            if(!r.data.avatar) {
              this.setDefaultAvatar()
            }
            else{
              VueCookies.set("userAvatar",r.data.avatar)
              this.$router.push('home')
            }
            // r.data.avatar?VueCookies.set("userAvatar",r.data.avatar):this.setDefaultAvatar()          
            }
            else{
              this.$message({
                message: '用户名或密码错误!',
                type: 'error',
              })
            }
          })

        } else {          
          return false;
        }
      });
    },
    // 设置默认头像
    setDefaultAvatar() {
      let formData = new FormData()
      formData.append("file",this.base64ImgtoFile(defaultAvatar))
      formData.append("userId",VueCookies.get('userId'))
      this.$http.changeAvatar(formData).then( r => {
        VueCookies.set("userAvatar",r.data.avatar)
        this.$router.push('home')
      })
    },
    // 64编码转文件型
    base64ImgtoFile(dataurl, filename = 'file') {
        let arr = dataurl.split(',')
        let mime = arr[0].match(/:(.*?);/)[1]
        let suffix = mime.split('/')[1]
        let bstr = atob(arr[1])
        let n = bstr.length
        let u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new File([u8arr], `${filename}.${suffix}`, {
          type: mime
        })
    },
    usernameInputFocus() {
      this.$refs.usernameInput.focus();
    },
    register() {
      this.$router.push("register");
    },
    goHome() {
      this.$router.push("home");
    },
    toPassword() {
      this.$refs.passwordInput.focus();
    }
  }
};
</script>

<style >
.login_content .title{
  /* width: 100%; */
  height: 50px;
  background: #333;
  padding:  0 20px; 
  
  line-height: 50px;
  font-size: 13px;
}
.login_content .title .home{
  float: right;
}
.login_content .title .home a{
  color: #f4f4f4;
}

.login_content .title .login{
  float: left;
  color: #f4f4f4;
}
.login_font {
  float: left;
  font-size: 14px;
  margin-top: 10px;
  margin-left: 15px;
  color: #fff;
}
.login_form {
  background: #fff;
  height: 294px;
  width: 330px;
  border: 1px solid #d8dee2;
  /* position: relative;
  top: 120px; */
  /* left: 100px; */
  float: right;
  margin-right: 120px;
  margin-top: 100px;
  padding: 25px 20px;
  border-radius: 10px;
  
}
.login_form p {
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  margin: 10px 0;
}
.login_form .el-form-item__content {
  margin-left: 0px !important;
}
.login_form .el-button {
  width: 330px;
  margin: 35px auto;
  display: table;
}
.login_form .register {
  border-top: 1px solid #f4f4f4;
  background-color: #fcfcfc;
  height: auto;
  text-align: center;
  color: #aaa;
}

.login_form .register p {
  display: inline-block;
}
.login_form .register a {
  color: #409eff;
  cursor: pointer;
  font-size: 15px;
}
</style>