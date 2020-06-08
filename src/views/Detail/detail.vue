<template>
  <div class="container">
    <layout ></layout>
    <!-- <el-page-header @back="goBack" content="详情页面" style="margin: 20px"></el-page-header> -->
    <el-breadcrumb separator-class="el-icon-arrow-right" >
      <el-breadcrumb-item :to="{ name: 'home',params:{ page : 'ture'} }">返回</el-breadcrumb-item>
      <el-breadcrumb-item>详情页面</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main">
      <div class="contain loading">
        <div class="leftPicture"   >
          <div class="img-container"  @mouseover="enter" @mouseout="leave"  @mousemove="move" ref="picture">
            <img :src="'http://47.107.235.13:80'+ detailList.itemPicture" />
           <div class="small_box" ref="smallBox"></div>
           <div class="big_box" ref="bigBox">
             <img :src="'http://47.107.235.13:80'+ detailList.itemPicture" ref="bigImg" />
          </div>
          </div>
          <div class="rate">
            <strong class="demonstration">用户规范等级</strong>
            <el-rate
              v-model="scoreValue"
              :colors="colors"
              show-text
              :texts="texts"
              disabled
              >
            </el-rate>
          </div>
        </div>       
        <div class="rightDetail">
          <div class="title">
            <span>{{ detailList.itemName }}</span>
          </div>
          <p style="font-size:14px;">
            {{ detailList.describe }}
          </p>
          <div class="price">
            <div class="rent">
              <strong>租金：</strong>
              <strong>￥{{ detailList.price }}/{{ detailList.chargType === 0 ?"时":"天"}}</strong>
            </div>
            <div class="deposit">
              <strong>押金：</strong>
              <strong>￥{{ detailList.deposit }}</strong>
            </div>
          </div>
          <div class="contact">
            <p>联系号码：&nbsp;&nbsp;{{ detailList.contactWay }}</p>
            <p>联系人：&nbsp;&nbsp;{{ detailList.contactPerson }}</p>
            <p>联系地点：&nbsp;&nbsp;{{ detailList.contactPlace }}</p>
          </div>
        </div>
      </div>
      <!-- 评论区 -->
      <div class="comment-explain">
        <h2>评论区</h2>
      </div>
      <div class="comment-list loading">      
        <div class="comment" v-for="(item,index) in commentList" v-show="commentList.length > 0 ">
          <el-avatar :size="40" :src="'http://47.107.235.13:80'+ item.avatar"></el-avatar>
          <span class="name">{{ item.toName}}</span>
          <div class="content">
            <span>{{ item.commentTopic }}</span>
          </div>
          <div class="operation">
            <span>{{ item.createTime | timeFilter }}</span>
            <el-tooltip class="item" effect="dark" :content="activeIndex === index?'收起回复':'查看回复'" placement="top" v-show="item.replyCount !== 0">
              <el-button type="text" icon="el-icon-search" @click="readMore(item.id,index)">
                <span>{{ item.replyCount }}</span>
              </el-button>         
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="回复" placement="top">
              <el-button type="text" icon="el-icon-edit" @click="commentTo( item.id,item.userId,item.toName)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="点赞" placement="top">
              <el-button type="text" @click="thumbsUpCom(item)">
                <svg class="icon" aria-hidden="true" >
                  <use :xlink:href="item.state === 1?'#icon-HaveThumbUp':'#icon-NoThumbUp'"></use>
                </svg>
                <span>{{ item.thumbsUp }}</span>
              </el-button>   
            </el-tooltip>
          </div>
          <!-- 回复 -->
          <div v-for=" cItem in replyList">
              <div class="reply" :class="activeIndex === index?'have':''">
                <el-avatar  class="reply-avatar"  :size="40"  :src="'http://47.107.235.13:80'+cItem.avatar"></el-avatar>
                <div class="reply_content">
                  {{ cItem.fromName }}:
                  <span v-if="cItem.toName !== item.toName">回复
                    <span style="color: #4471b8;">{{ cItem.toName }}：</span>
                  </span>
                  <span>{{ cItem.content }}</span>
                </div>
                <div class="reply-operation">
                  <span style="margin-left:58px">{{ cItem.createTime | timeFilter }}</span>
                  <el-tooltip class="item" effect="dark" content="回复" placement="top">
                    <el-button type="text" icon="el-icon-edit" @click="commentTo( cItem.commentId,cItem.fromUid,cItem.fromName )"></el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="点赞" placement="top">
                    <el-button type="text" @click="thumbsUpRep(cItem)">
                      <svg class="icon" aria-hidden="true" >
                        <use :xlink:href="cItem.state === 1?'#icon-HaveThumbUp':'#icon-NoThumbUp'"></use>
                      </svg>
                      <span>{{ cItem.thumbsUp }}</span>
                    </el-button>   
                  </el-tooltip>
                </div>
              </div>
          </div>
          <el-pagination
            class="reply-footer-page"
            v-show="activeIndex === index && replyTotal > 4 "
            @current-change="replyCurrentChange"
            :current-page.sync="replyPage"
            :page-size="5"
            layout="total, prev, pager, next"
            :total="replyTotal">
          </el-pagination>
        </div>
      </div>
      <el-pagination
          background
          class="footer_page"
          :hide-on-single-page="true"
          @current-change="commentCurrentChange"
          :current-page.sync="commentPage"
          :page-size="10"
          layout="total, prev, pager, next"
          :total="commentTotal">
        </el-pagination>
      <div v-show="commentTotal === 0" class="noComment">
        <i class="el-icon-warning" style="font-size:36px"></i>
        <p >该物品暂无评论内容，快去发表评论吧~</p>
      </div>
      <div class="comment-input">
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
          v-model="comment"
          ref="inputFocus"
          maxlength="88"
          show-word-limit
        ></el-input>
        <el-button plain size="mini" type="primary" @click="submit" :disabled="comment === ''">评论</el-button>
      </div>

    </div>

    <comment ref="comment" v-on:reload="reload"></comment>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
