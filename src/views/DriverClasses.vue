<template>
  <div class="common-layout">
    <el-container>
      <el-main>
        <el-button type="success" icon="el-icon-s-order" @click="model = true,toAdd(),title='选择院系-专业-年级',btn=true" style="margin-left: 100px;">详细选择</el-button>
        <el-button type="info" v-if="btnShow" @click="btnShow=false,load()">取消选择</el-button>

        <el-input placeholder="输入班级或班级名称" v-model="search"
                  clearable style="width: 260px;margin-left: 150px;"></el-input>
        <el-button type="primary" @click="load" icon="el-icon-search" style="margin-left: 10px;">搜索</el-button>
        <br><br>

        <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                bcar
                :header-cell-style="{textAlign: 'center'}"
                :cell-style="{textAlign:'center'}"
                :default-sort = "{prop: 'date', order: 'descending'}"
        >
          <el-table-column prop="id" label="Id" v-if="isShow"></el-table-column>
          <el-table-column prop="classesNum" label="班级编号"></el-table-column>
          <el-table-column prop="classesName" label="班级名称"> </el-table-column>
          <el-table-column prop="classesAllNumber" label="人数限额"> </el-table-column>
          <el-table-column prop="classesNumber" label="当前人数">
            <template #default="scope">
              <span v-if="scope.row.classesNumber == 0" style="color: red">0</span>
              <span v-if="scope.row.classesNumber != 0" style="color: #20a0ff">{{scope.row.classesNumber}}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template #default="scope">
              <span v-if="scope.row.classesNumber == scope.row.classesAllNumber" style="color: red">已满</span>
              <span v-if="scope.row.classesNumber != scope.row.classesAllNumber" style="color: #20a0ff">未满</span>
            </template>
          </el-table-column>
          <el-table-column prop="grade.professional.college.collegeName" label="所属院系"> </el-table-column>
          <el-table-column prop="grade.professional.professionalName" label="所属专业"> </el-table-column>
          <el-table-column prop="grade.gradeName" label="所属年级"> </el-table-column>
          <el-table-column prop="teacher.teacherName" label="教导教师"> </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button type="primary" v-if="scope.row.classesNumber != scope.row.classesAllNumber" icon="el-icon-loading"
                         @click="title='添加学生',Model=true,handleDelete(scope.$index, scope.row),loadStudent()">分班</el-button>
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

        <!--弹框开始-->
        <div>
          <el-dialog :title="title" v-model="model" width="30%" center>
            <el-form :label-position="labelPosition" label-width="80px" :model="classes_form"
                     ref="ruleForm">
            <div style="margin-left: 95px;">
              <el-form-item label="所属院系">
                <el-select v-model="classes_form.grade.professional.college.collegeId" placeholder="请选择" filterable @change="findByCollegeId">
                  <el-option
                          v-for="item in college_list"
                          :key="item.collegeId"
                          :label="item.collegeName"
                          :value="item.collegeId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属专业">
                <el-select v-model="classes_form.grade.professional.professionalId" filterable placeholder="请选择" @change="findByProfessionalId">
                  <el-option
                          v-for="item in professional_list"
                          :key="item.professionalId"
                          :label="item.professionalName"
                          :value="item.professionalId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属年级">
                <el-select v-model="classes_form.grade.gradeId" filterable placeholder="请选择">
                  <el-option
                          v-for="item in grade_list"
                          :key="item.gradeId"
                          :label="item.gradeName"
                          :value="item.gradeId">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                  <el-button @click="model = false">取 消</el-button>
                  <el-button type="success" v-if="btn" @click="add('ruleForm')">选择</el-button>
                  <el-button @click="resetForm('ruleForm')">重置</el-button>
                </span>
            </template>
          </el-dialog>
        </div>

        <!--分班弹窗-->
        <div>
          <el-dialog :title="title" v-model="Model" width="50%" center>
            <el-form :label-position="labelPosition" label-width="80px"
                     ref="ruleForm">
              <!--当前班级-->
              <el-collapse v-model="activeNames">
                <el-collapse-item :title=classes_form.classesName name="1">
                  <template #title>
                    <div  style="width: 200px;">
                      <el-button type="primary" plain><i class="el-icon-caret-right"></i> 班级名称:{{classes_form.classesName}}</el-button>
                    </div>
                  </template>
                  <div>
                    <div style="width: 100%;text-align: center">

                      <el-descriptions
                              class="margin-top"
                              :column="3"
                              size="medium"
                              border
                      >
                        <template #title>
                          <div  style="width: 500px">
                            <el-tag style="margin-left: 80%" size="medium">当前班级信息信息</el-tag>
                          </div>
                        </template>

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
                </el-collapse-item>
              </el-collapse>

              <!--学生列表-->
              <el-table
                      ref="multipleTable"
                      :data="studentData.filter(data => !searchStudent || data.studentName.toLowerCase().includes(searchStudent.toLowerCase()))"
                      tooltip-effect="dark"
                      style="width: 100%"
                      bcar
                      :header-cell-style="{textAlign: 'center'}"
                      :cell-style="{textAlign:'center'}"
                      :default-sort = "{prop: 'date', order: 'descending'}"
                      @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="55"> </el-table-column>
                <el-table-column prop="id" label="Id" v-if="isShow"></el-table-column>
                <el-table-column prop="studentNum" label="学号">
                  <template #default="scope">
                    <div class="name-wrapper">
                      <el-tag size="medium">{{ scope.row.studentNum }}</el-tag>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="姓名">
                  <template #default="scope">
                    <el-popover effect="light" trigger="hover" placement="top" width="200px">
                      <template #default>
                        <p>年龄: {{ scope.row.studentAge }}</p>
                        <p>民族: {{ scope.row.studentNational }}</p>
                        <p>邮箱: {{ scope.row.studentEmail }}</p>
                        <p>手机号: {{ scope.row.studentPhone }}</p>
                      </template>
                      <template #reference>
                        <div class="name-wrapper">
                          <el-tag size="medium">{{ scope.row.studentName }}</el-tag>
                        </div>
                      </template>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column prop="studentSex" label="性别">
                  <template #default="scope">
                    <div class="name-wrapper">
                      <el-tag size="medium" v-if="scope.row.studentSex == 0" style="color: #20a0ff">男</el-tag>
                      <el-tag size="medium" v-if="scope.row.studentSex == 1" style="color: #1abc9c">女</el-tag>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="studentCard" label="身份证号" width="170px;">
                  <template #default="scope">
                    <div class="name-wrapper">
                      <el-tag size="medium">{{ scope.row.studentCard }}</el-tag>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="right">
                  <template #header>
                    <el-input v-model="searchStudent" size="mini" placeholder="输入学生姓名搜索" />
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

            </el-form>
            <template #footer>
                <span class="dialog-footer">
                  <el-button @click="Model = false">取 消</el-button>
                  <el-button type="primary" @click="driver()">添加</el-button>
                </span>
            </template>
          </el-dialog>
        </div>

      </el-main>
    </el-container>
  </div>
