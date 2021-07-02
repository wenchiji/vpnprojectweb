<template>
    <div>
        <el-container style="height: 100%; border: 1px solid #eeeeee">
            <el-aside width="200px" style="background-color: rgb(238,241,246)">
                <el-menu router :default-openeds="['2','5']">
                    <el-submenu v-for="(item,index) in $router.options.routes" :index="index+''" v-if="item.show">
                        <template slot="title"><i class="el-icon-menu"></i>{{item.name}}</template>
                        <el-menu-item v-for="item2 in item.children" :index="item2.path"
                                      :class="$route.path==item2.path?'is-active':''">{{item2.name}}</el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-container>
                <el-header style="text-align: right; font-size: 12px">
                    <span>管理员</span>
                    &nbsp;
                    <button @click="logout">退出</button>
                </el-header>
                <el-main>
                    <router-view v-if="isRouterAlive"></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "index",
        provide(){
            return{
                reload: this.reload
            }
        },
        data() {
            return {
                isRouterAlive: true
            };
        },
        methods:{
            reload() {
                this.isRouterAlive = false;
                this.$nextTick(function () {
                    this.isRouterAlive = true;
                });
            },
            logout(){
                sessionStorage.removeItem('Authorization')
                this.$router.push("/")
            }
        },
    }
</script>

<style scoped>

</style>

