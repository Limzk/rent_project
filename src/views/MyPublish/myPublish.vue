<template>
  <div class="publish_content loading" >
    <div class="publish_amount">
        <!-- <i class="el-icon-notebook-2"></i> -->
      <span>当前发布物品总数:&nbsp;</span>
      <strong>{{ total }}</strong>
    </div>
    <div class="publish_detail" v-if="list.length !== 0">
      <el-collapse v-model="activeNames" v-for="(item,index) in list" :key="index"  accordion @change="changeCollapse(item.id,index)"> 
        <el-collapse-item :title="'物品名称：'+item.itemName" :name="index" style="padding-left:14px;">
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
            <el-tooltip
              class="item"
              effect="dark"
              content="修改"
              placement="top-start"
              transition="el-fade-in-linear"
            >
              <el-button size="mini" circle icon="el-icon-edit" type="primary" @click="editInfo(item.id,item)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="详情" placement="top-start">
              <el-button
                size="mini"
                circle
                icon="el-icon-s-order"
                type="warning"
                @click="detailInfo(item.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="下架" placement="top-start">
              <el-button size="mini" circle icon="el-icon-sort-down" type="danger" @click="down(item.id,item.itemName)"></el-button>
            </el-tooltip>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div class="footer_page">
        <el-pagination 
          :hide-on-single-page="true"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          layout="total, prev, pager, next"
          :total="total"
          >
        </el-pagination>
      </div>
    </div>

    <div class="no_publish"  v-else>
      <div class="text">
        <i class="el-icon-chat-line-round"></i>
        <span>当前无上架物品，快去发布吧！</span>
      </div>
    </div>
    <edit-modal ref="edit" v-on:reload="getItemList"></edit-modal>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
import editModal from "./edit";
export default {
  name: "myPublish",
  components: {
    editModal
  },
  data() {
    return {
      activeNames: '',
      currentPage: 1,
      list: [],
      itemDetail: {},
      queryList:{
        rows: 10,
        page: 1,
        state: 1
      },
      userId:'',
      total: 0,
      activeIndex: -1,
      // list: [
      //   { itemName: "i6", id: 1 ,state: 1,price:10,contactPerson:"im",itemName:"oooo"  },
      //   { itemName: "i7", id: 2 ,state: 0 }, 
      //   { itemName: "i7", id: 3 ,state: 0 }, 
      //   { name: "i7", id: 4 ,state: 0 }, 
      //   { name: "i7", id: 5 ,state: 0 }, 
      //   { name: "i7", id: 6 ,state: 0 }, 
      //   { name: "i7", id: 2 ,state: 0 }, 
      //   { name: "i7", id: 2 ,state: 0 }, 
      //   { name: "i7", id: 2 ,state: 0 }, 
      //   { name: "i7", id: 2 ,state: 0 }, 
      // ],
    };
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
      //  if(activeNames !== '' )  console.log(this.list[activeNames].name)
      
    },
    // 编辑
    editInfo(id,item) {
      // this.$refs.edit.show(this.list[this.activeNames].id);
      this.$refs.edit.show(id,item);
    },
    // 详情
    detailInfo(id) {
      // this.$router.push("detail");
      let routeData = this.$router.resolve({
          path: "/detail",
          query:{ id }
        });
        window.open(routeData.href, '_blank');
    },
    // 下架
    down(id,name) {
      this.$confirm(`是否下架物品${name}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http.itemUpdate({
            userId: this.userId,
            id: id,
            state: -1
          }).then( r => {
            this.$notify({
              title: "下架成功！",
              message: "可在下架物品中查看",
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
}
.publish_content .publish_amount {
  padding-top:40px;
  border-bottom: 2px solid #d13030;
  margin-bottom: 15px;
}
.publish_content .publish_amount .el-icon-notebook-2{
  /* font-size: 17px;
  width: 40px;
  height: 30px;
  text-align: center; */
}
.publish_content .publish_amount strong{
  display: inline-block;
  padding-bottom: 15px;
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
  /* border: 1px solid black; */
}
.publish_detail .object_photo img{
  width: 100%;
  height: 100%;
}
.publish_detail .object_message {
  width: 60%;
  height: 260px;
  float: left;
  margin-left: 2%;
  border-radius: 2%;
  padding-left: 10px;
}
.object_message .object_label {
  margin-top: 10px;
  font-weight:normal;
}
.object_message .object_label p{
  margin-top: 10px;
}
.publish_detail .object_operate {
  width: 100%;
  height: 40px;
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