<!--
 * @Description: 用户信息
 * @Author: Wangyl
 * @Date: 2021-10-05 18:04:42
 * @LastEditors: Wangyl
 * @LastEditTime: 2022-04-14 20:25:07
-->

<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card shadow="hover">
                    <template #header>
                        <div class="clearFix">
                            <span>基础信息</span>
                        </div>
                    </template>
                    <div class="info">
                        <div class="info-image" @click="showDialog">
                            <img :src="avatarImg" />
                            <span class="info-edit">
                                <i class="el-icon-lx-camerafill"></i>
                            </span>
                        </div>
                        <div class="info-name">{{ name }}</div>
                        <div class="info-desc">{{form.desc}}</div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover">
                    <template #header>
                        <div class="clearFix">
                            <span>修改密码</span>
                        </div>
                    </template>
                    <el-form label-width="90px">
                        <el-form-item label="用户名："> {{ name }} </el-form-item>
                        <el-form-item label="旧密码：">
                            <el-input type="password" v-model="form.old"></el-input>
                        </el-form-item>
                        <el-form-item label="新密码：">
                            <el-input type="password" v-model="form.new"></el-input>
                        </el-form-item>
                        <el-form-item label="个人简介：">
                            <el-input v-model="form.desc"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">保存</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog title="裁剪图片" v-model="dialogVisible" width="600px">
            <vue-cropper ref="cropper" :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage"
                style="width: 100%; height: 400px"></vue-cropper>

            <template #footer>
                <span class="dialog-footer">
                    <el-button class="crop-demo-btn" type="primary">选择图片
                        <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage" />
                    </el-button>
                    <el-button type="primary" @click="saveAvatar">上传并保存</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { reactive, ref } from "vue";
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
import request from "../utils/request";
import {ElMessage} from "element-plus";
import { useStore } from "vuex";
export default {
    name: "user",
    components: {
        VueCropper,
    },
    setup() {
        const user = JSON.parse(sessionStorage.getItem("user"))
        const name = JSON.parse(sessionStorage.getItem("user")).userName;

        const store = useStore();

        let form = reactive({
            old: "",
            new: "",
            desc: "明天的太阳更耀眼！",
        });
        const onSubmit = () => {
            if (form.new == null || form.new == '' || form.old == '' ||form.old == null){
                ElMessage.error({
                    message: '请保证完整性',
                    type: 'error'
                });
                return
            }
            if (form.new == form.old){
                ElMessage.error({
                    message: '新密码不得与最近密码相同',
                    type: 'error'
                });
                return
            }
            request.get('/api/user/updatePassword',{
                params:{
                    userId:user.userId,
                    password:form.old
                }
            }).then(res=>{
                if (res.code == -1){
                    ElMessage.error({
                        message: '旧密码错误',
                        type: 'error'
                    });
                    return
                }

                user.userPassword = form.new
                request.put('api/user/update',user).then(res=>{
                    if (res.code == 0){
                        ElMessage.success({
                            message: '密码修改成功!',
                            type: 'success'
                        });
                        form.old = ''
                        form.new = ''
                    }
                })
            })
        };

        const avatarImg = ref(store.state.url+user.userImg);
        const imgSrc = ref("");
        const cropImg = ref("");
        const dialogVisible = ref(false);
        const cropper = ref(null);
        let img = '';

        const showDialog = () => {
            dialogVisible.value = true;
            imgSrc.value = avatarImg.value;
        };

        const setImage = (e) => {
            const file = e.target.files[0];

            let param = new FormData()
            param.append('file',file) // 通过append向form对象添加数据
            param.append('chunk', '0') // 添加form表单中其他数据
            //console.log(param.get('file')) // FormData私有类对象，访问不到，可以通过get判断值是否传进去
            let config = {
                headers: {'Content-Type': 'multipart/form-data'}
            }
            request.post('/api/uploadController/upload',param,config).then(res=>{
                if (res.code == 0){
                    img = res.message
                }
            })

            if (!file.type.includes("image/")) {
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                dialogVisible.value = true;
                imgSrc.value = event.target.result;
                cropper.value && cropper.value.replace(event.target.result);
            };
            reader.readAsDataURL(file);
        };

        const cropImage = () => {
            cropImg.value = cropper.value.getCroppedCanvas().toDataURL();
        };

        const saveAvatar = () => {
            avatarImg.value = cropImg.value;
            user.userImg = img
            request.put('/api/user/update',user).then(res=>{
                if (res.code == 0){
                    ElMessage.success({
                        message: '头像上传成功!',
                        type: 'success'
                    });
                }
            })

            dialogVisible.value = false;
        };

        return {
            name,
            form,
            onSubmit,
            cropper,
            avatarImg,
            imgSrc,
            cropImg,
            showDialog,
            dialogVisible,
            setImage,
            cropImage,
            saveAvatar,
            img,
            user,
        };
    },
};
</script>

<style scoped>
.info {
    text-align: center;
    padding: 35px 0;
}
.info-image {
    position: relative;
    margin: auto;
    width: 100px;
    height: 100px;
    background: #f8f8f8;
    border: 1px solid #eee;
    border-radius: 50px;
    overflow: hidden;
}
.info-image img {
    width: 100%;
    height: 100%;
}
.info-edit {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 0.3s ease;
}
.info-edit i {
    color: #eee;
    font-size: 25px;
}
.info-image:hover .info-edit {
    opacity: 1;
}
.info-name {
    margin: 15px 0 10px;
    font-size: 24px;
    font-weight: 500;
    color: #262626;
}
.crop-demo-btn {
    position: relative;
}
.crop-input {
    position: absolute;
    width: 100px;
    height: 40px;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
}
</style>
