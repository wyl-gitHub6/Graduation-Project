<!--
 * @Description: 课程管理
 * @Author: Wangyl
 * @Date: 2021-10-05 20:04:34
 * @LastEditors: Wangyl
 * @LastEditTime: 2022-04-30 16:10:35
-->

<template>
  <div class="common-layout">
    <el-container>
      <el-main>
        <el-button type="success" icon="el-icon-plus" @click="model = true,toAdd(),title='录入课程信息',btn=true" style="margin-left: 100px;">录入信息</el-button>
        <el-button type="danger" icon="el-icon-folder-delete" @click="deleteBatch" style="margin-left: 30px;">批量删除</el-button>

        <el-input placeholder="输入课程编号或课程名称" v-model="search"
                  clearable style="width: 260px;margin-left: 150px;"></el-input>

        <el-select v-model="courseState" placeholder="请选择" filterable style="margin-left: 10px;">
          <el-option
                  v-for="item in state_list"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
          </el-option>
        </el-select>

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
          <el-table-column type="selection" width="30"> </el-table-column>
          <el-table-column prop="id" label="Id" v-if="isShow"></el-table-column>
          <el-table-column prop="courseNum" label="课程编号"></el-table-column>
          <el-table-column prop="courseName" label="课程名称"> </el-table-column>
          <el-table-column prop="courseDesc" label="课程描述"> </el-table-column>
          <el-table-column label="照片" width="100px;">
            <template #default="scope">
              <img :src="url+scope.row.courseImg" alt="" style="height: 80px;">
            </template>
          </el-table-column>
          <el-table-column label="课程类别" width="100px;">
            <template #default="scope">
              <span v-if="scope.row.courseState == 0" style="color: #20a0ff">必修课</span>
              <span v-if="scope.row.courseState == 1" style="color: #1abc9c">选修课</span>
            </template>
          </el-table-column>
          <el-table-column label="限制人数" width="100px;">
            <template #default="scope">
              <span v-if="scope.row.courseState == 0" style="color: #20a0ff">无限制</span>
              <span v-if="scope.row.courseState == 1" style="color: #1abc9c">{{scope.row.number}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="courseCredit" label="学分"> </el-table-column>
          <el-table-column prop="startTime" label="开课日期"> </el-table-column>
          <el-table-column prop="endTime" label="结束日期"> </el-table-column>
          <el-table-column prop="teacher.teacherName" label="任课教师"> </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button type="primary" icon="el-icon-edit"  @click="model=true,title='编辑课程信息',btn=false,handleEdit(scope.$index, scope.row)"></el-button>
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
            <el-form :label-position="labelPosition" label-width="80px" :model="course_form"
                     :rules="rules"
                     ref="ruleForm">

              <el-input v-model="course_form.courseId" v-if="isShow"></el-input>
              <el-form-item label="课程名称" prop="courseName">
                <el-input v-model="course_form.courseName"></el-input>
              </el-form-item>
              <el-form-item label="课程描述" prop="courseDesc">
                <el-input v-model="course_form.courseDesc"></el-input>
              </el-form-item>
              <el-form-item label="课程周期" prop="courseDate">
                <div class="block">
                  <el-date-picker
                          style="width: 350px;"
                          v-model="course_form.courseDate"
                          type="monthrange"
                          unlink-panels
                          range-separator="至"
                          start-placeholder="开课月份"
                          end-placeholder="结束月份"
                          :shortcuts="shortcuts"
                          @change="calendar()"
                  >
                  </el-date-picker>
                </div>
              </el-form-item>
              <el-form-item v-if="course_form.courseState != 0" label="限制人数" prop="number" :rules="[
                { required: true, message: '不能为空'},
                { type: 'number', message: '必须为数字值'}]">
                <el-input v-model.number="course_form.number"></el-input>
              </el-form-item>
              <el-form-item label="任课教师">
                <el-select v-model="course_form.teacher.teacherId" style="width:350px;" filterable clearable placeholder="请选择">
                  <el-option
                          v-for="item in teacherList"
                          :key="item.teacherId"
                          :label="item.teacherName"
                          :value="item.teacherId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="学分" prop="courseCredit">
                <el-input-number
                        v-model="course_form.courseCredit"
                        :min="1"
                        :max="3"
                        label="描述文字"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="课程类别" prop="courseState">
                <el-radio v-model="course_form.courseState" :label="0">必修课</el-radio>
                <el-radio v-model="course_form.courseState" :label="1">选修课</el-radio>
              </el-form-item>

              <el-form-item label="图片" prop="courseImg">
                <el-upload
                        v-model="course_form.courseImg"
                        class="upload-demo"
                        action="/api/uploadController/upload"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :on-success="upload_success"
                        :file-list="fileList"
                        list-type="picture"
                        ref='upload'>
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
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
  import { useStore } from "vuex";

  export default {
    name: "Course",
    components:{
      edit:Edit
    },
    data() {
      return {
        shortcuts: [
          {
            text: '本月',
            value: [new Date(), new Date()],
          },
          {
            text: '今年至今',
            value: () => {
              const end = new Date()
              const start = new Date(new Date().getFullYear(), 0)
              return [start, end]
            },
          },
          {
            text: '最近六个月',
            value: () => {
              const end = new Date()
              const start = new Date()
              start.setMonth(start.getMonth() - 6)
              return [start, end]
            },
          },
        ],

        tableData: [],
        multipleSelection: [],
        currentPage: 1,
        pageSize:5,
        total:0,
        /*弹窗*/
        model:false,
        title:'',
        search:'',
        //表单对齐方式
        labelPosition: 'right',
        course_form:{courseCredit: 1,startTime:'',endTime:'',teacher:{},courseDate:[]},
        isShow:false,
        btn:false,
        fileList:[],
        teacherList:[],
        courseState:'',
        state_list:[
          {value:-1,name:'未选择'},
          {value:0,name:'必修课'},
          {value:1,name:'选修课'},
        ],
        url:useStore().state.url,

        rules:{
          courseName: [
            { required: true, message: '请输入课程名称', trigger: 'blur' },
          ],
          courseDesc: [
            { required: true, message: '请输入课程描述', trigger: 'blur' },
          ],
          number: [
            { required: true, message: '请输入限制人数', trigger: 'blur' },
          ],
          courseState: [
            { required: true, message: '请选择课程类别', trigger: 'blur' },
          ],
          courseCredit: [
            { required: true, message: '请输入学分', trigger: 'blur' },
          ],
          courseImg: [
            { required: true, message: '请上传图片', trigger: 'blur' },
          ],
          courseDate: [
            { required: true, message: '请选择日期', trigger: 'blur' },
          ]
        },
      }
    },
    methods:{
      calendar(val){
        this.course_form.startTime = this.course_form.courseDate[0]
        this.course_form.endTime = this.course_form.courseDate[1]
      },
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
        request.get('/api/course/findById',{
          params:{
            courseId:row.courseId
          }
        }).then(res=>{
          if (res.code == 0){
            this.course_form.courseId = res.data.courseId
            this.course_form.courseName = res.data.courseName
            this.course_form.courseNum = res.data.courseNum
            this.course_form.courseDesc = res.data.courseDesc
            this.course_form.courseImg = res.data.courseImg
            this.course_form.courseCredit = res.data.courseCredit
            this.course_form.courseState = res.data.courseState
            this.course_form.number = res.data.number
            this.course_form.teacher = res.data.teacher
            this.course_form.courseDate[0] = res.data.startTime
            this.course_form.courseDate[1] = res.data.endTime
          }else{
            console.log(res.message)
          }
        })
        request.get('api/teacher/findAll').then(res=>{
          this.teacherList = res.data
        })
      },
      handleDelete(index, row) {
        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request.delete('/api/course/deleteById',{
            params:{
              courseId:row.courseId
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
            this.delIdr[i] = this.multipleSelection[i].courseId
          }
          request.delete('/api/course/deleteBatch',{
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
        this.course_form={courseCredit: 1,startTime:'',endTime:'',teacher:{},courseDate:[]}
        request.get('api/teacher/findAll').then(res=>{
          this.teacherList = res.data
        })
      },
      add(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.course_form.teacher.teacherId == null){
              ElMessage.error({
                message: '请选择任课教师',
                type: 'error'
              });
              return
            }
            this.model = false;
            this.$refs.upload.clearFiles()
            request.post('/api/course/insert',this.course_form).then(res=>{
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
            console.log(this.course_form);
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
            this.$refs.upload.clearFiles()
            request.put('/api/course/update',this.course_form).then(res=>{
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
        request.get('api/course/findList',{
          params:{
            currentPage:this.currentPage,
            pageSize:this.pageSize,
            courseNum:this.search,
            courseName:this.search,
            courseState:this.courseState
          }
        }).then(res=>{
          this.tableData = res.data.list
          this.total = res.data.total
        })
      },
      //重置
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      upload_success(response, file, fileList){
        this.course_form.courseImg=response.message
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
    },
    created() {
      this.load()
    }
  }
</script>

<style scoped>

</style>
