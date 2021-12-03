<template>
    <div class="dowebok" id="dowebok">
      <div class="form-container sign-up-container">
        <el-form
                :model="restForm"
                :rules="rules"
                ref="restForm"
                label-width="65px"
                class="demo-ruleForm"
        >
          <h2 style="margin-bottom: 20px;margin-left: 20px;color: #20a0ff">重置密码</h2>
          <el-form-item label="用户名" prop="name">
            <el-input v-model="restForm.name"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="restForm.email" style="width: 135px;"></el-input>
            <el-button type="primary" style="margin-left: 10px;" @click="sendEmail()">发送</el-button>
          </el-form-item>
          <el-form-item label="验证码" prop="code">
            <el-input v-model="restForm.code" style="width: 135px;"></el-input>
            <el-button style="margin-left: 10px;" @click="resetform('restForm')">重置</el-button>
          </el-form-item>
          <el-form-item>
            <el-button style="margin-left: -30px" type="primary" @click="rest('restForm')">重置密码</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="form-container sign-in-container">
        <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="65px"
                class="demo-ruleForm"
        >
          <h2 style="margin-bottom: 20px;margin-left: 20px;color: #20a0ff">用户登录</h2>
          <el-form-item label="用户名" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="ruleForm.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="login('ruleForm')">登录</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-panel overlay-left">
            <h1 style="margin-bottom: 50px;">忘记密码</h1>
            <el-button type="primary" id="signIn" plain>去登录</el-button>
          </div>
          <div class="overlay-panel overlay-right">
            <h1 style="margin-bottom: 50px;">欢迎回来~</h1>
            <el-button type="primary" id="signUp" plain>忘记密码？</el-button>
          </div>
        </div>
      </div>
    </div>
  <!-- 气泡 -->
  <div class="bubbels">
    <div class="bubbel"></div>
    <div class="bubbel"></div>
    <div class="bubbel"></div>
    <div class="bubbel"></div>
    <div class="bubbel"></div>
    <div class="bubbel"></div>
    <div class="bubbel"></div>
    <div class="bubbel"></div>
    <div class="bubbel"></div>
    <div class="bubbel"></div>
  </div>
</template>

<script>
  import '../assets/css/bubbel.css'
  import '../assets/out/css/style.css'
  import request from "../utils/request";
  import {ElMessage} from "element-plus";
  import router from "../router";

  export default {
    name: "Login",
    data(){
      return {
        signUpButton:'',
        signInButton:'',
        container:'',
        ruleForm:{},
        restForm:{},
        emailCode:'',
        user:{userPassword:''},
        rules: {
          name: [
            { required: true, message: '请输入管理员编号', trigger: 'change' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'change' },
          ],
          email: [
            { required: true, message: '请输入绑定邮箱', trigger: 'change' },
          ],
          code: [
            { required: true, message: '请输入邮箱中的验证码', trigger: 'change' },
          ],
        },
      }
    },
    mounted() {
      let signUpButton = document.getElementById('signUp')
      let signInButton = document.getElementById('signIn')
      let container = document.getElementById('dowebok')

      signUpButton.addEventListener('click', function () {
        container.classList.add('right-panel-active')
      })

      signInButton.addEventListener('click', function () {
        container.classList.remove('right-panel-active')
      })
    },
    methods: {
      login(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            request.get('/api/user/login',{
              params:{
                userNum:this.ruleForm.name,
                password:this.ruleForm.password
              }
            }).then(res=>{
              if (res.code == 0) {
                ElMessage.success({
                  message: res.message,
                  type: 'success'
                });
                this.$router.push("/home")
                //vue中提供了使用cookie域和session域的使用
                sessionStorage.setItem("user",JSON.stringify(res.data))
              }else{
                ElMessage.error({
                  message: res.message,
                  type: 'error'
                });
              }
            })
          } else {
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      resetform(formName) {
        this.$refs[formName].resetFields()
      },
      rest(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.restForm.code != this.emailCode){
              ElMessage.error({
                message: '验证码错误！',
                type: 'error'
              });
              return ;
            }
            this.user.userPassword = '123'
            request.put('/api/user/update',this.user).then(res=>{
              if (res.code == 0){
                ElMessage.success({
                  message: '密码重置成功',
                  type: 'success'
                });
              }
            })
          } else {
            return false
          }
        })
      },
      sendEmail(){
        if (this.restForm.name == null || this.restForm.name == ""){
          ElMessage.error({
            message: '请输入管理员编号',
            type: 'error'
          });
          return
        }
        if (this.restForm.email == null || this.restForm.email == ""){
          ElMessage.error({
            message: '请输入绑定邮箱',
            type: 'error'
          });
          return
        }
        request.get('/api/user/sendEmail',{
          params:{
            userNum:this.restForm.name,
            emailAddress:this.restForm.email
          }
        }).then(res=>{
          if (res.code == 0){
            ElMessage.success({
              message: res.message,
              type: 'success'
            });
            this.emailCode = res.data.code
            this.user = res.data
            console.log(this.emailCode)
          }else{
            ElMessage.error({
              message: res.message,
              type: 'error'
            });
          }
        })
      }
    },
  }
</script>

<style scoped>

</style>
