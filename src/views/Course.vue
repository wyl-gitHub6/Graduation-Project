<template>
  <div class="common-layout">
    <el-container>
      <el-main>
    <el-button type="success" icon="el-icon-plus" @click="Model = true,course_form={},title='录入课程信息',btn=true,toAdd()" style="margin-left: 100px;"></el-button>
    <el-button type="danger" icon="el-icon-folder-delete" @click="deleteBatch" style="margin-left: 30px;"></el-button>

        <el-input placeholder="输入课程编号或课程名称" v-model="search"
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
      <el-table-column prop="date" label="日期" width="120">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120"> </el-table-column>
      <el-table-column label="操作">
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

      </el-main>
    </el-container>
  </div>
</template>

<script>
  import { Edit } from '@element-plus/icons'
  import request from "../utils/request";
  import { ElMessage } from 'element-plus';
  export default {
    name: "Course",
    components:{
      edit:Edit
    },
    data() {
      return {
        tableData: [
          {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
          },
          {
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
          },
          {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
          },
          {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
          },
          {
            date: '2016-05-08',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
          },
          {
            date: '2016-05-06',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
          },
          {
            date: '2016-05-07',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
          },
        ],
        multipleSelection: [],
        currentPage: 1,
        pageSize:5,
        total:0,
        /*弹窗*/
        model:false,
        title:'',
        search:'',
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

      },
      handleDelete(index, row) {

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
            this.delIdr[i] = this.multipleSelection[i].id
          }
          /*request.delete('/api/user/deleteBatch',{
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
          })*/
        }
      },
      toAdd(){

      },
      load(){

      }
    },
    created() {
      this.load()
    }
  }
</script>

<style scoped>

</style>