import { parseTime } from "../../utils/parseTime"
import comment from "./comment";
export default {
  components: {
    comment
  },
  data() {
    return {
      comment: "",
      isThumbsUp: false,
      thumbsUpCount: 0,
      itemId:'',
      userId:'',
      queryComment:{
        rows: 10,
        page: 1
      },
      queryReply:{
        rows: 5,
        page:1
      },
      detailList: {},
      commentList: [],
      replyList:[],
      haveLogin: false,
      commentPage: 1,
      commentTotal: 0,
      replyTotal: 0,
      replyPage: 1,
      activeIndex: -1,
      commentTimer: null,
      timer: null,
      replyTimer: null,
      scoreValue:1,
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
      texts:['极低', '偏低', '中等', '偏高', '极高'],
    };
  },
  filters:{
    timeFilter(val){
      if(val)  return parseTime(val)
    }
  },
  created(){
    this.getParams()
  },
  methods: {
    // 获取参数
    getParams() {
      this.itemId = this.$route.query.id
      this.queryComment.itemId = this.itemId
      if(VueCookies.isKey("userId")){
        this.userId = VueCookies.get('userId')
        this.queryComment.userId = this.userId
        this.queryReply.userId = this.userId
      }
      this.getDatail()
      this.getComment()
    },
    // 获取物品信息
    getDatail() {
      this.$http.getDetailList({
        id: this.itemId
      }).then( r => {
        if(r.code === 10000) {
          this.detailList = r.data
          this.scoreValue = this.toSorce(this.detailList.bannedCount)
        }
      })
    },
    // 用户等级
    toSorce(val) {
      switch(val) {
        case 0:
          return 5;
          break;
        case 1:
          return 4;
          break;
        case 2:
          return 3;
          break;
        case 3:
          return 2;
          break;
        default:
          return 1
      }
    },
    // 获取评论列表
    getComment() {
      // this.queryComment.itemId = this.itemId
      this.$http.getCommentList(this.queryComment).then( r =>{
        if(r.code === 10000) {
          this.commentTotal = r.data.totalCount
          this.commentList = r.data.data
        }
      })
    },
    // 获取回复列表
    getReply() {
      this.$http.getReplytList(this.queryReply).then( r => {
        if( r.code === 10000) {
          this.replyTotal = r.data.totalCount
          this.replyList = r.data.data
          // this.
          this.$nextTick( () =>{
            $('.have').stop().slideDown(500)    
          })
          
        }
      }) 
    },
    // 检查是否登录
    isLogin() {
      if(!VueCookies.isKey("userId")){
        this.$message.warning("请先登录！")
        return false
      }
      else{
        return true
      }
    },
    // 检查是否被禁用
    isDisabled() {
      if(parseInt(VueCookies.get('userState')) === 0) {
        this.$message.warning("您当前处于禁用状态，暂不可发表评论")
        return true
      }
      else{
        return false
      }
    },
    // 点赞参数 根据state判断点赞状态
    // 0：未赞  1：已赞
    thumbsUpPar(item) {
      if(item.state === 0) {
        item.thumbsUp ++
        item.state = 1
      }
      else{
        item.thumbsUp --
        item.state = 0
      }
      return {
        id: item.id,
        thumbsUp: item.thumbsUp,
        state: item.state === 1?1:0,
        userId: this.userId
      }
    },
    // 点赞评论 并调整状态
    thumbsUpCom(item) {
      if(!this.isLogin()) return
      this.setCommentTime(this.thumbsUpPar(item))
    },
    // 点赞回复 并调整状态
    thumbsUpRep(item) {
      if(!this.isLogin()) return
      this.setReplyTime(this.thumbsUpPar(item))
    },
    // 设置延时器，点赞1s后才向服务器传数据，防止恶意点赞(防抖)
    setCommentTime(params) {
      if(this.commentTimer) {
        clearTimeout(this.commentTimer)
      }
      this.commentTimer = setTimeout( () =>{
        this.commentTimer = null
        this.$http.thumbsUpComment(params).then( r => {})
      },1000)
    },
    // 回复延时器
    setReplyTime(params) {
      if(this.replyTimer) {
        clearTimeout(this.replyTimer)
      }
      this.replyTimer = setTimeout( () =>{
        this.replyTimer = null
        this.$http.thumbsUpReply(params).then( r => {} )
      },1000)
    },
    // 查看回复
    readMore(id,index) {
      // 判断是否点击同一个评论模块，若是，收起所有回复
      if(this.activeIndex === index){
        $('.have').stop().slideUp(500)
        this.activeIndex = -1
      }
      // 否则 收起上一个展开的回复
      else{
        this.activeIndex = index
        $('.reply').stop().slideUp(500)
        this.queryReply.commentId = id
        this.getReply()       
      }
    },
    // 重新刷新
    reload() {
      this.getComment()
      this.getReply()
    },
    remove() {
      this.$confirm("是否删除该留言", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {});
    },
    // 提交评论
    submit() {
      if(!this.isLogin()) return
      if(this.isDisabled()) return
      this.$http.comment({
        // userId: VueCookies.get('userId'),
        userId: this.userId,
        commentTopic: this.comment,
        itemId: this.itemId,
      }).then( r => {
        this.$notify({
          title: "评论成功！",
          position: "bottom-right",
          type: "success",
          duration: 1500
        });
        this.comment = "";
        this.getComment()
      })
    },
    // 提交回复
    commentTo(themeId,userId,name) {
      if(!this.isLogin()) return
      if(this.isDisabled()) return
      let arr = Array.from(arguments)
      // this.$refs.inputFocus.focus();
      this.$refs.comment.show(arr);
    },
    // 返回
    goBack() {
      this.$router.push("home");
    },
    // 评论页码改变
    commentCurrentChange(page) {
      this.queryComment.page = page
      this.getComment()
      // $('.reply').stop().slideUp(500)
    },
    // 回复页码改变
    replyCurrentChange(page) {
      this.queryReply.page = page
      this.getReply()
    },
    enter() {
      this.$refs.smallBox.style.display = 'block'
      this.$refs.bigBox.style.display = 'block'
    },
    leave() {
      this.$refs.smallBox.style.display = 'none'
      this.$refs.bigBox.style.display = 'none'
    },
    move(event) {
      let picture = this.$refs.picture
      let smallBox = this.$refs.smallBox
      let bigBox = this.$refs.bigBox
      let bigImg = this.$refs.bigImg
      // 鼠标相对于body的坐标 - 图片相对于body的坐标 = 鼠标在图片中移动的坐标
      let x = event.pageX - this.$refs.picture.offsetLeft
      let y = event.pageY - this.$refs.picture.offsetTop
      // 遮挡层移动距离(设置鼠标在box的正中央)
      let smallMoveX = x - smallBox.offsetWidth/2 
      let smallMoveY = y - smallBox.offsetHeight/2
      // 遮挡层最大移动距离
      let smallMaxMoveX = picture.offsetWidth - smallBox.offsetWidth
      let smallMaxMoveY = picture.offsetHeight - smallBox.offsetHeight
      // console.log(smallMaxMoveX)
      // console.log(smallMaxMoveY)
      // 遮挡层最小和最大移动距离
      if(smallMoveX <= 0) {
        smallMoveX = 0
      }else if(smallMoveX >= smallMaxMoveX ) {
        smallMoveX = smallMaxMoveX
      }
      if(smallMoveY <= 0) {
        smallMoveY = 0
      }else  if(smallMoveY >= smallMaxMoveY ) {
        smallMoveY = smallMaxMoveY
      }
      smallBox.style.left = smallMoveX + 'px'
      smallBox.style.top = smallMoveY +'px'
      // 大图片最大移动距离
      let bigMaxMoveX = bigBox.offsetWidth 
      let bigMaxMoveY = bigBox.offsetHeight 
      // 大图片的移动距离 = 遮挡层移动的距离 * 大图片最大移动距离  / 遮挡层最大移动距离
      let bigMoveX = bigMaxMoveX * smallMoveX / smallMaxMoveX
      let bigMoveY = bigMaxMoveY * smallMoveY / smallMaxMoveY
      bigImg.style.left = -bigMoveX +1+'px'
      bigImg.style.top = -bigMoveY +1+'px'     
    }
  }
};
</script>

