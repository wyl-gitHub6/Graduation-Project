<template>
  <div class="common-layout">
    <!--第一部分-->
    <el-card shadow="hover">
      <div style="font-size: 18px;font-family: 'Adobe 黑体 Std R'">欢迎回来：{{user.userName}}</div>
      <el-divider></el-divider>
      <div style="display: flex;margin-left: 3%;background-color: #f1f1f1;width: 96%;height: 80px;">
        <div style="width: 5px;height:80px;background-color: darkgreen"></div>
        <div style="margin-top: 25px;padding-left: 45px;font-family: 'Adobe 黑体 Std R'">
          当前时间:<span v-html="$options.filters.formatDate(date)" style="margin-left: 15px;"></span>
        </div>
      </div>
    </el-card>

    <!--第二部分-->
    <el-card shadow="hover">
        <div style="font-size: 18px;font-family: 'Adobe 黑体 Std R'">数据统计</div>
        <el-divider></el-divider>
        <div style="display: flex;">
          <div class="box">
            <div class="text">院系总数</div>
            <div class="text1">{{college}}</div>
          </div>
          <div class="box">
            <div class="text">专业总数</div>
            <div class="text1">{{professional}}</div>
          </div>
          <div class="box">
            <div class="text">年级总数</div>
            <div class="text1">{{grade}}</div>
          </div>
          <div class="box">
            <div class="text">班级总数</div>
            <div class="text1">{{classes}}</div>
          </div>
          <div class="box">
            <div class="text">教师人数</div>
            <div class="text1">{{teacher}}</div>
          </div>
          <div class="box">
            <div class="text">学生人数</div>
            <div class="text1">{{student}}</div>
          </div>
        </div>
    </el-card>

    <el-card shadow="hover">
          <div style="font-size: 18px;font-family: 'Adobe 黑体 Std R'">系统信息</div>
          <el-divider></el-divider>
        <el-row>
          <el-col :span="8">
              <el-descriptions :column="3" border>
                <el-descriptions-item>
                  <template #label>
                    <i class="el-icon-loading"></i>
                    <span style="font-family: 'Adobe 黑体 Std R'">开发技术</span>
                  </template>
                  <span style="font-family: 'Adobe 黑体 Std R'">SpringBoot + MybatisPlus</span>
                </el-descriptions-item>
              </el-descriptions>
          </el-col>
          <el-col :span="8">
            <el-descriptions :column="3" border>
              <el-descriptions-item>
                <template #label>
                  <i class="el-icon-loading"></i>
                  <span style="font-family: 'Adobe 黑体 Std R'">前端技术</span>
                </template>
                <span style="font-family: 'Adobe 黑体 Std R'">Vue脚手架 + ElementUi开源框架</span>
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
          <el-col :span="8">
            <el-descriptions :column="3" border>
              <el-descriptions-item>
                <template #label>
                  <i class="el-icon-loading"></i>
                  <span style="font-family: 'Adobe 黑体 Std R'">数据库</span>
                </template>
                <span style="font-family: 'Adobe 黑体 Std R'">MySql数据库</span>
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>
      </el-card>
  </div>
</template>

<script>
  import request from "../utils/request";
  export default {
    name: "Index",
    data() {
      return {
        college:'',
        professional:'',
        grade:'',
        classes:'',
        teacher:'',
        student:'',
        date:new Date(),
        user:JSON.parse(sessionStorage.getItem("user"))
      }
    },
    methods:{
      load(){
        request.get('/api/college/findCount').then(res=>{
          this.college = res.data
        })
        request.get('/api/professional/findCount').then(res=>{
          this.professional = res.data
        })
        request.get('/api/grade/findCount').then(res=>{
          this.grade = res.data
        })
        request.get('/api/classes/findCount').then(res=>{
          this.classes = res.data
        })
        request.get('/api/teacher/findCount').then(res=>{
          this.teacher = res.data
        })
        request.get('/api/student/findCount').then(res=>{
          this.student = res.data
        })
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
.el-card{
  margin-left: 10px;
  margin-top: 1%;
  margin-bottom: 3%;
}
.box{
  background-color: #f1f1f1;
  width: 200px;
  height: 80px;
  margin-left: 3%;
  margin-right: 1%;
  align-content: center;
}
.box>div{
  flex: 1;
}
.text{
  margin-left: 65px;
  margin-top: 5px;
  color: #666666;
  font-family: 'Adobe 黑体 Std R'
}
.text1{
  color: forestgreen;
  font-size: 30px;
  margin-left: 90px;
  margin-top: 5px;
}

</style>
