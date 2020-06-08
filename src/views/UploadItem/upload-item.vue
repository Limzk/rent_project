<template>
  <div class="container">
      <layout ></layout>
      <!-- <div style="background-color: #f8fafc;"> -->
        <div class="content loading">
            <el-card shadow="hover">
                <p style="color:#f3c84c">填写物品信息：</p>
                <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-dynamic" :rules="rules">
                    <div class="picture-show">
                        <el-upload
                            ref="pictureUpload"
                            action="/api/item/upload"
                            list-type="picture-card"
                            :on-preview="handlePictureCardPreview"
                            :on-remove="handleRemove"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                            :limit="1"
                            :on-exceed="handleExceed">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </div>
                    <!-- 图片预览 -->
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt />
                    </el-dialog>
                    <!-- 表单提交内容 -->
                    <div class="price">
                        <el-form-item prop="itemName" label="物品名称" :rules="[{ required: true, message: '物品名称不能为空', trigger: 'blur' }]">
                        <el-input v-model="ruleForm.itemName" style="width:226px;" maxlength="8" show-word-limit placeholder="请输入物品名称" ref="inputFocus"></el-input>
                        </el-form-item>
                        <el-form-item prop="price" label="价格" :rules="[{ required: true, message: '价格不能为空', trigger: 'blur' }]">
                        <el-input v-model="ruleForm.price" style="width:226px;" oninput="value=value.replace(/[^0-9.]/g,'')" placeholder="请根据收费方式填写价格"></el-input>
                        <span>元/{{ ruleForm.chargeType === 0? "时":"天" }}</span>
                        </el-form-item>
                        <el-form-item>
                        <el-radio-group v-model="ruleForm.chargeType">
                            <el-radio :label="0">按时收费</el-radio>
                            <el-radio :label="1">按天收费</el-radio>
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
                        <el-input  v-model="ruleForm.deposit"  oninput="value=value.replace(/[^0-9.]/g,'')" placeholder="请输入押金金额" ></el-input>
                    </el-form-item>
                    <el-form-item  prop="contactPerson"  label="联系人"  :rules="[{ required: true, message: '联系人不能为空', trigger: 'blur' }]" >
                        <el-input v-model="ruleForm.contactPerson" placeholder="请输入联系人"></el-input>
                    </el-form-item>
                    <el-form-item  prop="contactWay"  label="联系号码"   >
                        <el-input v-model="ruleForm.contactWay" placeholder="请输入联系号码"></el-input>
                    </el-form-item>
                    <el-form-item prop="contactPlace"  label="联系地点" :rules="[{ required: true, message: '联系地点不能为空', trigger: 'blur' }]">
                        <el-input  placeholder="请输入联系地点"  v-model="ruleForm.contactPlace"  maxlength="26"  show-word-limit  ></el-input>
                    </el-form-item>
                    <el-form-item  prop="describe" label="其他">
                        <el-input  :rows="4"  type="textarea"  placeholder="例如对物品的描述或补充"  v-model="ruleForm.describe"  maxlength="88"  show-word-limit  style="margin:5px 0"  resize="none"></el-input>
                    </el-form-item>
                    <el-form-item class="dialog-footer">
                        <el-button  @click="reset">重置</el-button>
                        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
      <!-- </div> -->
  </div>
</template>

<script>
import BMap from 'BMap'
import VueCookies from "vue-cookies";
export default {
    name:"",
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
            imageUrl: "",
            dialogImageUrl: "",
            dialogVisible: false,
            itemTypeName: [
                { label: "体育器材", value: "体育器材" },
                { label: "电子产品", value: "电子产品" },
                { label: "生活用品", value: "生活用品" },
                { label: "书籍", value: "书籍" },
                { label: "其他", value: "其他" },
            ],
            ruleForm: {
                chargeType: 0
            },
            rules: {
                contactWay: [
                    { required: true, validator: validateNumber, trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this.getContact()
        this.getLocation()
    },
    mounted(){
        this.$refs.inputFocus.focus()
    },
    methods:{
        // 获取联系信息
        getContact() {
            this.$http.personalInfo({ id: VueCookies.get('userId')}).then( r => this.ruleForm = r.data)
        },
        // 获取上传的地点
        getLocation() {
            var _this = this
            const geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function getinfo(position){
                _this.loand(position.point.lng,position.point.lat)
            })
        },
        // 经纬度转市省区
        loand(lng,lat) {
            let point = new BMap.Point(lng,lat);
            new BMap.Geocoder().getLocation(point, rs => {   //getLocation函数用来解析地址信息，分别返回省市区街等
                let addComp = rs.addressComponents;
                this.ruleForm.province = addComp.province
                this.ruleForm.city = addComp.city
                this.ruleForm.district = addComp.district
            });
        }, 
        // 上传图片成功回调
        handleAvatarSuccess(res, file) {
            this.ruleForm.itemPicture = res.data.itemUrl
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
        // 超出限制
        handleExceed(files, fileList) {
            this.$message.warning("最多只能上传一张图片！")
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
                    if(!this.ruleForm.itemPicture) {
                        this.$message.error('请上传物品图片')
                        return 
                    }
                    this.$confirm('是否确定发布？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.ruleForm.chargeType = parseInt(this.ruleForm.chargeType)
                        this.ruleForm.userId = VueCookies.get('userId')
                        this.$http.uploadItem(this.ruleForm).then( r =>{
                            this.$message.success("提交成功！可在待审核中查看物品信息，审核通过后会上架到首页")
                            this.reset()
                        })
                        
                    })
                } else {
                    return false;
                }
            });
        },
        // 重置
        reset() {
            this.$refs.ruleForm.resetFields()
            this.$refs.pictureUpload.clearFiles()
        }
    }
}
</script>

<style scoped>


.container {
    /* background-color: #f8fafc; */
}
.content {
    width:65%;
    height: 400px;
    margin: 50px auto;
    
}
.content  .demo-dynamic {
  margin-top: 20px;
  padding-right: 30px;
}
.content  .demo-dynamic .picture-show {
  float: right;
}

.content  .demo-dynamic .avatar-uploader .el-upload {
  width: 178px;
  height: 178px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.content  .demo-dynamic .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.content  .demo-dynamic .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.content  .demo-dynamic .price {
  float: left;
  margin-top: 10px;
  /* margin-bottom: 5px; */
}
.content  .demo-dynamic .dialog-footer {
  text-align: right;
}
</style>