<style scoped>
.v-enter-active .v-leave-active{
  transition: all .5s;
}
/* .v-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
} */
.v-enter,
.v-leave-to {
  /* transform: translateY(-60px);
  opacity: 0; */
  height: 0;
}
.container {
  background-color: #f8fafc
}
.container .el-breadcrumb {
  margin: 25px;
}
.container .main {
  width: 70%;
  margin: 60px auto 0px;
  /* margin: 0 auto; */

  
}
.container .contain {
  /* margin-top:0px; */
  width: 100%;
  height: 360px;
  /* border: 1px solid black; */
  /* box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2); */
  box-shadow: 0 4px 8px 0 rgba(7,17,27,.05);
  /* margin-bottom: 70px; */
  border-radius: 12px;
  /* position: relative; */
  background: #fff;
  padding:20px;
  box-sizing:border-box;
}

.contain .leftPicture {
  float: left;
  width: 35%;
  height: 100%;
  /* border: 1px solid #ccc; */
  
}
.contain .leftPicture .img-container{
  height:89%;
  width:100%;
  position: relative;
}
.contain .leftPicture img{
  width: 100%;
  height: 100%;
}
.contain .leftPicture .rate{
  margin-top:15px;
  display:flex;
  justify-content:space-around;
}
.contain .leftPicture .rate .demonstration{
  font-size:14px;
  /* margin-right:25px; */
}
.contain .small_box {
  width: 40%;
  height: 40%;
  background: #fede4f;
  opacity: .5;
  position: absolute;
  top: 0;
  left: 0;
  display:none;
  cursor:move;
}
.contain .big_box {
  width:580px;
  height:500px;
  background:#fff;
  position:absolute;
  top:-80px;
  left:100%;
  z-index:999;
  display:none;
  overflow:hidden;
  /* border-left: 1px solid #ccc; */
}

