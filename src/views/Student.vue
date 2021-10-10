<template>
  <div class="common-layout">
    <el-container>
      <el-main>
        <el-button type="success" icon="el-icon-plus" @click="model = true,student_form={studentAge:''},title='录入学生信息',btn=true" style="margin-left: 100px;">录入信息</el-button>
        <el-button type="danger" icon="el-icon-folder-delete" @click="deleteBatch" style="margin-left: 30px;">批量删除</el-button>

        <!--导入-->
        <el-upload
                style="margin-left:30px;width:230px;display: inline-block"
                class="upload-demo"
                action="/api/student/uploadXls"
                :on-preview="handlePreview"
                :before-remove="beforeRemove"
                :on-success="upload_success"
                :on-error="upload_error"
                multiple
                :limit="1"
                :on-exceed="handleExceed"
                accept=".xls,.xlsx"
        >
          <el-tooltip
                  class="item"
                  effect="dark"
                  content="只能上传 xls/xlsx 文件，且不超过 500kb"
                  placement="top-start"
          >
          <el-button type="primary" icon="el-icon-upload">点击导入</el-button>
          </el-tooltip>
        </el-upload>

        <el-input placeholder="输入学生学号或学生姓名" v-model="search"
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
          <el-table-column prop="studentCard" label="身份证号"> </el-table-column>
          <el-table-column prop="studentEmail" label="邮箱"> </el-table-column>
          <el-table-column prop="studentPhone" label="手机号" > </el-table-column>
          <el-table-column prop="classes.classesName" label="所在班级">
            <template #default="scope">
              <span v-if="scope.row.classes.classesName == null" style="color: #20a0ff">未分班</span>
              <span v-if="scope.row.classes.classesName != null" style="color: #1abc9c">{{scope.row.classes.classesName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button type="primary" icon="el-icon-edit"  @click="model=true,title='编辑学生信息',btn=false,handleEdit(scope.$index, scope.row)"></el-button>
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
          <el-dialog :title="title" v-model="model" width="30%" center>
            <el-form :label-position="labelPosition" label-width="80px" :model="student_form"
                     :rules="rules"
                     ref="ruleForm">

              <el-input v-model="student_form.studentId" v-if="isShow"></el-input>
              <el-form-item label="学号" prop="studentNum" :rules="[
                { required: true, message: '不能为空'},
                { type: 'number', message: '学号为数字值'}]">
                <el-input v-model.number="student_form.studentNum"></el-input>
              </el-form-item>
              <el-form-item label="姓名" prop="studentName">
                <el-input v-model="student_form.studentName"></el-input>
              </el-form-item>
              <el-form-item label="年龄" prop="studentAge" :rules="[
                { required: true, message: '不能为空'},
                { type: 'number', message: '年龄为数字值'}]">
                <el-input v-model.number="student_form.studentAge" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="性别" prop="studentSex">
                <el-radio v-model="student_form.studentSex" :label="0">男</el-radio>
                <el-radio v-model="student_form.studentSex" :label="1">女</el-radio>
              </el-form-item>
              <el-form-item label="民族" prop="studentNational">
                <el-input v-model="student_form.studentNational"></el-input>
              </el-form-item>
              <el-form-item label="身份证号" prop="studentCard">
                <el-input v-model="student_form.studentCard"></el-input>
              </el-form-item>
              <el-form-item label="联系电话" prop="studentPhone">
                <el-input v-model="student_form.studentPhone"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="studentEmail">
                <el-input v-model="student_form.studentEmail"></el-input>
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
    name: "Student",
    components:{
      edit:Edit
    },
    data() {
      return {
        tableData: [],
        multipleSelection: [],
        currentPage: 1,
        pageSize:5,
        total:0,
        /*弹窗*/
        model:false,
        title:'',
        search:'',
        model:false,
        //表单对齐方式
        labelPosition: 'right',
        student_form:{studentAge:''},
        isShow:false,
        btn:false,

        rules:{
          studentName: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
          ],
          studentSex:[
            { required: true, message: '请选择性别', trigger: 'blur' },
          ],
          studentCard: [
            { required: true, message: '请按照身份证格式输入', trigger: 'blur' },
            {
              validator:function (rule,value,callback) {
                if (/(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)==false){
                  callback(new Error("身份证格式错误"));
                }else {
                  callback();
                }
              },
              trigger: "blur"
            }
          ],
          studentPhone: [
            { required: true,
              message: '请输入联系方式',
              trigger: 'blur'
            },
            {
              validator:function (rule,value,callback) {
                if (/^1[3456789]\d{9}$/.test(value)==false){
                  callback(new Error("手机号格式错误"));
                }else {
                  callback();
                }
              },
              trigger: "blur"
            }
          ],
          studentNational:[
            { required: true, message: '请输入民族', trigger: 'blur' },
          ],
          studentEmail:[
            { required: true, message: '请输入邮箱', trigger: 'blur' },
          ]

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
        request.get('/api/student/findById',{
          params:{
            studentId:row.studentId
          }
        }).then(res=>{
          if (res.code == 0){
            this.student_form = res.data
          }else{
            console.log(res.message)
          }
        })
      },
      handleDelete(index, row) {
        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request.delete('/api/student/deleteById',{
            params:{
              studentId:row.studentId
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
            this.delIdr[i] = this.multipleSelection[i].studentId
          }
          request.delete('/api/student/deleteBatch',{
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
      add(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.model = false;
            request.post('/api/student/insert',this.student_form).then(res=>{
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
            request.put('/api/student/update',this.student_form).then(res=>{
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
        request.get('api/student/findList',{
          params:{
            currentPage:this.currentPage,
            pageSize:this.pageSize,
            studentNum:this.search,
            studentName:this.search
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
      /*上传*/
      /*点击上传文件*/
      handlePreview(file) {
        ElMessage.success({
          message: file.name,
          type: 'success'
        });
      },
      handleExceed(files, fileList) {
        this.$message.warning(
                `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
                        files.length + fileList.length
                } 个文件`
        )
      },
      /*移除*/
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`)
      },
      /*上传成功*/
      upload_success(response, file, fileList){
        ElMessage.success({
          message: response.message,
          type: 'success'
        });
        this.load()
      },
      /*上传失败*/
      upload_error(response, file, fileList){
        ElMessage.error({
          message: "上传失败",
          type: 'error'
        });
        this.load()
      },
    },
    created() {
      this.load()
    }
  }
</script>

<style scoped>

</style>
