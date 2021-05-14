<template>
    <div>
        <el-container style="height: 100%; border: 1px solid #eee">
            <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
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
                    <el-dropdown @command="logout">
                        <i class="el-icon-setting" style="margin-right: 15px"></i>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item >退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <span>管理员</span>
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
                localStorage.removeItem('eleToken');
                localStorage.removeItem('user');
                this.$router.push("/")
            }
        },
    }
</script>

<style scoped>

</style>

