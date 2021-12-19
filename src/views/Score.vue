<template>
  <div class="common-layout">
    <el-container>
      <el-main>
        <el-input placeholder="输入课程名称或学生姓名" v-model="search"
                  clearable style="width: 260px;margin-left: 150px;"></el-input>
        <el-button type="primary" @click="load" icon="el-icon-search" style="margin-left: 10px;">搜索</el-button>
        <br><br>

        <el-table
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                bcar
                :header-cell-style="{textAlign: 'center'}"
                :cell-style="{textAlign:'center'}"
                :default-sort = "{prop: 'date', order: 'descending'}"
        >
          <el-table-column prop="id" label="Id" v-if="isShow"></el-table-column>
          <el-table-column prop="student.studentName" label="学生姓名"></el-table-column>
          <el-table-column prop="course.courseName" label="课程名称"></el-table-column>
          <el-table-column prop="usualGrade" label="平时成绩">
            <template #default="scope">
              <span v-if="scope.row.usualGrade!=null" style="color: #1abc9c">{{scope.row.usualGrade}}</span>
              <span v-if="scope.row.usualGrade==null" style="color: #20a0ff">未录入</span>
            </template>
          </el-table-column>
          <el-table-column prop="testGrade" label="考试成绩">
            <template #default="scope">
              <span v-if="scope.row.testGrade!=null" style="color: #1abc9c">{{scope.row.testGrade}}</span>
              <span v-if="scope.row.testGrade==null" style="color: #20a0ff">未录入</span>
            </template>
          </el-table-column>
          <el-table-column prop="scoreGrade" label="有效成绩">
            <template #default="scope">
              <span v-if="scope.row.scoreGrade!=null" style="color: #1abc9c">{{scope.row.scoreGrade}}</span>
              <span v-if="scope.row.scoreGrade==null" style="color: #20a0ff">未录入</span>
            </template>
          </el-table-column>
          <el-table-column prop="credit" label="获得学分">
            <template #default="scope">
              <span v-if="scope.row.credit!=null" style="color: #1abc9c">{{scope.row.credit}}</span>
              <span v-if="scope.row.credit==null" style="color: #20a0ff">未录入</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button type="primary" icon="el-icon-edit" v-if="scope.row.credit !=null"  @click="model=true,btn=false,handleEdit(scope.$index, scope.row)"></el-button>
              <el-button type="primary" icon="el-icon-edit" v-if="scope.row.credit ==null" disabled></el-button>
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
          <el-dialog title="更改成绩" v-model="model" width="25%" center>
            <el-form :label-position="labelPosition" label-width="80px" :model="score"
                     :rules="rules"
                     ref="ruleForm">

              <el-input v-model="score.scoreId" v-if="isShow"></el-input>
              <el-form-item label="平时成绩" prop="usualGrade">
                <el-input v-model="score.usualGrade" @input="test" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="考试成绩" prop="testGrade">
                <el-input v-model="score.testGrade" @input="test" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="最终成绩">
                <el-input v-model="score.scoreGrade" autocomplete="off" readonly></el-input>
              </el-form-item>

            </el-form>
            <template #footer>
                <span class="dialog-footer">
                  <el-button @click="model = false">取 消</el-button>
                  <el-button type="primary" @click="edit('ruleForm')">修 改</el-button>
                </span>
            </template>
          </el-dialog>
        </div>

      </el-main>
    </el-container>
  </div>
</template>

<script>
  import request from "../utils/request";
  import {ElMessage} from "element-plus";

  export default {
    name: "Score",
    data(){
      return{
        isShow:false,
        search:'',
        tableData:[],
        currentPage: 1,
        pageSize:5,
        total:0,
        labelPosition: 'right',
        score:{},
        model:false,

        rules: {
          usualGrade: [
            { required: true, message: '不可为空', trigger: 'blur' },
            {
              validator:function (rule,value,callback) {
                if (/^[0-9]+([.]{1}[0-9]+){0,1}$/.test(value)==false){
                  callback(new Error("请输入整数"));
                }else {
                  callback();
                }
              },
              trigger: "blur"
            }
          ],
          testGrade:[
            { required: true, message: '不可为空', trigger: 'blur' },
            {
              validator:function (rule,value,callback) {
                if (/^[0-9]+([.]{1}[0-9]+){0,1}$/.test(value)==false){
                  callback(new Error("请输入整数"));
                }else {
                  callback();
                }
              },
              trigger: "blur"
            }
          ]
        }

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
        request.get('/api/score/findById',{
          params:{
            scoreId:row.scoreId
          }
        }).then(res=>{
          if (res.code == 0){
            this.score = res.data
          }else{
            console.log(res.message)
          }
        })
      },
      edit(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.model = false
            request.put('/api/score/update',this.score).then(res=>{
              console.log(res)
              if(res.code == 0){
                ElMessage.success({
                  message: res.message,
                  type: 'success'
                });
                this.load();
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
        request.get('/api/score/scoreList',{
          params:{
            currentPage:this.currentPage,
            pageSize:this.pageSize,
            courseName:this.search,
            studentName:this.search
          }
        }).then(res=>{
          this.tableData = res.data.list
          this.total = res.data.total
        })
      },
    },
    computed:{
      /*计算最终成绩*/
      test(){
        this.score.scoreGrade = this.score.usualGrade*0.3+this.score.testGrade*0.7
      }
    },
    created() {
      this.load()
    }
  }
</script>

<style scoped>

</style>
