<template>
    <div class="dowebok" id="dowebok">
      <div class="form-container sign-up-container">
        <el-form
                :model="restForm"
                :rules="rules"
                ref="restForm"
                label-width="0px"
                class="demo-ruleForm"
        >
          <h2 style="margin-bottom: 20px;margin-left: 20px;color: #20a0ff">重置密码</h2>
          <el-form-item prop="username">
            <el-input v-model="restForm.username" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item prop="email">
            <el-input v-model="restForm.email" style="width: 220px;" placeholder="邮箱"></el-input>
            <el-button style="margin-left: 10px;" @click="sendEmail()">发送</el-button>
          </el-form-item>
          <el-form-item prop="code">
            <el-input v-model="restForm.code" style="width: 220px;" placeholder="验证码"></el-input>
            <el-button style="margin-left: 10px;" @click="resetForm('restForm')">重置</el-button>
          </el-form-item>
          <el-form-item>
            <el-button style="width: 300px;" type="primary" @click="rest('restForm')">重置密码</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="form-container sign-in-container">
        <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="0px"
                class="demo-ruleForm"
        >
          <h2 style="margin-bottom: 20px;margin-left: 20px;color: #20a0ff">用户登录</h2>
          <el-form-item prop="username">
            <el-input v-model="ruleForm.username" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="ruleForm.password" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item>
            <captcha @captchaSuccess="success" style="width: 300px;"></captcha>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="login('ruleForm')" style="width: 300px;">登录</el-button>
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
  import Captcha from "./Captcha";

  export default {
    name: "Login",
    components: {Captcha},
    data(){
      return {
        signUpButton:'',
        signInButton:'',
        container:'',
        ruleForm:{},
        restForm:{},
        emailCode:'',
        status:false,
        user:{userPassword:''},
        rules: {
          username: [
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
            if (!this.status){
              ElMessage.error({
                message: '请按住滑块，拖动到最右边~',
                type: 'error'
              });
              return
            }
            request.get('/api/user/login',{
              params:{
                userNum:this.ruleForm.username,
                password:this.ruleForm.password
              }
            }).then(res=>{
              if (res.code === 0) {
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
      success(e){
        this.status = e;
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      rest(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.restForm.code !== this.emailCode){
              ElMessage.error({
                message: '验证码错误！',
                type: 'error'
              });
              return ;
            }
            this.user.userPassword = '123'
            request.put('/api/user/update',this.user).then(res=>{
              if (res.code === 0){
                ElMessage.success({
                  message: '密码重置成功',
                  type: 'success'
                });
                this.resetForm('restForm')
              }
            })
          } else {
            return false
          }
        })
      },
      sendEmail(){
        if (this.restForm.username == null || this.restForm.username === ""){
          ElMessage.error({
            message: '请输入管理员编号',
            type: 'error'
          });
          return
        }
        if (this.restForm.email == null || this.restForm.email === ""){
          ElMessage.error({
            message: '请输入绑定邮箱',
            type: 'error'
          });
          return
        }
        request.get('/api/user/sendEmail',{
          params:{
            userNum:this.restForm.username,
            emailAddress:this.restForm.email
          }
        }).then(res=>{
          if (res.code === 0){
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
.el-input{
  width: 300px;
}
</style>
