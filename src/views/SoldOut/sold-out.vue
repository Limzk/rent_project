<template>
  <div class="publish_content loading" v-if="list">
    <div class="publish_amount">
      <!-- <i class="el-icon-notebook-2"></i> -->
      <span>{{ options_state.value === -1?"主动下架物品数量: ":options_state.value === -2?"审核失败物品数量: " :"下架物品总数: " }}</span>
      <strong>{{ total }}</strong>
       <el-select v-model="options_state.value" placeholder="状态选择" style="float:right;margin-right:20px;" clearable @change="changeSelect(options_state.value)">
        <el-option
          v-for="item in options_state"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="publish_detail " v-if="list.length !== 0">
      <el-collapse
        v-model="activeNames"
        v-for="(item,index) in list"
        :key="item.id"
        accordion
        @change="changeCollapse(item.id,index)"
      >
        <el-collapse-item :name="index" style="padding-left:14px;">
          <template slot="title">
            {{'物品名称：'+item.itemName}}
            <el-tag  :type="item.state | toStatus " style="margin-left:20px" size="mini" >{{ item.state === -1?'主动下架':'审核失败'}}</el-tag>
          </template>
          <div class="object_photo">
            <img :src="'http://47.107.235.13:80'+itemDetail.itemPicture">
          </div>
          <div class="object_message">
            <div class="object_label">
              <p>
                  <strong>价格:&nbsp;&nbsp;</strong>
                  <span>￥{{ itemDetail.price }}/{{ itemDetail.state === 0?"时":"天"}}</span>
              </p>
              <p>
                  <strong>押金:&nbsp;&nbsp;</strong>
                  <span>￥{{ itemDetail.deposit }}</span>
              </p>
              <p>
                  <strong>联系人:&nbsp;&nbsp;</strong>
                  <span>{{ itemDetail.contactPerson }}</span>
              </p>
              <p>
                  <strong>联系号码:&nbsp;&nbsp;</strong>
                  <span>{{ itemDetail.contactWay }}</span>
              </p>
              <p>
                  <strong>联系地点:&nbsp;&nbsp;</strong>
                  <span>{{ itemDetail.contactPlace }}</span>
              </p>
              <p>
                  <strong>描述:&nbsp;&nbsp;</strong>
                  <span>{{ itemDetail.describe }}</span>
              </p>
            </div>
          </div>
          <div class="object_operate">
            <el-tooltip  class="item"  effect="dark"  content="删除"  placement="top-start"  >
              <el-button size="mini" circle icon="el-icon-delete" type="warning" @click="remove(item.id,item.itemName)"></el-button>
            </el-tooltip>
            <!-- <el-tooltip  class="item"  effect="dark"  content="编辑"  placement="top-start"  >
              <el-button size="mini" circle icon="el-icon-edit" type="primary" @click="editInfo(item.id)"></el-button>
            </el-tooltip> -->
            <!-- <el-tooltip class="item" effect="dark" content="上架" placement="top-start">
              <el-button size="mini" circle icon="el-icon-sort-up" type="danger" @click="up(item.id,item.itemName)"></el-button>
            </el-tooltip> -->
          </div>
        </el-collapse-item>
      </el-collapse>
      <div class="footer_page">
        <el-pagination 
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          layout="total, prev, pager, next"
          :total="total"
          :hide-on-single-page="true"
          >
        </el-pagination>
      </div>
    </div>
    <div class="no_publish"  v-else>
      <div class="text">
        <i class="el-icon-chat-line-round"></i>
        <span>{{ options_state.value === 1?"当前无主动下架物品":options_state.value === 0?"当前无审核失败物品":"当前无下架物品"}}</span>
      </div>
    </div>

    <!-- <edit-modal ref="edit"></edit-modal> -->
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
// import editModal from "../MyPublish/editPublish";
export default {
  name: "soldOut",
  components: {
    // editModal
  },
  data() {
    return {
      activeNames: "",
      // list: [
      //   { name: "i6", id: 1 ,state: 1 },
      //   { name: "i7", id: 2 ,state: 0 } 
      // ],
      currentPage: 1,
      list:[],
      itemDetail: {},
      queryList:{
        rows: 10,
        page: 1,
        state: -3
      },
      userId:'',
      total: 0,
      options_state:[
        {value:-2,label:"审核失败"},
        {value:-1,label:"主动下架"}
      ],
      activeIndex: -1,
    };
  },
  filters:{
    toStatus(val){
      switch (val) {
        case 0:
          return "danger"
          break;
      
        case 1:
          return
          break;
      }
    }
  },
  created() {
    this.userId = VueCookies.get('userId')
    this.queryList.userId = this.userId
    this.getItemList()
  },
  methods: {
    // 获取物品列表
    getItemList() {
      this.$http.itemList(this.queryList).then( r=>{
        if( r.code === 10000) {
          this.total = r.data.totalCount
          this.list = r.data.data
        }   
      })
    },
    // 切换板块
    changeCollapse(id,index) {
      if(index !== this.activeIndex) {
          this.$http.itemDetail({
          userId: this.userId,
          id: id
        }).then( r => this.itemDetail = r.data)
      }
      this.activeIndex = index
    },
    // 选择器选择
    changeSelect(value) {
      value?this.queryList.state = value: this.queryList.state = -3
      this.getItemList()
      // this.list = this.list.filter( item => item.state === value)
    },
    // 编辑
    editInfo(id) {
      this.$refs.edit.show(this.list[this.activeNames].id);
    },
    // 删除
    remove(id,name) {
      this.$confirm(`是否删除物品${name}？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then( () =>{
        let ids = []
        ids.push(id)
        this.$http.deleteItem({ids:ids}).then( r => {
          this.$message.success('删除成功！')
          this.getItemList()
        })
      }).catch( () =>{

      })
    },
    // 下架
    up(id,name) {
      this.$confirm(`是否上架物品${name}？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http.itemUpdate({
            userId: this.userId,
            id: id,
            state: 2,
          }).then( r =>{
            this.$notify({
              title: "提交成功！",
              message:"提交成功！可在待审核中查看物品信息，审核通过后会上架到首页",
              position: "bottom-right",
              duration: 2000,
              type: "success"
            });
            this.activeNames = -1
            this.activeIndex = -1
            this.getItemList()
          })
        })
        .catch(() => {});
    },
    handleCurrentChange(page) {
      this.queryList.page = page
      this.getItemList()
    }
  }
};
</script>

