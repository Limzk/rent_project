<template>
  <div class="content">
    <div class="title">
      <strong>通知</strong>
    </div>
    <div>
      <div class="notice_content" v-for="(item,index) in sendList.messageList" :key="index">
        <strong>系统通知：</strong>
        <span>{{ item.content }}</span>
        <!-- <span>您上传的物品"i6"通过审核已上架</span> -->
        <span style="float:right">{{ item.createTime | timeFilter }}</span>
      </div>
      <div class="footer_page" v-if="sendList.total > 9">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="10"
          layout="total, prev, pager, next"
          :total="sendList.total"
        ></el-pagination>
      </div>
    </div>

    <div class="no_content" v-if="sendList.total === 0">
      <strong>暂时没有通知消息</strong>
    </div>
  </div>
</template>

<script>
import { parseTime } from "../../utils/parseTime"
export default {
  name: "noticeMessage",
  data() {
    return {
      currentPage: 1
    };
  },
  props:['sendList'],
  filters:{
    timeFilter(val){
      if(val)  return parseTime(val)
    }
  },
  methods: {
    handleSizeChange() {},
    handleCurrentChange(page) {
      this.$emit('changPage',page,2)
    }
  }
};
</script>

<style scoped>
.content {
}
.content .title {
  font-size: 14px;
  border-bottom: 2px solid #d13030;
  padding-bottom: 12px;
}
.content .notice_content {
  /* width: 100%;  */
  height: 31px;
  padding: 16px;
  border-bottom: 1px dotted #ccc;
}
.content .notice_content strong {
  font-size: 12px;
}
.content .notice_content span {
  font-size: 12px;
  line-height: 31px;
  color: #999999;
}
.content .footer_page {
  text-align: right;
  margin-top: 20px;
}
.content .no_content {
  text-align: center;
  line-height: 320px;
  font-size: 13px;
}
</style>