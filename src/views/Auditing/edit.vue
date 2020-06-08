<template>
  <el-dialog
    title="修改物品信息"
    width="600px"
    :visible.sync="active"
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-dynamic" :rules="rules">
      <div class="picture-show">
        <el-upload
          class="avatar-uploader"
          action="/api/item/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <img v-if="imageUrl" :src="'http://47.107.235.13:80'+imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
      <!-- 图片预览 -->
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt />
      </el-dialog>
      <!-- 表单提交内容 -->
      <div class="price">
        <el-form-item prop="itemName" label="物品名称" :rules="[{ required: true, message: '物品名称不能为空', trigger: 'blur' }]">
          <el-input v-model="ruleForm.itemName" style="width:180px;" maxlength="8" show-word-limit></el-input>
        </el-form-item>
        <el-form-item prop="price" label="价格" :rules="[{ required: true, message: '价格不能为空', trigger: 'blur' }]">
          <el-input v-model="ruleForm.price" style="width:180px;" oninput="value=value.replace(/[^0-9.]/g,'')" ></el-input>
          <span>元/{{ ruleForm.chargeType === "0"? "天":"时" }}</span>
        </el-form-item>
        <el-form-item>
          <el-radio-group v-model="ruleForm.chargeType">
            <el-radio label="0">按天收费</el-radio>
            <el-radio label="1">按时收费</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>

      <el-form-item  prop="itemTypeName"  label="物品类型"  style="clear:both"  :rules="[{ required: true, message: '请选择物品类型', trigger: 'change' }]">
        <el-select v-model="ruleForm.itemTypeName" placeholder="请选择物品类型">
          <el-option
            v-for="item in itemTypeName"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item  prop="deposit"  label="押金"    :rules="[{ required: true, message: '押金金额不能为空', trigger: 'blur' }]">
          <el-input  v-model="ruleForm.deposit"  oninput="value=value.replace(/[^0-9.]/g,'')"  ></el-input>
      </el-form-item>
      <el-form-item  prop="contactPerson"  label="联系人"  :rules="[{ required: true, message: '联系人不能为空', trigger: 'blur' }]" >
        <el-input v-model="ruleForm.contactPerson"></el-input>
      </el-form-item>
      <el-form-item  prop="contactWay"  label="联系号码"   >
        <el-input v-model="ruleForm.contactWay"></el-input>
      </el-form-item>
       <el-form-item prop="contactPlace"  label="联系地点" :rules="[{ required: true, message: '联系地点不能为空', trigger: 'blur' }]">
        <el-input  placeholder="请输入联系地点"  v-model="ruleForm.contactPlace"  maxlength="26"  show-word-limit  ></el-input>
      </el-form-item>
      <el-form-item  prop="describe" label="其他">
        <el-input  :rows="4"  type="textarea"  placeholder="例如对物品的描述或补充"  v-model="ruleForm.content"  maxlength="88"  show-word-limit  style="margin:5px 0"  resize="none"></el-input>
      </el-form-item>
      <el-form-item class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import VueCookies from "vue-cookies";
export default {
  data() {
    var validateNumber = (rule, value, callback) => {
      if(!value) {
        callback("联系号码不能为空")
      }
      if ( !(/^1(3|4|5|7|8)\d{9}$/.test(value))) {
        callback("请输入正确的手机号码");
      } else {
        callback();
      }
    };
    return {
      active: false,
      textarea: "",
      imageUrl: "",
      dialogImageUrl: "",
      dialogVisible: false,
      id: "",
      itemTypeName: [
        { label: "体育器材", value: "体育器材" },
        { label: "电子产品", value: "电子产品" },
        { label: "书籍", value: "书籍" },
        { label: "娱乐", value: "娱乐" },
        { label: "其他", value: "其他" },
      ],
      ruleForm: {
        // way: "0"
      },
      rules: {
        contactWay: [
          { required: true, validator: validateNumber, trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    
  },
  methods: {
    show(id,item) {
      this.id = id;
      this.ruleForm = item
      this.active = true;
    },
    // 上传图片成功回调
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    // 限制用户上传的图片格式和大小。
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //删除图片
    handleRemove(file, fileList) {},
    //查看图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.ruleForm.chargeType = parseInt(this.ruleForm.chargeType)
          this.ruleForm.id = this.id
          this.$http.itemUpdate(this.ruleForm).then( r =>{
            this.$message.success("修改成功！");
            this.back();
            this.$emit("reload")
          })
        } else {
          return false;
        }
      });
    },
    cancel() {
      this.back();
    },
    closeDialog() {
      this.back();
    },
    // 清空关闭
    back() {
      this.$refs.ruleForm.resetFields();
      this.ruleForm.content = "";
      this.active = false;
    }
  }
};
</script>
<style  scoped>
.demo-dynamic {
  padding-right: 30px;
}
.picture-show {
  /* margin-left: 20px; */
  float: right;
  margin-left: 0px;
  width: 178px;
  height: 178px;
  border: 1px dashed #d9d9d9;
}
.picture-show:hover {
  border-color: #409eff;
}
.avatar-uploader .el-upload {
  width: 178px;
  height: 178px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.price {
  float: left;
  margin-top: 10px;
  /* margin-bottom: 5px; */
}
.dialog-footer {
  text-align: right;
}
</style>