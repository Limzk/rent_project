<template>
  <el-dialog
    title="编辑基本信息"
    :visible.sync="active"
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <el-form :model="form" label-width="100px" class="demo-dynamic" ref="form" :rules="rules" status-icon>
      <!-- <el-form-item label="用户名">
        <el-input v-model="form.username"></el-input>
      </el-form-item> -->
      <el-form-item label="常用联系人">
        <el-input v-model="form.contactPerson"></el-input>
      </el-form-item>
      <el-form-item label="常用联系号码" prop="contactWay">
        <el-input v-model="form.contactWay"></el-input>
      </el-form-item>
      <el-form-item label="常用联系地点">
        <el-input v-model="form.contactPlace" maxlength="26" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submitForm('form')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import VueCookies from "vue-cookies";
export default {
  data() {
    var validateNumber = (rule, value, callback) => {
      if ( value && !(/^1(3|4|5|7|8)\d{9}$/.test(value))) {
        callback("请输入正确的手机号码");
      } else {
        callback();
      }
    };
    return {
      active: false,
      form: {
        // contactWay: ""
      },
      rules: {
        contactWay: [
          { required: false, validator: validateNumber, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    show() {
      this.active = true;
      this.$http.personalInfo({ id: VueCookies.get('userId')}).then( r => this.form = r.data)
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form.id = VueCookies.get('userId')
          this.$http.editInfo(this.form).then( r => {
            this.active = false
            this.$message.success("编辑成功！")
            this.$emit("reloadData")
          })
        } else {
          return false;
        }
      });
    },
    closeDialog() {
      this.back();
    },
    cancel() {
      this.back();
    },
    // 清空关闭
    back() {
      this.$refs.form.resetFields();
      this.form = {}
      this.active = false;
    }
  }
};
</script>

<style scoped>
.demo-dynamic {
  padding-right: 30px;
}
</style>