<template>
  <div class="common-layout">
    <el-container>
      <el-main>
        <el-button type="success" icon="el-icon-plus" @click="model = true,task_form={},title='录入定时任务',btn=true" style="margin-left: 100px;">录入信息</el-button>

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
          <el-table-column prop="jobName" label="任务名"></el-table-column>
          <el-table-column prop="description" label="任务描述"> </el-table-column>
          <el-table-column prop="cronExpression" label="cron表达式"></el-table-column>
          <el-table-column prop="beanClass" label="调用类"> </el-table-column>
          <el-table-column prop="jobGroup" label="任务分组"> </el-table-column>
          <el-table-column prop="jobStatus" label="任务状态">
            <template #default="scope">
              <el-switch  v-model="scope.row.jobStatus" active-color="#13ce66" @change="checkSwitch(scope.row)"
                         inactive-color="#ff4949" active-value="0" inactive-value="1"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button type="primary" icon="el-icon-edit"  @click="model=true,title='编辑定时任务',btn=false,handleEdit(scope.$index, scope.row)"></el-button>
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
            <el-form :label-position="labelPosition" label-width="100px" :model="task_form"
                     :rules="rules"
                     ref="ruleForm">

              <el-input v-model="task_form.id" v-if="isShow"></el-input>
              <el-form-item label="任务名称" prop="jobName">
                <el-input v-model="task_form.jobName"></el-input>
              </el-form-item>
              <el-form-item label="任务描述" prop="description">
                <el-input v-model="task_form.description"></el-input>
              </el-form-item>
              <el-form-item label="cron表达式" prop="cronExpression">
                <el-input v-model="task_form.cronExpression"></el-input>
              </el-form-item>
              <el-form-item label="任务包+类名" prop="beanClass">
                <el-input v-model="task_form.beanClass"></el-input>
              </el-form-item>
              <el-form-item label="任务状态" prop="jobStatus">
                <el-select v-model="task_form.jobStatus" filterable placeholder="请选择">
                  <el-option
                          v-for="item in stateList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="任务分组" prop="jobGroup">
                <el-input v-model="task_form.jobGroup"></el-input>
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
    name: "Quartz",
    components:{
      edit:Edit
    },
    data() {
      return {
        tableData: [],
        currentPage: 1,
        pageSize:5,
        total:0,
        /*弹窗*/
        model:false,
        title:'',
        search:'',
        //表单对齐方式
        labelPosition: 'right',
        task_form:{},
        isShow:false,
        btn:false,
        stateList:
        [
          {
            value:"0",label:'开启'
          },
          {
            value:"1",label: '关闭'
          }
        ],

        rules:{
          jobName: [
            { required: true, message: '请输入任务名称', trigger: 'blur' },
          ],
          description: [
            { required: true, message: '请输入任务描述', trigger: 'blur' },
          ],
          cronExpression: [
            { required: true, message: '请输入cron表达式', trigger: 'blur' },
          ],
          beanClass: [
            { required: true, message: '请输入任务包名+类名', trigger: 'blur' },
          ],
          jobGroup: [
            { required: true, message: '请输入任务分组', trigger: 'blur' },
          ],

        },
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
      handleEdit(index, row) {
        request.get('/api/task/findById',{
          params:{
            id:row.id
          }
        }).then(res=>{
          if (res.code == 0){
            this.task_form = res.data
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
          request.delete('/api/task/delete',{
            params:{
              id:row.id
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
      add(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.task_form.jobStatus == null){
              ElMessage.error({
                message: "请选择任务状态",
                type: 'error'
              });
              return false
            }
            this.model = false;
            request.post('/api/task/insert',this.task_form).then(res=>{
              console.log(res)
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
            request.put('/api/task/update',this.task_form).then(res=>{
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
      checkSwitch(row){
        request.get('api/task/updateStatus',{
          params:{
            id:row.id,
            jobStatus:row.jobStatus
          }
        }).then(res=>{
          if(res.code == 0){
            ElMessage.success({
              message: res.message,
              type: 'success'
            });
            this.load();
          }
        })
      },
      load(){
        request.get('api/task/findList',{
          params:{
            currentPage:this.currentPage,
            pageSize:this.pageSize,
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
