<!--
 * @Description: 排课
 * @Author: Wangyl
 * @Date: 2021-10-06 16:54:37
 * @LastEditors: Wangyl
 * @LastEditTime: 2022-04-28 21:10:55
-->

<template>
  <div class="common-layout">
    <el-container>
      <el-main>

        <el-button type="success" icon="el-icon-plus" @click="model = true,toAdd()" style="margin-left: 100px;">排课</el-button>

        <el-collapse v-model="activeName" accordion style="margin-top: 10px;">
          <el-collapse-item v-for="(item,index) in arrangList" :name=index @click="findCourse(item.classesId)">
            <template #title>
              <div  style="width: 800px">
                <el-button type="success" plain>班级名称：{{item.classesName}}</el-button>
              </div>
            </template>

            <el-descriptions
                    class="margin-top"
                    :column="2"
                    size="medium"
                    border
            >
              <el-descriptions-item v-for="item in courseList">
                <template #label>
                  <el-tag size="50px;" style="margin-left: 3px;margin-bottom: 5px;"><i class="el-icon-loading"></i>课程名称</el-tag>
                  <el-tag size="50px;" style="margin-left: 3px;margin-bottom: 5px;"><i class="el-icon-loading"></i>课程编号</el-tag>
                  <el-tag size="50px;" style="margin-left: 3px;margin-bottom: 5px;"><i class="el-icon-loading"></i>课程描述</el-tag>
                  <el-tag size="50px" style="margin-left: 3px;margin-bottom: 5px;"><i class="el-icon-loading"></i>学分</el-tag>
                  <el-button type="primary" style="margin-left: 10px;" icon="el-icon-delete" size="small" @click="deleteCourse(item.courseId)"></el-button>
                </template>
                <el-tag  size="50px" style="margin-left: 5px;margin-bottom: 5px;">{{item.courseName}}</el-tag>
                <el-tag  size="50px" style="margin-left: 5px;margin-bottom: 5px;">{{item.courseNum}}</el-tag>
                <el-tag  size="50px" style="margin-left: 5px;margin-bottom: 5px;">{{item.courseDesc}}</el-tag>
                <el-tag  size="50px" style="margin-left: 5px;margin-bottom: 5px;">{{item.courseCredit}}</el-tag>
              </el-descriptions-item>

            </el-descriptions>


          </el-collapse-item>
        </el-collapse>

        <!--分页开始-->
        <div class="block" style="margin-top:20px;text-align: center">
          <el-pagination
                  @size-change="handleSizeChangeClasses"
                  @current-change="handleCurrentChangeClasses"
                  :current-page="currentPageClasses"
                  :page-sizes="[5, 10, 15]"
                  :page-size="pageSizeClasses"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="totalClasses">
          </el-pagination>
        </div>

        <!--三级联动-->
        <el-dialog title="院校-专业-年级-班级" v-model="model" width="25%" center>
          <el-form :label-position="labelPosition" label-width="80px"
                   ref="ruleForm">
            <div style="margin-left: 50px;">
            <el-form-item label="选择院系">
              <el-select v-model="collegeId" placeholder="请选择" filterable @change="findByCollegeId">
                <el-option
                        v-for="item in college_list"
                        :key="item.collegeId"
                        :label="item.collegeName"
                        :value="item.collegeId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择专业">
              <el-select v-model="professionalId" filterable placeholder="请选择" @change="findByProfessionalId">
                <el-option
                        v-for="item in professional_list"
                        :key="item.professionalId"
                        :label="item.professionalName"
                        :value="item.professionalId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择年级">
              <el-select v-model="gradeId" filterable placeholder="请选择" @change="findByGradeId">
                <el-option
                        v-for="item in grade_list"
                        :key="item.gradeId"
                        :label="item.gradeName"
                        :value="item.gradeId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择班级">
              <el-select v-model="classesId" filterable placeholder="请选择">
                <el-option
                        v-for="item in classes_list"
                        :key="item.classesId"
                        :label="item.classesName"
                        :value="item.classesId">
                </el-option>
              </el-select>
            </el-form-item>
            </div>
          </el-form>
          <template #footer>
                <span class="dialog-footer">
                  <el-button @click="model = false">取 消</el-button>
                  <el-button type="success" @click="check">确 定</el-button>
                  <el-button @click="resetForm">重置</el-button>
                </span>
          </template>
        </el-dialog>

        <!--排课-->
        <el-drawer
                size="75%"
                v-model="drawer"
                :direction="direction"
                :before-close="handleClose"
                destroy-on-close>
        <template #title>
          <el-button plain type="primary" @click="open"> 安排必修课 </el-button>
        </template>
        <div>
          <div>
            <div style="width: 100%;text-align: center">
              <el-descriptions
                      class="margin-top"
                      :column="4"
                      size="medium"
                      border
              >
                <template #title>
                  <div  style="width: 800px">
                    <el-tag style="margin-left: 77%" size="medium">当前班级信息信息</el-tag>
                  </div>
                </template>

                <el-descriptions-item>
                  <template #label>
                    <el-tag size="medium"><i class="el-icon-loading"></i>班级名称</el-tag>
                  </template>
                  <el-tag  size="medium">{{classes_form.classesName}}</el-tag>
                </el-descriptions-item>

                <el-descriptions-item>
                  <template #label>
                    <el-tag size="medium"><i class="el-icon-loading"></i>班级编号</el-tag>
                  </template>
                  <el-tag  size="medium">{{classes_form.classesNum}}</el-tag>
                </el-descriptions-item>

                <el-descriptions-item>
                  <template #label>
                    <el-tag size="medium"><i class="el-icon-loading"></i>人数限额</el-tag>
                  </template>
                  <el-tag  size="medium">{{classes_form.classesAllNumber}}</el-tag>
                </el-descriptions-item>

                <el-descriptions-item>
                  <template #label>
                    <el-tag size="medium"><i class="el-icon-loading"></i>当前人数</el-tag>
                  </template>
                  <el-tag  size="medium">{{classes_form.classesNumber}}</el-tag>
                </el-descriptions-item>

                <el-descriptions-item>
                  <template #label>
                    <el-tag size="medium"><i class="el-icon-loading"></i>教导教师</el-tag>
                  </template>
                  <el-tag  size="medium">{{classes_form.teacher.teacherName}}</el-tag>
                </el-descriptions-item>

                <el-descriptions-item>
                  <template #label>
                    <el-tag size="medium"><i class="el-icon-loading"></i>所属院系</el-tag>
                  </template>
                  <el-tag  size="medium">{{classes_form.grade.professional.college.collegeName}}</el-tag>
                </el-descriptions-item>

                <el-descriptions-item>
                  <template #label>
                    <el-tag size="medium"><i class="el-icon-loading"></i>所属专业</el-tag>
                  </template>
                  <el-tag  size="medium">{{classes_form.grade.professional.professionalName}}</el-tag>
                </el-descriptions-item>

                <el-descriptions-item>
                  <template #label>
                    <el-tag size="medium"><i class="el-icon-loading"></i>所属年级</el-tag>
                  </template>
                  <el-tag  size="medium">{{classes_form.grade.gradeName}}</el-tag>
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </div>
          <br><br>
          <div>
            <el-table
                    ref="multipleTable"
                    tooltip-effect="dark"
                    style="width: 100%"
                    bcar
                    :data="tableData.filter(data => !search || data.courseName.toLowerCase().includes(search.toLowerCase()))"
                    :header-cell-style="{textAlign: 'center'}"
                    :cell-style="{textAlign:'center'}"
                    :default-sort = "{prop: 'date', order: 'descending'}"
                    @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="30"> </el-table-column>
              <el-table-column prop="id" label="Id" v-if="isShow"></el-table-column>
              <el-table-column prop="courseNum" label="课程编号"></el-table-column>
              <el-table-column prop="courseName" label="课程名称"> </el-table-column>
              <el-table-column prop="courseDesc" label="课程描述"> </el-table-column>
              <el-table-column label="照片" width="100px;">
                <template #default="scope">
                  <img :src="scope.row.courseImg" alt="" style="height: 80px;">
                </template>
              </el-table-column>
              <el-table-column label="课程类别" width="100px;">
                <template #default="scope">
                  <span v-if="scope.row.courseState == 0" style="color: #20a0ff">必修课</span>
                  <span v-if="scope.row.courseState == 1" style="color: #1abc9c">选修课</span>
                </template>
              </el-table-column>
              <el-table-column prop="courseCredit" label="学分"> </el-table-column>
              <el-table-column prop="startTime" label="开课日期"> </el-table-column>
              <el-table-column prop="endTime" label="结束日期"> </el-table-column>
              <el-table-column prop="teacher.teacherName" label="任课教师"> </el-table-column>
              <el-table-column align="right">
                <template #header>
                  <el-input v-model="search" size="medium" placeholder="按课程名称搜索" />
                </template>
              </el-table-column>
            </el-table>

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
          </div>
        </div>
        </el-drawer>

      </el-main>
    </el-container>
  </div>
