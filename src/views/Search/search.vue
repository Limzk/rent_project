<template>
  <div class="container">
      <div class="nav">
        <a href="/home">首页</a>
        <div class="search">
          <el-input v-model="keyword" placeholder="请输入物品名称" @keyup.enter.native="search" clearable></el-input>
          <el-button size="mini" type="success" @click="search">搜索</el-button>
        </div>
      </div>
      <div class="location">
        <span ref="locating">正在定位...</span>
        <div class="my-location" ref="myLocation">
          <el-cascader size="mini" :options="options" v-model="selectedOptions" @change="fetchData"></el-cascader>
        </div>
    </div>
    
      <div class="items-info loading">
        <div  @click="detail(item.id)" v-for="item in list"     class="items">
          <el-card :body-style="{ padding: '0px' }" shadow="hover">
            <div class="photo_show">
              <img :src="'http://47.107.235.13:80'+ item.itemPicture"/>
            </div>
            <div class="describe_font" >
              <p>{{ item.itemName }}</p>
              <p>￥{{ item.price}}/{{ item.chargType === 0 ?"时":"天"}}</p>
            </div>
          </el-card>
        </div>
      </div>
      <div class="no-item" v-show="list.length === 0">
        <div></div>
        <h4>非常抱歉，没有找到相关的物品</h4>
      </div>
      <div  class="page">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="25"
          layout="total, prev, pager, next, jumper"
          :total="total"
          :hide-on-single-page="true"
        ></el-pagination>
      </div>

      <div class="footer-waper">
        <p>2020 &copy; Limzk</p>
      </div>
  </div>
</template>


<script>
import BMap from 'BMap'
import { regionDataPlus,CodeToText,TextToCode } from 'element-china-area-data'
export default {
  name: "home",
  data() {
    return {
      keyword:'',
      currentPage: 1,
      total:0,
      // list:[{itemName:"笔记本哒哒哒哒哒哒",price:10,chargType:0,id:1},{itemName:1},{itemName:1},{itemName:1},{},{},{},{},{},{},{},{},{},{},{},{}],
      list:[],
      queryList: {
        rows: 25,
        page: 1
      },
      options: regionDataPlus,
      selectedOptions: [],
    };
  },
  computed:{
  },
  created(){
    this.getStorageData()
    this.city()
  },
  methods: {
    getStorageData() {
      // 表刷新或从详情返回
      if(sessionStorage.getItem("searchContent") || sessionStorage.getItem("searchContent") === '') {
        this.queryList.keyword = sessionStorage.getItem("searchContent")
        if(sessionStorage.getItem("pageDetail")){
          this.queryList.page = sessionStorage.getItem("pageDetail")
          this.currentPage = this.queryList.page
        }
        else{
          this.queryList.page = 1
        }
      }
      // 默认
      else {
        this.queryList.keyword = this.$route.query.keyword
        sessionStorage.setItem("searchContent", this.$route.query.keyword)
      }
      this.fetchData()
    },
    city(){    
        if (navigator.geolocation) {  //调用导航器geolocation函数
            var _this = this
            const geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function getinfo(position){
              _this.loand(position.point.lng,position.point.lat)
          })
        }
        else {
          this.$refs.myLocation.style.display = 'block'
          this.$refs.locating.style.display = 'none'
        }
    }, 
    // 经纬度转市省区
    loand(lng,lat) {
      let point = new BMap.Point(lng,lat);
      new BMap.Geocoder().getLocation(point, rs => {   //getLocation函数用来解析地址信息，分别返回省市区街等
          this.$message.info("已为您切换到当前城市")
          let addComp = rs.addressComponents;
          let province = addComp.province;//获取省份
          let city = addComp.city;//获取城市
          let district = addComp.district;//区
          this.selectedOptions = [ TextToCode[province].code, TextToCode[province][city].code, TextToCode[province][city][district].code]
          this.fetchData()
          this.$refs.myLocation.style.display = 'block'
          this.$refs.locating.style.display = 'none'
      });
    }, 
    // 筛选传参
    filterParams() {
      let locationArr = this.selectedOptions.filter( item => item)
      this.queryList = {
        rows: 25,
        page: 1,
        keyword: sessionStorage.getItem("searchContent")
      }
      if(locationArr.length === 1) this.queryList.province = CodeToText[locationArr[0]]
      if(locationArr.length === 2) this.queryList.city = CodeToText[locationArr[1]]
      if(locationArr.length === 3) this.queryList.district = CodeToText[locationArr[2]]
      this.currentPage = 1
    },
    // 获取首页列表
    async fetchData() {
      await this.filterParams()
      this.$http.getItemList(this.queryList).then( r =>{
        this.total = r.data.totalCount
        this.list = r.data.data
      })
    },
    // 进入详情
    detail(id) {
      // this.$router.push({path:"/searchDetail", query:{ id } });
       let routeData = this.$router.resolve({
          path: "/searchDetail",
          query:{ id }
        });
        window.open(routeData.href, '_blank');
    },
    search() {
      // console.log("????")
      sessionStorage.setItem("searchContent", this.keyword);
      this.queryList.keyword = this.keyword
      this.fetchData()
        // this.$router.push({ path: '/search', query:{keyword:this.keyword}})
    },
    handleCurrentChange(page) {
      this.currentPage = page
      sessionStorage.setItem("pageDetail", page);
      this.queryList.page = page
      this.fetchData()
    },
  }
};
</script>

