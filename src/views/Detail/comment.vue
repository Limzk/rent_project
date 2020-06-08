<template>
  <el-dialog title="评论" width="500px" :visible.sync="active" :close-on-click-modal="false">
    <el-input
      type="textarea"
      :rows="5"
      :placeholder=" '回复'+placeName +':'"
      v-model="formData.content"
      maxlength="88"
      show-word-limit
      @keyup.enter.native="submit"
      resize="none"
      ref="inputFocus"
    ></el-input>
    <div class="dialog-footer">
        <el-button type="primary" @click="submit" size="mini" :disabled="formData.content === ''">提交</el-button>
    </div>

  </el-dialog>
</template>
<script>
import VueCookies from "vue-cookies";
export default {
  data() {
    return {
      active: false,
      placeName: '',
      formData:{
        content: "",
      }
    };
  },
  methods: {
    show(data) {
      this.active = true;
      this.formData.content = ''
      this.formData.commentId = data[0]
      this.formData.toUid = data[1]
      this.placeName = data[2]
      this.$nextTick( () =>{
          this.$refs.inputFocus.focus()
      })
    },
    submit() {
      this.formData.fromUid = VueCookies.get('userId')
      this.$http.reply(this.formData).then( r =>{
        this.$message.success("评论成功！")
        this.active = false;
        this.$emit("reload")
      })
      
    }
  }
};
</script>
<style  scoped>
/* .el-dialog__body{
    padding: 0px;
} */
.comment {
  margin: 0 auto;
  width: 90%;
  height: 200px;
  border: 1px solid black;
}
.dialog-footer {
  width: 100%;
  height: 60px;
  /* background: red; */
  position: relative;
  /* text-align: right; */
}
.dialog-footer .el-button{
  position: absolute;
  right: 0;
  bottom: 0;
}
</style>