</template>

<script>
  import request from "../utils/request";
  import { ElMessage } from 'element-plus';

  export default {
    name: "ChooseCourse",
    data(){
      return{
        activeName:'',
        arrangList:'',
        labelPosition: 'right',
        college_list:[],
        professional_list:[],
        grade_list:[],
        classes_list:[],
        collegeId:'',
        professionalId:'',
        gradeId:'',
        classesId:'',
        model:false,
        drawer: false,
        direction: 'rtl',
        activeNames:1,
        classes_form:{teacher:{},grade:{professional:{college:{}}}},
        courseList:[],
        classes_id:'',

        tableData: [],
        multipleSelection: [],
        currentPage: 1,
        pageSize:4,
        total:0,
        currentPageClasses: 1,
        pageSizeClasses:8,
        totalClasses:0,
        search:'',
        isShow:false,
        courseIdr:[],
      }
    },
    methods:{
      // 安排必修课
      open() {
        this.courseIdr = []
        if (this.multipleSelection.length == 0){
          ElMessage.error({
            message: "请选择课程",
            type: 'error'
          });
          return false
        }
        for(let i = 0;i < this.multipleSelection.length;i++){
          this.courseIdr[i] = this.multipleSelection[i].courseId
        }
        request.get('/api/arrang/arrangCourse',{
          params:{
            courseIdr:this.courseIdr.toString(),
            classesId:this.classes_form.classesId
          }
        }).then(res=>{
          if (res.code == 0){
            ElMessage.success({
              message: res.message,
              type: 'success'
            });
          }
          this.drawer = false
          this.findCourse(this.classes_id)
          this.load()
        })
      },
      /*多选框*/
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      /*分页*/
      handleSizeChange(val) {
        this.pageSize=val
        this.courseLoad()
      },
      handleCurrentChange(val) {
        this.currentPage=val
        this.courseLoad()
      },
      handleSizeChangeClasses(val) {
        this.pageSizeClasses=val
        this.load()
      },
      handleCurrentChangeClasses(val) {
        this.currentPageClasses=val
        this.load()
      },
      findByCollegeId(){
        this.professionalId = ''
        this.gradeId = ''
        this.classesId = ''
        this.professional_list = []
        this.grade_list = []
        this.classes_list = []
        request.get('/api/professional/findByCollegeId',{
          params:{
            collegeId:this.collegeId
          }
        }).then(res=>{
          this.professional_list = res.data
        })
      },
      findByProfessionalId(){
        this.gradeId = ''
        this.classesId = ''
        this.grade_list = []
        this.classes_list = []
        request.get('/api/grade/findByProfessionalId',{
          params:{
            professionalId:this.professionalId
          }
        }).then(res=>{
          this.grade_list = res.data
        })
      },
      findByGradeId(){
        request.get('/api/classes/findByGradeId',{
          params:{
            gradeId:this.gradeId
          }
        }).then(res=>{
          this.classes_list = res.data.list
        })
      },
      toAdd(){
        this.collegeId = ''
        this.professionalId = ''
        this.gradeId = ''
        this.classesId = ''
        request.get('/api/college/findAll').then(res=>{
          this.college_list = res.data
        })
      },
      check(){
        if (this.collegeId == null || this.collegeId == ""){
          ElMessage.error({
            message: "请选择院系",
            type: 'error'
          });
          return false
        }
        if (this.professionalId == null || this.professionalId == ""){
          ElMessage.error({
            message: "请选择专业",
            type: 'error'
          });
          return false
        }
        if (this.gradeId == null || this.gradeId == ""){
          ElMessage.error({
            message: "请选择年级",
            type: 'error'
          });
          return false
        }
        if (this.classesId == null || this.classesId == ""){
          ElMessage.error({
            message: "请选择班级",
            type: 'error'
          });
          return false
        }
        request.get('/api/classes/findById',{
          params:{
            classesId:this.classesId
          }
        }).then(res=>{
          this.classes_form = res.data
        })
        this.courseLoad()
        this.model = false
        this.drawer = true
      },
      courseLoad(){
        request.get('/api/course/findList',{
          params:{
            currentPage:this.currentPage,
            pageSize:this.pageSize,
            courseState:0
          }
        }).then(res=>{
          this.tableData = res.data.list
          this.total = res.data.total
        })
      },
      findCourse(val){
        this.classes_id = val
        request.get('/api/arrang/findByClassesId',{
          params:{
            classesId:val
          }
        }).then(res=>{
          this.courseList = res.data[0].courseList
        })
      },
      deleteCourse(val){
        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request.delete('/api/arrang/delete',{
            params:{
              courseId:val,
              classesId:this.classes_id
            }
          }).then(res=>{
            if (res.code == 0){
              ElMessage.success({
                message: res.message,
                type: 'success'
              });
            }
            this.findCourse(this.classes_id)
          })
        })
      },
      load(){
        request.get('/api/arrang/findClasses',{
          params:{
            currentPage:this.currentPageClasses,
            pageSize:this.pageSizeClasses
          }
        }).then(res=>{
          this.arrangList = res.data.list
          this.totalClasses = res.data.total
        })

      },
      resetForm() {
        this.collegeId = ''
        this.professionalId = ''
        this.gradeId = ''
        this.classesId = ''
      },
      handleClose(done) {
        this.drawer = false
      }
    },
    created() {
      this.load()
    }
  }
</script>

<style scoped>

</style>