</template>

<script>
  import { Edit } from '@element-plus/icons'
  import request from "../utils/request";
  import { ElMessage } from 'element-plus';

  export default {
    name: "DriverClasses",
    components:{
      edit:Edit
    },
    data() {
      return {
        tableData: [],
        studentData: [],
        multipleSelection: [],
        currentPage: 1,
        pageSize:5,
        total:0,
        currentPageStudent: 1,
        pageSizeStudent:4,
        totalStudent:0,
        /*弹窗*/
        model:false,
        /*分班弹窗*/
        Model:false,
        title:'',
        search:'',
        searchStudent:'',
        model:false,
        //表单对齐方式
        labelPosition: 'right',
        classes_form:{teacher:{},grade:{professional:{college:{}}}},
        student_form:{},
        isShow:false,
        btn:false,
        college_list:[],
        professional_list:[],
        grade_list:[],
        activeNames: ['1'],
        idr:[],
        btnShow:false,
      }
    },
    methods:{
      /*多选框*/
      handleSelectionChange(val) {
        this.multipleSelection = val
        console.log(this.multipleSelection);
      },
      /*分页*/
      handleSizeChange(val) {
        this.pageSize=val
        this.load()
      },
      handleCurrentChange(val) {
        this.currentPage=val
        this.load()
      },
      /*学生列表分页*/
      handleSizeChangeStudent(val) {
        this.pageSize=val
        this.loadStudent()
      },
      handleCurrentChangeStudent(val) {
        this.currentPage=val
        this.loadStudent()
      },
      /*查看未分班学生与当前班级信息*/
      handleDelete(index, row) {
        request.get('/api/classes/findById',{
          params:{
            classesId:row.classesId,
          }
        }).then(res=>{
          if (res.code == 0){
            this.classes_form = res.data
          }
        })
      },
      loadStudent(){
        request.get('/api/student/findByClassesId',{
          params:{
            classesId:0,
            currentPage:this.currentPageStudent,
            pageSize:this.pageSizeStudent
          }
        }).then(res=>{
          this.studentData = res.data.list
          this.totalStudent = res.data.total
        })
      },
      /*分班开始*/
      driver(){
        this.Idr=[]
        if (this.multipleSelection.length <= 0){
          ElMessage.error({
            message: "请选择要分班的学生",
            type: 'error'
          });
          return false;
        }else{
          this.Model = false
          this.searchStudent = ''
          for(let i = 0;i < this.multipleSelection.length;i++){
            this.Idr[i] = this.multipleSelection[i].studentId
          }
           request.get('/api/classes/driver',{
             params:{
               ids:this.Idr.toString(),
               classesId:this.classes_form.classesId
             }
           }).then(res=>{
             if (res.code == 0){
               ElMessage.success({
                 message: res.message,
                 type: 'success'
               });
               this.load();
             }
           })
        }
      },
      /*分班结束*/

      toAdd(){
        this.classes_form = {teacher:{},grade: {professional:{college:{}}}}
        request.get('/api/college/findAll').then(res=>{
          this.college_list = res.data
        })
      },
      findByCollegeId(){
        this.classes_form.grade.professional.professionalId = ''
        this.classes_form.grade.gradeId = ''
        this.professional_list = []
        this.grade_list = []
        request.get('/api/professional/findByCollegeId',{
          params:{
            collegeId:this.classes_form.grade.professional.college.collegeId
          }
        }).then(res=>{
          this.professional_list = res.data
        })
      },
      findByProfessionalId(){
        this.classes_form.grade.gradeId = ''
        this.grade_list = []
        request.get('/api/grade/findByProfessionalId',{
          params:{
            professionalId:this.classes_form.grade.professional.professionalId
          }
        }).then(res=>{
          this.grade_list = res.data
        })
      },
      add(formName){
          if (this.classes_form.grade.professional.college.collegeId == null ||
                  this.classes_form.grade.professional.college.collegeId == ""){
            ElMessage.error({
              message: "请选择所属院系",
              type: 'error'
            });
            return false
          }
          if (this.classes_form.grade.professional.professionalId == null ||
                  this.classes_form.grade.professional.professionalId == ""){
            ElMessage.error({
              message: "请选择所属专业",
              type: 'error'
            });
            return false
          }
          if (this.classes_form.grade.gradeId == null || this.classes_form.grade.gradeId == ""){
            ElMessage.error({
              message: "请选择所属年级",
              type: 'error'
            });
            return false
          }
          this.model = false
          this.btnShow = true
          request.get('/api/classes/findByGradeId',{
            params:{
              currentPage:this.currentPage,
              pageSize:this.pageSize,
              classesNum:this.search,
              classesName:this.search,
              gradeId:this.classes_form.grade.gradeId
            }
          }).then(res=>{
            this.tableData = res.data.list
            this.total = res.data.total
          })
      },
      load(){
        request.get('api/classes/findList',{
          params:{
            currentPage:this.currentPage,
            pageSize:this.pageSize,
            classesNum:this.search,
            classesName:this.search
          }
        }).then(res=>{
          this.tableData = res.data.list
          this.total = res.data.total
        })
      },
      //重置
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.classes_form.grade.professional.college.collegeId = ''
        this.classes_form.grade.professional.professionalId = ''
        this.classes_form.grade.gradeId = ''
        this.classes_form.teacher.teacherId = ''
      },
    },
    created() {
      this.load()
    }
  }
</script>

<style scoped>

</style>
