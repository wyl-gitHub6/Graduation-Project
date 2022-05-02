<!--
 * @Description: 成绩管理
 * @Author: Wangyl
 * @Date: 2021-12-01 20:32:40
 * @LastEditors: Wangyl
 * @LastEditTime: 2022-05-02 15:26:08
-->

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
          <el-table-column prop="student.studentNum" label="学生学号"></el-table-column>
          <el-table-column prop="student.studentName" label="学生姓名"></el-table-column>
          <el-table-column prop="course.courseName" label="课程名称"></el-table-column>
          <el-table-column prop="usualGrade" label="平时成绩">
            <template #default="scope">
              <span v-if="scope.row.usualGrade!=null" style="color: #1abc9c">{{scope.row.usualGrade}}</span>
              <span v-if="scope.row.usualGrade==null" style="color: #20a0ff">未录入</span>
            </template>
          </el-table-column>
          <el-table-column prop="stageGrade" label="阶段成绩">
            <template #default="scope">
              <span v-if="scope.row.stageGrade!=null && scope.row.stageGrade != ''" style="color: #1abc9c">{{scope.row.stageGrade}}</span>
              <span v-if="scope.row.stageGrade==null || scope.row.stageGrade == ''" style="color: #20a0ff">未录入</span>
            </template>
          </el-table-column>
          <el-table-column prop="testGrade" label="期末成绩">
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
              <el-button type="primary" icon="el-icon-edit" v-if="scope.row.credit !=null"  @click="handleEdit(scope.$index, scope.row)"></el-button>
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
            <el-scrollbar ref="scrollOne" height="300px" always @scroll="scroll">
              <el-form :label-position="labelPosition" label-width="90px" :model="score"
                      ref="score">

                <el-input v-model="score.scoreId" v-if="isShow"></el-input>
                <el-form-item label="平时成绩" prop="usualGrade" :rules="[
                  { required: true, message: '平时成绩不能为空'},
                  { type: 'number', message: '必须为数字值'}]">
                  <el-input v-model.number="score.usualGrade" style="width: 92%;"></el-input>
                </el-form-item>
                <el-form-item label="期末成绩" prop="testGrade" :rules="[
                  { required: true, message: '期末成绩不能为空'},
                  { type: 'number', message: '必须为数字值'}]">
                  <el-input v-model.number="score.testGrade" style="width: 92%;"></el-input>
                </el-form-item>

                <el-form-item
                  v-for="(domain, index) in score.domains"
                  :label="'阶段成绩' + (index + 1)"
                  :key="domain.key"
                  :prop="'domains.' + index + '.value'"
                  :rules="[
                    {required: true, message: '阶段成绩不能为空'},
                    { type: 'number', message: '必须为数字值'}]"
                >
                  <el-row>
                    <el-col :span="16"><el-input v-model.number="domain.value"></el-input></el-col>
                    <el-col :span="1"></el-col>
                    <el-col :span="7"><el-button @click.prevent="removeDomain(domain)">删除</el-button></el-col>
                  </el-row>
                </el-form-item>
                <div width = "100px">
                  <el-button style="margin-left: 50px;" type="primary" @click="edit('score')">修 改</el-button>
                  <el-button style="margin-left: 30px;" type="success" @click="addDomain">新增阶段成绩</el-button>
                  <el-button style="margin-left: 30px;" @click="model = false">取 消</el-button>
                </div>

              </el-form>
             </el-scrollbar> 
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
        pageSize:8,
        total:0,
        labelPosition: 'right',
        score:{},
        model:false,
      }

    },
    methods:{
      scroll({ scrollTop }) {
        this.value = scrollTop
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
        this.model=true
        this.btn=false
        request.get('/api/score/findById',{
          params:{
            scoreId:row.scoreId
          }
        }).then(res=>{
          if (res.code == 0){

            this.score.studentId = res.data.studentId
            this.score.courseId = res.data.course.courseId
            this.score.usualGrade = res.data.usualGrade
            this.score.testGrade = res.data.testGrade
            this.score.scoreId = row.scoreId
            this.score.domains = [{value: ''}]
            
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
      removeDomain(item) {
        var index = this.score.domains.indexOf(item)
        if (index !== -1) {
          this.score.domains.splice(index, 1)
        }
      },
      addDomain() {
        this.score.domains.push({
          value: ''
        });
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
    created() {
      this.load()
    }
  }
</script>

<style scoped>

</style>
