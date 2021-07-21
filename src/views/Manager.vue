<template>
    <div>
        查询：
        <el-input @keyup.enter.native="findByName" v-model="username" style="width: 20%" placeholder="请输入姓名"></el-input>
        &nbsp;
        <el-button @click="handerEdit()" type="success" icon="el-icon-edit">新增用户</el-button>
        <br><br>
        <el-table :data="tableData" style="width: 100%" @selection-change="selectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" label="序号" width="100">
            </el-table-column>
            <el-table-column prop="username" label="姓名" width="180">
            </el-table-column>
            <el-table-column prop="email" label="邮箱" width="200">
            </el-table-column>
            <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                    <el-button @click="deleteUser(scope.row)" type="danger" size="small" icon="el-icon-delete">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                background
                layout="prev, pager, next"
                :page-size= "pageSize"
                :total="total"
                :current-page="currentPage"
                @current-change="pageChange">
        </el-pagination>
        <el-dialog :visible.sync="userFormVisible" :close-on-click-modal="false" style="width: 100%" title="新增用户" >
            <el-form :model="addForm" ref="addForm">
                <el-form-item style="width: 80%" label="姓名">
                    <el-input v-model="addForm.username" ></el-input>
                </el-form-item>
                <el-form-item style="width: 80%" label="邮箱">
                    <el-input v-model="addForm.email" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="userFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">添 加</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        inject: ['reload'], //依赖注入
        methods: {
            getList(that) {
                this.$axios.post(this.baseUrl, {
                    action: 'listManager',
                    page: this.currentPage,
                    pagesize: this.pageSize,
                }).then(function (response) {
                    that.tableData = response.data.users
                    that.total = response.data.totalElements
                })
            },
            findByName() {
                this.$axios.post(this.baseUrl, {
                    action: 'findManager',
                    username: this.username
                }).then(response => {
                    this.tableData = response.data.manager
                    this.total = response.data.totalElements
                })
            },
            //批量选择时触发
            selectionChange(val) {
                this.selectionList = val
            },
            addUser() {
                this.$axios.post(this.baseUrl, {
                    action: 'addManager',
                    username: this.addForm.username,
                    email: this.addForm.email
                }).then((response) => {
                    this.$alert(response.data.msg, '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                            this.reload();
                        }
                    })
                })
            },
            deleteUser(row) {
                this.$confirm('此操作将永久删除该用户, 是否继续?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post(this.baseUrl, {
                        action: 'deleteManager',
                        id: row.id
                    }).then((response) => {
                        this.$alert(response.data.msg, '提示', {
                            confirmButtonText: '确定',
                            callback: action => {
                                this.reload();
                            }
                        });
                    }).catch((e) => {
                        console.log(e.message);
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                })
            },
            pageChange(currentPage) {
                const that = this
                that.currentPage = currentPage;
                that.getList(that);
            },
            created() {
                const this1 = this
                this1.getList(this1)
            },
            data() {
                return {
                    baseUrl: this.$root.URL + 'user/users/',
                    input: '',
                    username: '',
                    email: '',
                    //批量删除选中id
                    selectionList: [],
                    pageSize: 10,
                    total: 0,
                    tableData: [],
                    currentPage: 1,
                    center: true,
                    userFormVisible: false,
                    form: {
                        username: '',
                        email: ''
                    },
                    formLabelWidth: '100px',
                    addForm: {
                        username: '',
                        email: ''
                    },
                }
            }
        }
    }
</script>
