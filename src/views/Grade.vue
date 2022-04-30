<!--
 * @Description: 年级管理
 * @Author: Wangyl
 * @Date: 2021-10-08 18:34:02
 * @LastEditors: Wangyl
 * @LastEditTime: 2022-04-30 16:06:29
-->

<template>
  <div class="common-layout">
    <el-container>
      <el-main>
        <el-button type="success" icon="el-icon-plus" @click="model = true,toAdd(),title='录入年级信息',btn=true" style="margin-left: 100px;">录入信息</el-button>
        <el-button type="danger" icon="el-icon-folder-delete" @click="deleteBatch" style="margin-left: 30px;">批量删除</el-button>

        <el-input placeholder="输入年级编号或年级名称" v-model="search"
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
          <el-table-column prop="gradeNum" label="年级编号"></el-table-column>
          <el-table-column prop="gradeName" label="年级名称"> </el-table-column>
          <el-table-column prop="professional.college.collegeName" label="所属院系"> </el-table-column>
          <el-table-column prop="professional.professionalName" label="所属专业"> </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button type="primary" icon="el-icon-edit"  @click="model=true,title='编辑年级信息',btn=false,handleEdit(scope.$index, scope.row)"></el-button>
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
            <el-form :label-position="labelPosition" label-width="80px" :model="grade_form"
                     :rules="rules"
                     ref="ruleForm">

              <el-input v-model="grade_form.gradeId" v-if="isShow"></el-input>
              <el-form-item label="年级名称" prop="gradeName">
                <el-input v-model="grade_form.gradeName"></el-input>
              </el-form-item>
              <el-form-item label="所属院系">
                <el-select v-model="grade_form.professional.college.collegeId" style="width:350px;" placeholder="请选择" filterable @change="findByCollegeId">
                  <el-option
                          v-for="item in college_list"
                          :key="item.collegeId"
                          :label="item.collegeName"
                          :value="item.collegeId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属专业">
                <el-select v-model="grade_form.professional.professionalId" style="width:350px;" filterable placeholder="请选择">
                  <el-option
                          v-for="item in professional_list"
                          :key="item.professionalId"
                          :label="item.professionalName"
                          :value="item.professionalId">
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
    name: "Grade",
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
        grade_form:{professional:{college:{}}},
        isShow:false,
        btn:false,
        college_list:[],
        professional_list:[],

        rules:{
          gradeName:[
            {required:true,message:'请输入年级名称',trigger:'blur'},
            {
              validator:function (rule,value,callback) {
                if (/^\d{4}$/.test(value)==false){
                  callback(new Error("四位数字"));
                }else {
                  callback();
                }
              },
              trigger: "blur"
            }
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
        request.get('/api/grade/findById',{
          params:{
            gradeId:row.gradeId
          }
        }).then(res=>{
          if (res.code == 0){
            this.grade_form = res.data
          }else{
            console.log(res.message)
          }
        })
        request.get('/api/college/findAll').then(res=>{
          this.college_list = res.data
        })

      },
      handleDelete(index, row) {
        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request.delete('/api/grade/deleteById',{
            params:{
              gradeId:row.gradeId
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
            this.delIdr[i] = this.multipleSelection[i].gradeId
          }
          request.delete('/api/grade/deleteBatch',{
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
        this.grade_form = {professional: {college:{}}}
        request.get('/api/college/findAll').then(res=>{
          this.college_list = res.data
        })
      },
      findByCollegeId(){
        this.grade_form.professional.professionalId = ''
        this.professional_list = []
        request.get('/api/professional/findByCollegeId',{
          params:{
            collegeId:this.grade_form.professional.college.collegeId
          }
        }).then(res=>{
          this.professional_list = res.data
        })
      },
      add(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.grade_form.professional.college.collegeId == null || this.grade_form.professional.college.collegeId == ""){
              ElMessage.error({
                message: "请选择所属院系",
                type: 'error'
              });
              return false
            }
            if (this.grade_form.professional.professionalId == null || this.grade_form.professional.professionalId == ""){
              ElMessage.error({
                message: "请选择所属专业",
                type: 'error'
              });
              return false
            }
            this.model = false;
            request.post('/api/grade/insert',this.grade_form).then(res=>{
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
            request.put('/api/grade/update',this.grade_form).then(res=>{
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
        request.get('api/grade/findList',{
          params:{
            currentPage:this.currentPage,
            pageSize:this.pageSize,
            gradeNum:this.search,
            gradeName:this.search
          }
        }).then(res=>{
          this.tableData = res.data.list
          this.total = res.data.total
        })
      },
      //重置
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.grade_form.professional.college.collegeId = ''
        this.grade_form.professional.professionalId = ''
      },
    },
    created() {
      this.load()
    }
  }
</script>

<style scoped>

</style>