<style scoped>
/* html{height:100%;}
body{
  height:100%;
} */
.container{
  position:relative;
  min-height:800px;
  background-color: #f8fafc;

}
.container .nav{
  width:100%;
  /* height:50px; */
  background:#fff;
  line-height:60px;
  display:flex;
  box-shadow: 0 8px 16px 0 rgba(28,31,33,.1);
}
.container .nav a{
  color:black;
  margin-left:48px;
}
.container .nav .search{
  width:400px;
  display:flex;
  position:relative;
  left:45%;
  transform:translateX(-50%);
  line-height:60px;
}
.container .nav .search .el-button{
  height:40px;
  margin: auto 0;
  border-radius:6px;
  margin-left:5px;
}
.container .location{ 
  position:absolute;
  right:30px;
  top:70px;
}
.container .location .locating{ 
  display:block
}
.container .location .my-location{ 
  display:none;
}
.items-info {
  padding: 15px;
  /* padding-top:15px; */
  display:flex;
  flex-wrap:wrap;
  /* justify-content:space-around; */
}
.items-info .items{
  width:215px;
  margin-left: 2.5%;
  margin-top: 40px;
  height:255px;
  margin-bottom: 30px;
  
}
.items-info .items .el-card{
  /* height: 260px; */
  height:100%;
  /* margin-bottom: 10px; */
  padding-top:20px;
  /* background-color: #FFF; */
  cursor: pointer;
  border-radius: 15px;
  
}

.items-info .items .el-card .photo_show{
  margin: 0 auto;
  width: 80%;
  height: 160px;
  /* border: 1px solid black; */
  /* background: url(../../assets/timg.jpg);
  background-size:contain;
  background-repeat: no-repeat;
  background-position: center; */
}
.items-info .items .el-card .photo_show img{
  width:100%;
  height:100%;
}

.items-info .items .el-card .describe_font{
  text-align: center;
  font-size: 13px;
}
.items-info .items .el-card .describe_font p{
  margin-top: 18px;
}
.items-info .items .el-card .describe_font p:nth-child(1){
  font-weight: bolder;
}
.items-info .items .el-card .describe_font p:nth-child(2){
  color:#ffd356;
}
.no-item {
  position:absolute;
  top:45%;
  left:50%;
  transform:translate(-50%,-50%);
  display:flex;
}
.no-item div{
  width:200px;
  height:200px;
  border:none;
  background:url(../../assets/cry.jpg);
  background-size:contain;
  background-repeat: no-repeat;
  background-position: center;
}
.no-item h4{
  line-height:200px;
}
.page{
  /* clear: both; */
  text-align: right;
  /* margin: 0 20px 20px ; */
  position:absolute;
  bottom:40px;
  right:0;
}
.footer-waper{
  background-color:#1c1f21;
  line-height:80px;
  text-align:center;
  font-size:13px;
  position:absolute;
  /* position: relative; */
  bottom:-80px;
  width:100%;
  color: #c8cdd2;

}

</style>