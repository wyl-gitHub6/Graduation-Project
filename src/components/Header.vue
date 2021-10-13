<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div>
        <div class="logo" style="display: flex">
            <!--<el-image
                    style="width: 60px; height: 60px;margin-top: 5px;"
                    :src="url"
            ></el-image>-->
            <span style="margin-left: 15px;">学生成绩管理系统</span>
        </div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 用户头像 -->
                <div class="user-avator">
                    <img src="../assets/img/img.jpg" />
                </div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="user">个人中心</el-dropdown-item>
                            <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <el-color-picker style="margin-left: 20px;" v-model="color" :predefine="predefineColors" @change="setBackgroundColor" size="small">个性化：</el-color-picker>
            </div>
        </div>
    </div>
</template>
<script>
import colorChange from "../assets/js/colorChange";
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { defineComponent, reactive, toRefs } from 'vue'
import {ElMessage} from "element-plus";
export default {
    setup() {
        const color = '#474787';

        const predefineColors = [
            '#143556',
            '#ff4500',
            '#ff8c00',
            '#ffd700',
            '#90ee90',
            '#00ced1',
            '#1e90ff',
            '#c71585',
            'rgba(255, 69, 0, 0.68)',
            'rgb(255, 120, 0)',
            'hsv(51, 100, 98)',
            'hsva(120, 40, 94, 0.5)',
            'hsl(181, 100%, 37%)',
            'hsla(209, 100%, 56%, 0.73)',
            '#c7158577',
        ];


        const username = JSON.parse(sessionStorage.getItem("user"));
        const message = 2;

        const store = useStore();
        const collapse = computed(() => store.state.collapse);
        // 侧边栏折叠
        const collapseChage = () => {
            store.commit("handleCollapse", !collapse.value);
        };

        onMounted(() => {
            if (document.body.clientWidth < 1500) {
                collapseChage();
            }
        });

        // 用户名下拉菜单选择事件
        const router = useRouter();
        const handleCommand = (command) => {
            if (command == "loginout") {
                ElMessage.success({
                    message: '注销成功!',
                    type: 'success'
                });
                sessionStorage.clear();
                router.push("/login");
            } else if (command == "user") {
                router.push("/user");
            }
        };

        const state = reactive({
            fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
            /*url: require('../assets/img/logo.jpg'),*/
        })

        return {
            username,
            message,
            collapse,
            collapseChage,
            handleCommand,
            ...toRefs(state),
            color,
            predefineColors,
        };
    },
    methods:{
        setBackgroundColor(){
            document.body.style.setProperty('--background-color',this.color)
            let footColor = colorChange.setFootColor(document.body.style.getPropertyValue('--background-color'),'#ffffff','#000000')
            document.body.style.setProperty('--fontColor',footColor)
            let lingtcolor = colorChange.LightenDarkenColor(footColor,10)
            this.sidebarColor = 'background-color: var(--background-color)'
        }
    }
};
</script>
<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #ffffff;
}
.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
}
.header .logo {
    float: left;
    width: 250px;
    line-height: 70px;
}
.header-right {
    float: right;
    padding-right: 120px;
}
.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
}
.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
}
.btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
}
.btn-bell .el-icon-bell {
    color: #fff;
}
.user-name {
    margin-left: 10px;
}
.user-avator {
    margin-left: 20px;
}
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.el-dropdown-link {
    color: #fff;
    cursor: pointer;
}
.el-dropdown-menu__item {
    text-align: center;
}
</style>
