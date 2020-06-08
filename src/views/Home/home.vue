<template>
  <div class="container">
    <layout v-on:setPage="setPage"></layout>
    <!-- <location></location> -->
    <div class="location">
      <span ref="locating">正在定位...</span>
      <div class="my-location" ref="myLocation">
      <el-cascader size="mini" :options="options" v-model="selectedOptions"></el-cascader>
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
        <h4>该分类下暂无物品，快去发布吧</h4>
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
// import { getCurrentLocation } from "../../utils/getCurrentLocation"
export default {
  name: "home",
  data() {
    return {
      currentPage: 1,
      total:0,
      // list:[{itemName:"笔记本哒哒哒哒哒哒",price:10,chargType:0,id:1},{itemName:1},{itemName:1},{itemName:1},{},{},{},{},{},{},{},{},{},{},{},{}],
      list:[],
      queryList: {
        rows: 25,
        page: 1
      },
      options: regionDataPlus,
      locationList:{}

    };
  },

  created(){
    this.getStorageData()
    
  },
  mounted() {
    this.city()
  },
  computed: {
    selectedOptions: {
      get(){
        return this.$store.state.location;
      },
      set(location) {
        this.$store.dispatch("changLocationAc",location)
        this.fetchData()
      }
    }
  },
  methods: {
    //若vuex没存储地址，则自动获取城市
    city(){    
        if(this.$store.state.location.length !== 0) {
          this.$refs.myLocation.style.display = 'block'
          this.$refs.locating.style.display = 'none'
        }
        else {
          if (navigator.geolocation) {  //调用导航器geolocation函数
              var _this = this
              const geolocation = new BMap.Geolocation();
              geolocation.getCurrentPosition(function getinfo(position){
                _this.loand(position.point.lng,position.point.lat)
            })
          } else {
              alert("您的浏览器不支持地理定位");//不支持
          }
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
          let location = [ TextToCode[province].code, TextToCode[province][city].code, TextToCode[province][city][district].code]
          this.$store.dispatch("changLocationAc",location)
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
        itemTypeName:sessionStorage.getItem("itemType")? sessionStorage.getItem("itemType") : "全部"
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
    // 点击导航条，初始化当前页
    setPage(title){ 
      this.queryList.itemTypeName = title
      this.reset()        
    },
    reset() {
      this.currentPage = 1
      this.queryList.page = 1
      this.fetchData()
    },
    // 获取storage存储的值
    getStorageData() {    
      if(sessionStorage.key("itemType")) {
        this.queryList.itemTypeName = sessionStorage.getItem("itemType")
          // 若为ture，表从详情跳转过来
          if(this.$route.params.page) {
            this.currentPage = parseInt(sessionStorage.getItem("page"));
            this.queryList.page = this.currentPage
            this.fetchData()
          }
          // 否表刷新页面
          else {
            this.reset()
          } 
      }
      else{
        this.queryList.itemTypeName = "全部"
        this.fetchData()
      }
      // sessionStorage.key("itemType")? this.queryList.itemTypeName = sessionStorage.getItem("itemType"): 
    },
    //点击页码，设置页码
    handleCurrentChange(page) {
      this.currentPage = page
      sessionStorage.setItem("page", page);
      this.queryList.page = page
      this.fetchData()
    },
    // 进入详情
    detail(id) {
      this.$router.push({path:"/detail", query:{ id } });
    },
    // addressChange(location) {
    //   // this.$store.dispatch("changLocationAc",location)
    // },
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
  /* height:100%; */
  background-color: #f8fafc;
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
  /* width: 1252px;
  margin: 0 auto; */
  /* justify-content:space-between; */
  /* align-items: flex-start; */
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
  /* color:skyblue; */
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