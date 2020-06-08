<template>
  <div class="register_content">
    <div class="title">
      <div class="register">
        <p>欢迎注册</p>
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
      <div class="register_font">
        <span>欢迎注册</span>
      </div>
      <el-menu-item style="float:right" @click="goHome">前往首页</el-menu-item>
    </el-menu> -->
    <div class="register_form">
      <el-steps :active="active" finish-status="success">
        <el-step title="填写用户名"></el-step>
        <el-step title="填写密码"></el-step>
        <el-step title="注册成功"></el-step>
      </el-steps>
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        :rules="rules"
        @submit.native.prevent  
      >
      <!-- 防止按下回车键自动提交表单 -->
        <div v-if="active == 0">
          <el-form-item prop="username" class="register_username">
            <el-input v-model="ruleForm.username" placeholder="请输入用户名" type="text" ref="usernameInput" @keyup.enter.native="nextStep('ruleForm')"></el-input>
          </el-form-item>
        </div>
        <div v-if="active == 1">
          <el-form-item prop="password" class="register_password">
            <el-input v-model="ruleForm.password" placeholder="请输入密码" type="password" @keyup.enter.native="goCheckPass"></el-input>
          </el-form-item>
          <el-form-item prop="checkPass" class="register_password">
            <el-input v-model="ruleForm.checkPass" placeholder="请确认密码" type="password" ref="passInput"  @keyup.enter.native="nextStep('ruleForm')"></el-input>
          </el-form-item>
        </div>
        <div class="success" v-if="active == 3">
          <el-button icon="el-icon-check" circle type="success" size="small"></el-button>
          <span>恭喜，注册成功！请前往登录</span>
        </div>

        <el-form-item>
          <el-button type="primary" @click="nextStep('ruleForm')">{{active == 3?'前往登录':'下一步'}}</el-button>
        </el-form-item>
      </el-form>

      <div class="login">
        <p>已有账号？</p>
        <a @click="login">前往登录</a>
      </div>
    </div>
  </div>
</template>

<script>
import { register } from "@/utils/api";
export default {
  data() {
    var checkUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };
    var checkPassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    var checkPassAgain = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码！"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      active: 0,
      ruleForm: {
        username: "",
        password: "",
        checkPass: ""
      },
      rules: {
        username: [{ validator: checkUsername, trigger: "blur" }],
        password: [{ validator: checkPassword, trigger: "blur" }],
        checkPass: [{ validator: checkPassAgain, trigger: "blur" }]
      }
    };
  },

  mounted() {
    // this.usernameInputFocus()
  },
  methods: {
    login() {
      this.$router.push("login");
    },
    nextStep(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false;
        }
        //为0时点下一步默认提交表单数据查询数据库是否已有该用户名
        if( this.active == 0 ) {
          this.$http.checkUsername({
            username: this.ruleForm.username
          }).then ( res => {
            if( res.code === 30001 ){
              this.$message({
                message:'该用户名已存在！',
                type:'error',
              })
              return false
            }
            else{
              this.active ++
            }
          }).catch ( err => {
            this.$message( {
              message: '服务器繁忙，请稍后重试！',
              type: 'error',
            })
          })
          return false 
        }
        //为1时，表注册成功，将用户名及密码提交到服务器
        if( this.active == 1 ) {
          this.$http.register({
            username: this.ruleForm.username,
            password: this.ruleForm.password
          }).then ( res => {
            this.active = this.active + 2
          })
        }
        //为3时，点前往登录即跳转
        if ( this.active === 3) {
          this.$router.push("login");
        }       
      });
    },
    goLogin() {
      this.$router.push("login");
    },
    goHome() {
      this.$router.push("home");
    },
    usernameInputFocus() {
      this.$refs.usernameInput.focus()
    },
    goCheckPass() {
      this.$refs.passInput.focus()
    }
  }
};
</script>

<style  >
.register_content .title{
  height: 50px;
  background: #333;
  padding:  0 20px; 
  line-height: 50px;
  font-size: 13px;
}
.register_content .title .home{
  float: right;
}
.register_content .title .home a{
  color: #f4f4f4;
}

.register_content .title .register{
  float: left;
  color: #f4f4f4;
}
.register_font {
  float: left;
  font-size: 14px;
  margin-top: 20px;
  margin-left: 15px;
  color: #fff;
}
.register_form {
  /* background: #fff; */
  height: 339px;
  width: 404px;
  margin: 100px auto;
  padding: 20px;
  border-radius: 5px;
}
.register_form .el-step__main .el-step__title {
  font-size: 12px;
}

.register_form .register_username {
  width: 381px;
  margin-top: 70px;
}
.register_form .register_password:nth-child(1) {
  width: 381px;
  margin-top: 40px;
}
.register_form .register_password:nth-child(2) {
  width: 381px;
  margin-top: 30px;
  margin-bottom: -10px;
}
.register_form .el-form-item__content {
  margin-left: 0px !important;
}
.register_form .el-form-item__content .el-button {
  width: 381px;
  margin-top: 40px;
  /* margin-bottom: 10px; */
  display: table;
}
.success {
  margin-left: 67px;
  margin-top: 80px;
  margin-bottom: 20px;
}
.success span {
  font-size: 16px;
  color: green;
  /* font-weight: 20px */
}
.register_form .login {
  /* border-top: 1px solid #f4f4f4; */
  /* background-color: #fcfcfc; */
  height: auto;
  text-align: center;
  color: #aaa;
  width: 381px;
  height: 40px;
  line-height: 40px;
}

.register_form .login p {
  display: inline-block;
  font-weight: 600;
  font-size: 14px;
}
.register_form .login a {
  text-decoration: none;
  color: #409eFF;
  cursor: pointer;
}
</style>