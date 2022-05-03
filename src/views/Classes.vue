<!--
 * @Description: 班级管理
 * @Author: Wangyl
 * @Date: 2021-10-09 11:23:53
 * @LastEditors: Wangyl
 * @LastEditTime: 2022-05-03 15:08:47
-->

<template>
  <div class="common-layout">
    <el-container>
      <el-main>
        <el-button type="success" icon="el-icon-plus" @click="model = true,toAdd(),title='录入班级信息',btn=true" style="margin-left: 100px;">录入信息</el-button>
        <el-button type="danger" icon="el-icon-folder-delete" @click="deleteBatch" style="margin-left: 30px;">批量删除</el-button>

        <el-input placeholder="输入班级编号或班级名称" v-model="search"
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
                @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="id" label="Id" v-if="isShow"></el-table-column>
          <el-table-column prop="classesNum" label="班级编号" width="150px;"></el-table-column>
          <el-table-column prop="classesCode" label="班级编码"></el-table-column>
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
          <el-table-column prop="grade.professional.professionalName" label="所属专业" width="150px;"> </el-table-column>
          <el-table-column prop="grade.gradeName" label="所属年级"> </el-table-column>
          <el-table-column prop="teacher.teacherName" label="教导教师"> </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button type="primary" icon="el-icon-edit"  @click="model=true,title='编辑班级信息',btn=false,handleEdit(scope.$index, scope.row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)"></el-button>
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
          <el-dialog :title="title" v-model="model" width="25%" center>
            <el-form :label-position="labelPosition" label-width="80px" :model="classes_form"
                     :rules="rules"
                     ref="ruleForm">

              <el-input v-model="classes_form.classesId" v-if="isShow"></el-input>
              <el-form-item label="班级名称" prop="classesName">
                <el-input v-model="classes_form.classesName"></el-input>
              </el-form-item>
              <el-form-item label="人数限额" prop="classesAllNumber" :rules="[
                { required: true, message: '人数限额不能为空'},
                { type: 'number', message: '必须为数字值'}]">
                <el-input v-model.number="classes_form.classesAllNumber" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="教导教师">
                <el-select v-model="classes_form.teacher.teacherId" style="width:350px;" placeholder="请选择" filterable>
                  <el-option
                          v-for="item in teacher_list"
                          :key="item.teacherId"
                          :label="item.teacherName"
                          :value="item.teacherId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属院系">
                <el-select v-model="classes_form.grade.professional.college.collegeId" style="width:350px;" placeholder="请选择" filterable @change="findByCollegeId">
                  <el-option
                          v-for="item in college_list"
                          :key="item.collegeId"
                          :label="item.collegeName"
                          :value="item.collegeId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属专业">
                <el-select v-model="classes_form.grade.professional.professionalId" style="width:350px;" filterable placeholder="请选择" @change="findByProfessionalId">
                  <el-option
                          v-for="item in professional_list"
                          :key="item.professionalId"
                          :label="item.professionalName"
                          :value="item.professionalId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属年级">
                <el-select v-model="classes_form.grade.gradeId" style="width:350px;" filterable placeholder="请选择">
                  <el-option
                          v-for="item in grade_list"
                          :key="item.gradeId"
                          :label="item.gradeName"
                          :value="item.gradeId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                  <el-button @click="model = false">取 消</el-button>
                  <el-button type="success" v-if="btn" @click="add('ruleForm')">添 加</el-button>
                  <el-button type="primary" v-if="!btn" @click="edit('ruleForm')">修 改</el-button>
                  <el-button @click="resetForm('ruleForm')">重置</el-button>
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
    name: "Classes",
    components:{
      edit:Edit
    },
    data() {
      return {
        tableData: [],
        multipleSelection: [],
        currentPage: 1,
        pageSize:8,
        total:0,
        /*弹窗*/
        model:false,
        title:'',
        search:'',
        model:false,
        //表单对齐方式
        labelPosition: 'right',
        classes_form:{teacher:{},grade:{professional:{college:{}}}},
        isShow:false,
        btn:false,
        college_list:[],
        professional_list:[],
        grade_list:[],
        teacher_list:[],

        rules:{
          classesName: [
            { required: true, message: '请输入班级名称', trigger: 'blur' },
          ],
        },
      }
    },
    methods:{
      /*多选框*/
      handleSelectionChange(val) {
        this.multipleSelection = val
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
      handleEdit(index, row) {
        request.get('/api/classes/findById',{
          params:{
            classesId:row.classesId
          }
        }).then(res=>{
          if (res.code == 0){
            this.classes_form = res.data
          }else{
            console.log(res.message)
          }
        })
        request.get('/api/college/findAll').then(res=>{
          this.college_list = res.data
        })
        request.get('/api/teacher/findAll').then(res=>{
          this.teacher_list = res.data
        })

      },
      handleDelete(index, row) {
        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request.delete('/api/classes/deleteById',{
            params:{
              classesId:row.classesId
            }
          }).then(res=>{
            if(res.code == 0){
              ElMessage.success({
                message: res.message,
                type: 'success'
              });
              this.load();
            }else{
              ElMessage.error({
                message: res.message,
                type: 'error'
              });
            }
          })
        })
      },
      /*批量删除*/
      deleteBatch(){
        this.delIdr=[]
        if (this.multipleSelection.length <= 0){
          ElMessage.error({
            message: "请选择要删除数据",
            type: 'error'
          });
          return false;
        }else{
          for(let i = 0;i < this.multipleSelection.length;i++){
            this.delIdr[i] = this.multipleSelection[i].classesId
          }
          request.delete('/api/classes/deleteBatch',{
            params:{
              'ids':this.delIdr.toString()
            }
          }).then(res=>{
            if (res.code == 0){
              ElMessage.success({
                message: res.message,
                type: 'success'
              });
              this.load();
            }else{
              ElMessage.error({
                message: res.message,
                type: 'error'
              });
            }
          })
        }
      },
      toAdd(){
        this.classes_form = {teacher:{},grade: {professional:{college:{}}}}
        request.get('/api/college/findAll').then(res=>{
          this.college_list = res.data
        })
        request.get('/api/teacher/findAll').then(res=>{
          this.teacher_list = res.data
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
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.classes_form.teacher.teacherId == null || this.classes_form.teacher.teacherId == ""){
              ElMessage.error({
                message: "请选择教导教师",
                type: 'error'
              });
              return false
            }
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
            this.model = false;
            request.post('/api/classes/insert',this.classes_form).then(res=>{
              if (res.code == 0){
                ElMessage.success({
                  message: res.message,
                  type: 'success'
                });
                this.load();
              }else{
                ElMessage.error({
                  message: res.message,
                  type: 'error'
                });
              }
            })
          } else {
            ElMessage.error({
              message: "请添加完整信息",
              type: 'error'
            });
            return false
          }
        })
      },
      edit(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.model = false
            request.put('/api/classes/update',this.classes_form).then(res=>{
              if(res.code == 0){
                ElMessage.success({
                  message: res.message,
                  type: 'success'
                });
                this.load();
              }else{
                ElMessage.error({
                  message: res.message,
                  type: 'error'
                });
              }
            })
          } else {
            ElMessage.error({
              message: "请添加完整信息",
              type: 'error'
            });
            return false
          }
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
