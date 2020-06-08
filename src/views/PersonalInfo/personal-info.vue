<template>
  <div>
    <div class="personal_content loading">
        <h3>基本信息</h3>
        <div class="info">
          <div class="avatar">
            <img :src="'http://47.107.235.13:80'+infoList.avatar"/>
            <div class="avatar-btn">
              <input type="file" style="display:none" ref="file" @change="changeAvatar" accept="image/*">
              <el-button @click="change" size="mini" type="primary">更换头像</el-button>
            </div>
          </div>
          <div >
            <p>用户名：&nbsp;&nbsp;{{ infoList.username }}</p>
            <p>常用联系人：&nbsp;&nbsp;{{ infoList.contactPerson }}</p>
            <p>常用联系号码：&nbsp;&nbsp;{{ infoList.contactWay }}</p>
            <p>常用联系地点：&nbsp;&nbsp;{{ infoList.contactPlace }}</p>
          </div>      
      </div>               
      <div class="edit">
        <el-button size="small" @click="edit">编辑</el-button>
      </div>
    </div>
    

    <!-- 组件 -->
    <edit-info ref="editInfo" v-on:reloadData="getPersonalInfo"></edit-info>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
import EditInfo  from "../PersonalInfo/edit-info";
export default {
  name: "personalMessage",
  components:{
    EditInfo
  },
  data() {
    return {
      infoList:{}
    };
  },
  created() {
    this.getPersonalInfo()
  },
  methods:{
    // 获取用户信息
    getPersonalInfo() {
      this.$http.personalInfo({ id: VueCookies.get('userId')}).then( r => this.infoList = r.data)
    },
    // 点击跟换头像按钮
    change() {
      this.$refs.file.click()
    },
    // 更换头像
    changeAvatar() {
      let render = new FileReader()
      render.readAsDataURL(this.$refs.file.files[0])
      render.onload = ( () =>{
        this.infoList.avatar = render.result
      })
      let formData = new FormData()
      formData.append("file",this.$refs.file.files[0])
      formData.append("userId",VueCookies.get('userId'))
      this.$http.changeAvatar(formData).then( r =>{
        VueCookies.set("userAvatar",r.data.avatar)
        this.getPersonalInfo()
      })
    },
    edit() {
      this.$refs.editInfo.show()
    }
  }
};
</script>

<style scoped>
.el-card__body {
  /* margin-left: -20px */
}
.personal_content {
  width: 100%;
  border-top: none;
  font-size: 14px;
  padding: 25px 50px 30px;
  box-sizing: border-box;
  box-shadow: 0 0px 18px 0 rgba(7,17,27,.1);
  border-radius:12px;
  margin-top:20px;
}
.personal_content h3{
  font-size:14px;
}

.personal_content .info{
  /* text-align:center; */
  display:flex;
  justify-content:center;
  margin-top:50px;
}
.personal_content .info .avatar {
  margin-right:60px;
  margin-top:20px;
  
}
.personal_content .info .avatar img {
  width: 90px;
  height: 90px;
  /* border-radius:50%; */
}
.personal_content .info .avatar-btn{
  margin:5px;
}
.personal_content  p {
  padding:10px 0px;
}


.edit{
  /* margin-top: 10px; */
  text-align: right;
  margin-top: 90px;
}

</style>