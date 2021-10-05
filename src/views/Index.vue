<template>
  <div class="common-layout">
    <!--第一部分-->
    <div style="background-color: white;width: 100%;height: 70px;padding-top: 1%;margin-bottom: 30px">
      <div style="display: flex;background-color: #f1f1f1;width: 95%;height: 50px;margin-left: 2%;">
        <div style="width: 5px;height:50px;background-color: darkgreen"></div>
        <div style="margin-top: 1%;padding-left: 10px">
          欢迎<span style="color: #1abc9c">{{user}}</span>
          当前时间:<span v-html="$options.filters.formatDate(date)"></span>
        </div>
      </div>
    </div>
    <!--第二部分-->
    <div style="background-color: white;width: 100%;height: 250px">
      <div style="font-size: 18px;padding-left:20px;padding-top: 15px">数据统计</div>
      <el-divider></el-divider>
      <div style="display: flex;">
        <div class="box">
          <div class="text">医生数</div>
          <div class="text1">{{doctor}}</div>
        </div>
        <div class="box">
          <div class="text">患者数</div>
          <div class="text1">{{patient}}</div>
        </div>
        <div class="box">
          <div class="text">护士数</div>
          <div class="text1">{{nurse}}</div>
        </div>
        <div class="box">
          <div class="text">就诊记录数</div>
          <div class="text1">{{advice}}</div>
        </div>
        <div class="box">
          <div class="text">项目检查记录数</div>
          <div class="text1">{{setCheck}}</div>
        </div>
        <div class="box">
          <div class="text">药品售出金额</div>
          <div class="text1">{{price}}</div>
        </div>
      </div>
    </div>
    <!--第三部分：开发团队-->
    <div style="background-color: white;width: 100%;height: 200px;padding-top: 1%;margin-top: 30px">
      <div style="font-size: 18px;padding-left:20px;padding-top: 15px">开发团队</div>
      <el-table :data="tableData" border style="width: 95%;margin-left: 20px;margin-top: 20px">
        <el-table-column prop="date" label="版权所有" width="675px"> </el-table-column>
        <el-table-column prop="name" label="开发者" width="670px"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import request from "../utils/request";
  export default {
    name: "Index",
    data() {
      return {
        tableData: [
          {
            date: '123',
            name: '123456',
          },
        ],
        doctor:'',
        price:'',
        patient:'',
        date:new Date(),
        nurse:'',
        setCheck:'',
        advice:'',
        user:JSON.parse(sessionStorage.getItem("user"))
      }
    },
    methods:{
      load(){
       /* request.get('/api/doctor/findCount').then(res=>{
          this.doctor = res.data
        })
        request.get('/api/setprice/findSum').then(res=>{
          this.price = res.data
        })
        request.get('/api/patient/findCount').then(res=>{
          this.patient = res.data
        })
        request.get('/api/nurse/findCount').then(res=>{
          this.nurse = res.data
        })
        request.get('/api/setcheck/findCount').then(res=>{
          this.setCheck = res.data
        })
        request.get('/api/advice/findCount').then(res=>{
          this.advice = res.data
        })*/
      }
    },
    mounted() {
      let _this = this; // 声明一个变量指向Vue实例this，保证作用域一致
      this.timer = setInterval(() => {
        _this.date = new Date(); // 修改数据date
      }, 1000)
    },
    created() {
      this.load()
    },
    beforeDestroy() {
      if (this.timer) {
        clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
      }
    },
    filters: {
      formatDate: function (value) {
        let date = new Date(value);
        let y = date.getFullYear();
        let MM = date.getMonth() + 1;
        MM = MM < 10 ? ('0' + MM) : MM;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let m = date.getMinutes();
        m = m < 10 ? ('0' + m) : m;
        let s = date.getSeconds();
        s = s < 10 ? ('0' + s) : s;
        return y + '<span style="color: #1abc9c;margin:0 10px">年</span>' + MM + '<span style="color: #1abc9c;margin:0 10px">月</span>' + d + '<span style="color: #1abc9c;margin:0 26px 0 10px">日</span> ' + h + ':' + m + ':' + s;
      }
    }
  }
</script>

<style scoped>
.box{
  background-color: #f1f1f1;
  width: 200px;
  height: 120px;
  margin-left: 30px;
}
.box>div{
  flex: 1;
}
.text{
  margin-left: 20px;
  margin-top: 20px;
  color: #666666;
}
.text1{
  color: forestgreen;
  font-size: 30px;
  margin-left: 20px;
  margin-top: 15px;
}
</style>
