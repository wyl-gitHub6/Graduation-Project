<!--
 * @Description: 管理员
 * @Author: Wangyl
 * @Date: 2021-10-30 17:41:06
 * @LastEditors: Wangyl
 * @LastEditTime: 2022-03-28 20:55:58
-->

<template>
  <div class="common-layout">
    <el-container>
      <el-main>
        <el-button type="success" icon="el-icon-plus" @click="model = true,user_form={userAge:''},title='录入管理员信息',btn=true" style="margin-left: 100px;">录入信息</el-button>
        <el-button type="danger" icon="el-icon-folder-delete" @click="deleteBatch" style="margin-left: 30px;">批量删除</el-button>


        <el-input placeholder="输入管理员编号或管理员姓名" v-model="search"
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
          <el-table-column prop="userNum" label="管理员编号"></el-table-column>
          <el-table-column prop="userName" label="姓名"> </el-table-column>
          <el-table-column prop="userAge" label="年龄"> </el-table-column>
          <el-table-column prop="userNational" label="民族"> </el-table-column>
          <el-table-column prop="userSex" label="性别">
            <template #default="scope">
              <span v-if="scope.row.userSex == 0" style="color: #20a0ff">男</span>
              <span v-if="scope.row.userSex == 1" style="color: #1abc9c">女</span>
            </template>
          </el-table-column>
          <el-table-column prop="userCard" label="身份证号"> </el-table-column>
          <el-table-column prop="userEmail" label="邮箱"> </el-table-column>
          <el-table-column prop="userPhone" label="手机号" > </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button type="primary" icon="el-icon-edit"  @click="model=true,title='编辑管理员信息',btn=false,handleEdit(scope.$index, scope.row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" v-if="scope.row.userId != user.userId" @click="handleDelete(scope.$index, scope.row)"></el-button>
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
            <el-form :label-position="labelPosition" label-width="80px" :model="user_form"
                     :rules="rules"
                     ref="ruleForm">

              <el-input v-model="user_form.userId" v-if="isShow"></el-input>
              <el-form-item label="姓名" prop="userName">
                <el-input v-model="user_form.userName"></el-input>
              </el-form-item>
              <el-form-item label="年龄" prop="userAge" :rules="[
                { required: true, message: '不能为空'},
                { type: 'number', message: '年龄必须为数字值'}]">
                <el-input v-model.number="user_form.userAge" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="性别" prop="userSex">
                <el-radio v-model="user_form.userSex" :label="0">男</el-radio>
                <el-radio v-model="user_form.userSex" :label="1">女</el-radio>
              </el-form-item>
              <el-form-item label="民族" prop="userNational">
                <el-input v-model="user_form.userNational"></el-input>
              </el-form-item>
              <el-form-item label="身份证号" prop="userCard">
                <el-input v-model="user_form.userCard"></el-input>
              </el-form-item>
              <el-form-item label="联系电话" prop="userPhone">
                <el-input v-model="user_form.userPhone"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="userEmail">
                <el-input v-model="user_form.userEmail"></el-input>
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
    name: "Users",
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
        user_form:{userAge:''},
        isShow:false,
        btn:false,
        user:JSON.parse(sessionStorage.getItem("user")),

        rules:{
          userName: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
          ],
          userSex:[
            { required: true, message: '请选择性别', trigger: 'blur' },
          ],
          userCard: [
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
          userPhone: [
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
          userNational:[
            { required: true, message: '请输入民族', trigger: 'blur' },
          ],
          userEmail:[
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            {
              validator:function (rule,value,callback) {
                if ( /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(value)==false){
                  callback(new Error("邮箱格式错误"));
                }else {
                  callback();
                }
              },
              trigger: "blur"
            }
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
        request.get('/api/user/findById',{
          params:{
            userId:row.userId
          }
        }).then(res=>{
          if (res.code == 0){
            this.user_form = res.data
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
          request.delete('/api/user/deleteById',{
            params:{
              userId:row.userId
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
            this.delIdr[i] = this.multipleSelection[i].userId
          }
          request.delete('/api/user/deleteBatch',{
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
            request.post('/api/user/insert',this.user_form).then(res=>{
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
            request.put('/api/user/update',this.user_form).then(res=>{
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
        request.get('api/user/findList',{
          params:{
            currentPage:this.currentPage,
            pageSize:this.pageSize,
            userName:this.search,
            userNum:this.search
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
    },
    created() {
      this.load()
    }
  }
</script>

<style scoped>

</style>