.contain .big_box img{
  position:absolute;
  top:0px;
  left:0px;
  transform: scale(2);
  transform-origin: 0 0;
}

.contain .rightDetail {
  float: right;
  width: 60%;
  height: 100%;
  /* border: 1px solid black; */
  /* margin-right: 10%; */
  position: relative;
}

.contain .rightDetail .title {
  color: #323232;
  font-size: 18px;
  font-weight: bolder;
  /* padding: 15px 0; */
  /* border-bottom: 2px solid #ccc; */
  margin-bottom: 20px;
  /* margin-top:-6px; */
}
.contain .rightDetail .price {
  width: 100%;
  height: 40px;
  line-height: 40px;
  /* background: #fcfaf7; */
  /* color: #ec6c2f; */
  /* margin-top: 40px; */
  position:absolute;
  top:50%;
  transform: translateY(-50%)
}
.contain .rightDetail .price .rent {
  float: left;
}
.contain .rightDetail .price .deposit {
  float: right;
  margin-right: 20px;
}
.contain .rightDetail .price strong:last-child {
  color: #ff4040;
}
.contain .rightDetail .contact {
  /* border-top: 2px solid #ec6c2f; */
  width: 100%;
  /* height: 40px; */
  /* background: #f0f0f0; */
  position: absolute;
  bottom: 5px;
  color: #000;
  font-size: 14px;
}
.contain .rightDetail .contact p {
  /* margin: 0px; */
  margin-bottom: 8px;
  font-weight: 400;
  /* font-family: simsun; */
}
.contain .rightDetail .contact p:last-child {
  margin-bottom: -6px;
}
.comment-explain{
  margin: 50px 0 30px;
  font-size: 10px;
  letter-spacing: 2px;
}
.comment-list {
  box-shadow: 0 4px 8px 0 rgba(28,31,33,.1);
  background-color: #fff;
  border-radius: 12px;
  /* margin-bottom:60px; */
}
.comment {
  position: relative;
  
  /* padding:30px 30px 15px; */
  padding:30px 30px 25px;
  
  /* margin-bottom:10px; */
  border-bottom: 1px solid rgba(56,61,66,.1);
}
.comment .name {
  color: #4471b8;
  position: absolute;
  top: 38px;
  left: 85px;
  /* line-height: 40px; */
}
.comment .content {
  /* height: 50px; */
  /* border: 1px solid black;  */
  margin-left: 58px;
}
.comment .content span {
  /* cursor:pointer; */
  /* font-size: 13px;
  font-family: "SimHei"; */
  font:14px/1.5 "PingFang SC","微软雅黑","Microsoft YaHei",Helvetica,"Helvetica Neue",Tahoma,Arial,sans-serif;
}
.comment .operation {
  /* height: 70px; */
  /* margin: 20px 0 -15px 58px; */
  /* border: 1px solid black;  */
  margin-left:58px;
  /* line-height:70px; */
  padding-top: 35px;
}
.comment .operation{
  overflow: hidden;
}
.comment .operation .el-button{
  float:right;
}
.footer_page{
  /* margin-top: 10px; */
}
.noComment{
  /* background: #4471b8; */
  width: 100%;
  /* height: 200px; */
  padding:60px 0 100px;
  text-align: center;
  
  color: #9199a1;
  
  /* line-height: 200px; */
}
.noComment p {
  font-size: 16px;
  line-height: 24px;
  margin-top: 4px;
}
.operation span {
  font-size: 12px;
}

