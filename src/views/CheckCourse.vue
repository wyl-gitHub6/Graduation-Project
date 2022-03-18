<template>
  <div class="common-layout">
    <el-container>
      <el-main>
        <el-input placeholder="输入课程名称" v-model="search"
                  clearable style="width: 260px;margin-left: 150px;"></el-input>

        <el-button type="primary" @click="load" icon="el-icon-search" style="margin-left: 10px;margin-right: 30px;">搜索</el-button>

        <el-button type="danger" @click="deleteCheck()" plain>停课</el-button>

        <el-collapse v-model="activeName" accordion style="margin-top: 10px;">
          <el-collapse-item v-for="(item,index) in courseList" :name=index @click="findStudents(item.course.courseId,item.course.courseName)">
            <template #title>
              <div  style="width: 800px">
                <el-button type="success" plain>课程名称：{{item.course.courseName}}</el-button>
              </div>
            </template>

            <el-table
                    ref="multipleTable"
                    tooltip-effect="dark"
                    style="width: 100%"
                    bcar
                    :data="tableData.filter(data => !searchStudent || data.studentName.toLowerCase().includes(searchStudent.toLowerCase()))"
                    :header-cell-style="{textAlign: 'center'}"
                    :cell-style="{textAlign:'center'}"
                    :default-sort = "{prop: 'date', order: 'descending'}"
            >
              <el-table-column prop="id" label="Id" v-if="isShow"></el-table-column>
              <el-table-column prop="studentNum" label="学号"></el-table-column>
              <el-table-column prop="studentName" label="姓名"> </el-table-column>
              <el-table-column prop="studentAge" label="年龄"> </el-table-column>
              <el-table-column prop="studentNational" label="民族"> </el-table-column>
              <el-table-column prop="studentSex" label="性别">
                <template #default="scope">
                  <span v-if="scope.row.studentSex == 0" style="color: #20a0ff">男</span>
                  <span v-if="scope.row.studentSex == 1" style="color: #1abc9c">女</span>
                </template>
              </el-table-column>
              <el-table-column prop="studentCard" label="身份证号" width="170px;"> </el-table-column>
              <el-table-column prop="studentEmail" label="邮箱"> </el-table-column>
              <el-table-column prop="studentPhone" label="手机号" > </el-table-column>
              <el-table-column prop="classes.classesName" label="所在班级">
                <template #default="scope">
                  <span v-if="scope.row.classes.classesName == null" style="color: #20a0ff">未分班</span>
                  <span v-if="scope.row.classes.classesName != null" style="color: #1abc9c">{{scope.row.classes.classesName}}</span>
                </template>
              </el-table-column>
              <el-table-column align="right">
                <template #header>
                  <el-input v-model="searchStudent" size="medium" placeholder="按学生姓名搜索" />
                </template>
                <template #default="scope">
                  <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)"></el-button>
                </template>
              </el-table-column>
            </el-table>

            <!--分页开始-->
            <div class="block" style="margin-top:20px;text-align: center">
              <el-pagination
                      @size-change="handleSizeChangeStudent"
                      @current-change="handleCurrentChangeStudent"
                      :current-page="currentPageStudent"
                      :page-sizes="[5, 10, 15]"
                      :page-size="pageSizeStudent"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="totalStudent">
              </el-pagination>
            </div>
          </el-collapse-item>
        </el-collapse>

        <!--分页开始-->
        <div class="block" style="margin-top:20px;text-align: center">
          <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[5, 10, 15]"
                  :page-size="pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total">
          </el-pagination>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import request from "../utils/request";
  import { ElMessage } from 'element-plus';

  export default {
    name: "CheckCourse",
    data(){
      return{
        courseList:[],
        activeName:'',
        tableData: [],
        currentPage: 1,
        pageSize:5,
        total:0,
        currentPageStudent: 1,
        pageSizeStudent:5,
        totalStudent:0,
        search:'',
        isShow:false,
        searchStudent:'',
        courseId:'',
        courseName:'',
      }
    },
    methods:{
      /*分页*/
      handleSizeChange(val) {
        this.pageSize=val
        this.load()
      },
      handleCurrentChange(val) {
        this.currentPage=val
        this.load()
      },
      handleSizeChangeStudent(val) {
        this.pageSizeStudent=val
        this.findStudents(this.courseId,this.courseName)
      },
      handleCurrentChangeStudent(val) {
        this.currentPageStudent=val
        this.findStudents(this.courseId,this.courseName)
      },
      /*停课*/
      deleteCheck(){
        if (this.courseId == "" || this.courseId == null){
          ElMessage.error({
            message: '请选择要停止的选修课程',
            type: 'error'
          });
          return
        }

        this.$confirm('确认停止<<'+this.courseName+'>>课程吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request.get('/api/score/deleteCheck',{
            params:{
              courseId:this.courseId
            }
          }).then(res=>{
            if (res.code == 0){
              ElMessage.success({
                message: res.message,
                type: 'success'
              });
              this.load()
              this.courseId = ''
              this.courseName = ''
            }else{
              ElMessage.error({
                message: res.message,
                type: 'error'
              });
            }
          })
        })

      },
      findStudents(val1,val2){
        this.courseId = val1
        this.courseName = val2
        request.get("/api/score/findByCourseId",{
          params:{
            currentPage:this.currentPageStudent,
            pageSize:this.pageSizeStudent,
            courseId:val1
          }
        }).then(res=>{
          this.tableData = res.data.list[0].studentList
          this.totalStudent = res.data.total
        })
      },
      handleDelete(index,row){
        this.$confirm('确认取消选课吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request.get('/api/score/updateState',{
            params:{
              studentId:row.studentId,
              courseId:this.courseId
            }
          }).then(res=>{
            if (res.code == 0){
              ElMessage.success({
                message: res.message,
                type: 'success'
              });
              this.load()
              this.findStudents(this.courseId,this.courseName)
            }else{
              ElMessage.error({
                message: res.message,
                type: 'error'
              });
            }
          })
        })
      },
      load(){
        request.get("/api/score/findList",{
          params:{
            currentPage:this.currentPage,
            pageSize:this.pageSize,
            courseName:this.search
          }
        }).then(res=>{
          this.courseList = res.data.list
          this.total = res.data.total
        })
      }
    },
    created() {
      this.load()
    }
  }
</script>

<style scoped>

</style>