<style scoped>
.publish_content {
  width: 90%;
  margin: 0 auto;
  font-size: 14px;
  /* border-left: 1px solid #efefef; */
}
.publish_content .publish_amount {
  /* padding-bottom: 20px 0; */
  /* margin-top: 50px; */
  /* background: #f0f0f0;
  height: 80px;
  line-height: 80px; */
  padding-top:20px;
  height: 50px;
  border-bottom: 2px solid #d13030;
  margin-bottom: 15px;
}
/* .publish_content .publish_amount .el-icon-notebook-2 {
  font-size: 17px;
  width: 40px;
  height: 30px;
  text-align: center;
} */
.publish_content .publish_amount span {
  display: inline-block;
  padding:18px 0px 0;
}
.publish_content .publish_detail {
  /* margin-top: 40px; */
  border: 1px solid #eeeeee;
}
.publish_detail .object_photo {
  float: left;
  width: 35%;
  height: 260px;
  padding:15px;
  box-sizing: border-box;
  /* background: #409eff; */
  /* border: 1px solid black; */
}
.publish_detail .object_photo img{
  width: 100%;
  height: 100%;
}
.publish_detail .object_message {
  width: 60%;
  height: 260px;
  /* background: #e6a23c; */
  float: left;
  margin-left: 2%;
  /* box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2); */
  /* border: 1px solid bisque; */
  border-radius: 2%;
  padding-left: 10px;
}
.object_message .object_label {
  margin-top: 10px;
  /* font-weight: 550; */
  font-weight:normal;
}
.object_message .object_label p{
  margin-top: 10px;
}
.publish_detail .object_operate {
  width: 100%;
  height: 40px;
  /* background: #67c23a; */
  /* background: #bfd1cf; */
  float: left;
  text-align: right;
  line-height: 40px;
}
.object_operate .el-button:last-child {
  margin-right: 10px;
}
.publish_content .no_publish{
  height: 380px;
  font-size: 14px;
  position:relative;
}
.publish_content .no_publish .text{
  width:100%;
  position:absolute;
  text-align: center;
  top:50%;
}
</style>