.reply {
  /* height: 100px; */
  /* background: #f7f8fa; */
  /* margin: 15px 0 -10px 58px; */
  /* position: relative; */
  display:none;
  padding-top:25px;
  padding-left:55px;
  margin-bottom: 20px;
  /* overflow: hidden; */
  
}
.reply .reply_content {
  font-size: 12px;
  position: relative;
  top: -30px;
  /* left:58px; */
  margin-left: 58px;
  color: #4471b8;
  /* width: 100%; */
}
.reply .reply_content span {
  color: #000000;
}
.reply span {
  font-size: 12px;
}
.reply .reply-operation {
  width: 100%;
}
.reply .el-button {
  padding: 0px;
  /* margin-top: 2px; */
  font-size: 18px;
  margin-left: 10px;
  float:right;
  /* position: absolute; */
  /* right:0; */
}
/* .reply .el-divider {
  margin-bottom: 0px;
  margin-top: 15px;
} */
.comment-list .reply-footer-page{
  text-align: right;
  margin-top: 40px;
}
.have {

}


.operation .el-button {
  padding: 0px;
  margin-top: 2px;
  font-size: 18px;
  margin-left: 10px;
}
 .el-button span{
  font-size: 13px;
  color:#333;
}
.el-textarea >>> .el-textarea__inner {
  resize: none;
}
.comment-input{
  margin-top:50px;
  text-align:right;
}
.comment-input .el-textarea{
  box-shadow: 0 4px 8px 0 rgba(20,20,20,.1);
}
.comment-input .el-button{
  margin: 20px 0;
}

</style>