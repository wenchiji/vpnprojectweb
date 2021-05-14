<template>
    <div>
        查询：
        <el-input @keyup.enter.native="findByName" v-model="username" style="width: 20%" placeholder="请输入姓名"></el-input>
        &nbsp;
        <el-button @click="handerEdit()" type="success" icon="el-icon-edit">新增用户</el-button>
        <br><br>
        <el-table :data="tableData" border style="width: 100%" @selection-change="selectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column fixed type="index" label="序号" width="100">
            </el-table-column>
            <el-table-column prop="username" label="姓名" width="150">
            </el-table-column>
            <el-table-column prop="email" label="邮箱" width="180">
            </el-table-column>
            <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                    <el-button @click="updatepsd(scope.$index,scope.row)" size="small">修改密码</el-button>
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
                <el-form-item style="width: 80%" label="用户姓名">
                    <el-input v-model="addForm.username" ></el-input>
                </el-form-item>
                <el-form-item style="width: 80%" label="邮箱" prop="email" >
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item style="width: 80%" label="密码" prop="password" >
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="userFormVisible = false">取 消</el-button>
                <el-button @click="resetForm('addForm')">重置</el-button>
                <el-button type="primary" @click="addUser">新 增</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="updatePassword" :close-on-click-modal="false" style="width: 100%" title="修改密码" >
            <el-form :model="editForm" ref="editForm">
                <el-form-item style="width: 80%" label="用户编号" prop="id" hidden>
                    <el-input v-model="editForm.id" ></el-input>
                </el-form-item>
                <el-form-item style="width: 80%" label="密码" prop="password">
                    <el-input v-model="editForm.old_password"></el-input>
                </el-form-item>
                <el-form-item style="width: 80%" label="请输入新密码">
                    <el-input v-model="editForm.new_password" ></el-input>
                </el-form-item>
                <el-form-item style="width: 80%" label="再次输入密码" >
                    <el-input v-model="editForm.r_new_password"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="updatePassword = false">取 消</el-button>
                <el-button @click="resetForm('editForm')">重置</el-button>
                <el-button type="primary" @click="updateUserPsd">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        inject: ['reload'], //依赖注入
        methods: {
            getList(that){
                this.$axios.post(this.baseUrl,{
                    action:'listUser',
                    page:this.currentPage,
                    pagesize:this.pageSize,
                }).then(function (response) {
                    that.tableData = response.data.users
                    that.total = response.data.totalElements
                })
            },
            findByName(){
                this.$axios.post(this.baseUrl,{
                    username:this.username
                }).then(response => {
                    this.tableData = response.data
                    this.total = response.data.totalElements
                })
            },
            //批量选择时触发
            selectionChange(val){
                this.selectionList = val
            },
            addUser(){
                this.$axios.post(this.baseUrl,{
                    action:'register',
                    username: this.addForm.username,
                    email: this.addForm.email,
                    password:this.addForm.password
                }).then((response)=>{
                    if(response.data.success == 'true'){
                        this.$alert('用户 '+this.editForm.username+' 添加成功!','提示', {
                            confirmButtonText: '确定',
                            callback: action => {
                                this.reload();
                            }
                        });
                    }else {
                        this.$alert('用户 '+this.editForm.username+' 添加失败!','提示', {
                            confirmButtonText: '确定',
                            callback: action => {
                                this.reload();
                            }
                        });
                    }
                })
            },
            updateUserPsd() {
                this.$axios.post(this.baseUrl,{
                    action:'reset_psd',
                    id:this.editForm.id,
                    username:this.editForm.username,
                    old_password: this.editForm.old_password,
                    new_password: this.editForm.new_password,
                    r_new_password:this.editForm.r_new_password
                }).then((response)=>{
                    if(response.data.success == 'true'){
                        this.$alert('更新成功!','提示', {
                            confirmButtonText: '确定',
                            callback: action => {
                                this.reload();
                            }
                        });
                    }else {
                        this.$alert(response.data.info,'提示', {
                            confirmButtonText: '确定',
                            callback: action => {
                                this.reload();
                            }
                        });
                    }
                })
            },
            deleteUser(row) {
                this.$confirm('此操作将永久删除该用户, 是否继续?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post(this.baseUrl,{
                        action:'deleteUser',
                        id:row.id
                    })
                    this.$alert('删除成功!','提示', {
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
            },
            //显示编辑页面
            handerEdit: function(index,row){
                this.userFormVisible = true;
                this.editForm = Object.assign({},row);
            },
            //显示编辑页面
            updatepsd: function(index,row){
                this.updatePassword = true;
                this.editForm = Object.assign({},row);
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            pageChange(currentPage){
                const that = this
                that.currentPage = currentPage;
                that.getList(that);
            },

        },
        created() {
            const this1 = this
            this1.getList(this1)
        },
        data() {
            return {
                // baseUrl: 'http://103.228.163.54:9009/user/users/',
                baseUrl: 'http://127.0.0.1:8000/user/users/',
                input:'',
                username:'',
                //批量删除选中id
                selectionList:[],
                pageSize: 10,
                total: 0,
                tableData: [],
                currentPage: 1,
                center:true,
                userFormVisible: false,
                updatePassword: false,
                form: {
                    username: '',
                    email:'',
                    password:''
                },
                formLabelWidth: '100px',
                addForm: {
                    username: '',
                    email: '',
                    password: ''
                },
                editForm: {
                    id:'',
                    username:'',
                    old_password: '',
                    new_password: '',
                    r_new_password: ''
                }
            }
        }
    }
</script>
