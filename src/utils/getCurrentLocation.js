import BMap from 'BMap'

export function getCurrentLocation() {
    console.log("进来")
    // let locationArr = []
    const geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function getinfo(pos){
        let point = new BMap.Point(pos.point.lng,pos.point.lat);
        let arr = new BMap.Geocoder().getLocation(point, rs => {   //getLocation函数用来解析地址信息，分别返回省市区街等
            var addComp = rs.addressComponents;
            let  province = addComp.province;//获取省份
            let  city = addComp.city;//获取城市
            let  district = addComp.district;//区
            console.log(city)
            return  province
        });
        console.log(arr)

    })
    // console.log(locationArr)
    // 返回省、市、区
    // return  {
    //     province: province,
    //     city: city,
    //     district: district
    // }
    // return province
}

