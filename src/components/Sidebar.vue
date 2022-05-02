<!--
 * @Description: 页面左侧导航栏
 * @Author: Wangyl
 * @Date: 2021-10-05 17:58:35
 * @LastEditors: Wangyl
 * @LastEditTime: 2022-05-02 14:53:39
-->
<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#34495e"
                 text-color="#ffffff" active-text-color="#1e90ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template #title>
                            <i :class="item.icon"></i>
                            <span>{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template #title>{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <template #title>{{ item.title }}</template>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import { computed, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
export default {
    setup() {
        const items = [
            {
                icon: "el-icon-s-home",
                index: "/index",
                title: "首页",
            },
            {
                icon: "el-icon-s-data",
                index: "1",
                title: "院系管理",
                subs: [
                    {
                        index: "/college",
                        title: "院系管理",
                    }
                ],
            },
            {
                icon: "el-icon-refrigerator",
                index: "2",
                title: "专业管理",
                subs: [
                    {
                        index: "/professional",
                        title: "专业管理",
                    }
                ],
            },
            {
                icon: "el-icon-potato-strips",
                index: "3",
                title: "年级管理",
                subs: [
                    {
                        index: "/grade",
                        title: "年级管理",
                    }
                ],
            },
            {
                icon: "el-icon-box",
                index: "4",
                title: "班级管理",
                subs: [
                    {
                        index: "/classes",
                        title: "班级管理",
                    }
                ],
            },
            {
                icon: "el-icon-s-custom",
                index: "5",
                title: "人员管理",
                subs: [
                    {
                        index: "/users",
                        title: "管理员维护",
                    },
                    {
                        index: "/teacher",
                        title: "教师管理",
                    },
                    {
                        index: "/student",
                        title: "学生管理",
                    },
                ],
            },
            {
                icon: "el-icon-notebook-1",
                index: "6",
                title: "课程管理",
                subs: [
                    {
                        index: "/course",
                        title: "课程管理",
                    }
                ],
            },
            {
                icon: "el-icon-printer",
                index: "7",
                title: "分班管理",
                subs: [
                    {
                        index: "/driverClasses",
                        title: "分班管理",
                    }
                ],
            },
            {
                icon: "el-icon-bank-card",
                index: "8",
                title: "必修课管理",
                subs: [
                    {
                        index: "/chooseCourse",
                        title: "必修课管理",
                    },
                ],
            },
            {
                icon: "el-icon-wallet",
                index: "9",
                title: "选修课管理",
                subs: [
                    {
                        index: "/checkCourse",
                        title: "选修课详情",
                    },
                    {
                        index: "/statistical",
                        title: "选修课统计",
                    },
                ],
            },
            {
                icon: "el-icon-picture-outline",
                index: "10",
                title: "成绩管理",
                subs: [
                    {
                        index: "/score",
                        title: "成绩管理",
                    },
                ],
            },
            {
                icon: "el-icon-alarm-clock",
                index: "11",
                title: "定时任务",
                subs: [
                    {
                        index: "/quartz",
                        title: "定时任务",
                    },
                ],
            },
        ];

        const route = useRoute();

        const onRoutes = computed(() => {
            return route.path;
        });

        const store = useStore();
        const collapse = computed(() => store.state.collapse);

        return {
            items,
            onRoutes,
            collapse,
        };
    },
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
