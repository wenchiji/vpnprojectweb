<template>
    <div>
        分类名称：
        <el-input @keyup.enter.native="findByVpnName" v-model="input" style="width: 20%" placeholder="请输入分类名称"></el-input>
        &nbsp;
        <template>
            <el-button @click="handleEdit()" type="primary" icon="el-icon-edit">添加分类</el-button>
        </template>
        <br><br>
        <el-table :data="tableData" border style="width: 50%" @selection-change="selectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column fixed type="index" label="序号" width="100">
            </el-table-column>
            <el-table-column prop="vpn_type_name" label="分类名称" width="300">
            </el-table-column>
            <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                    <el-button @click="handleEdit(scope.$index,scope.row)" type="info" size="small" icon="el-icon-edit">编 辑</el-button>
                    <el-button @click="deleteVpnType(scope.row)" type="danger" size="small" icon="el-icon-delete">删 除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                background
                layout="prev, pager, next"
                :page-size= "pageSize"
                :total="total"
                :current-page.sync="currentPage"
                @current-change="pageChange">
        </el-pagination>
        <el-dialog :visible.sync="typeFormVisible" :close-on-click-modal="false" style="width: 50%" title="新增 or 编辑" >
            <el-form :model="editForm" ref="editForm">
                <el-form-item style="width: 50%" label="id" prop="id" hidden>
                    <el-input v-model="editForm.id"></el-input>
                </el-form-item>
                <el-form-item style="width: 80%" label="VPN分类名称" prop="vpnTypeName" >
                    <el-input v-model="editForm.vpn_type_name" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="typeFormVisible = false">取 消</el-button>
                <el-button @click="resetForm('editForm')">重置</el-button>
                <el-button type="primary" @click="addVpnType">新 增</el-button>
                <el-button type="primary" @click="updateVpnType">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        inject: ['reload'], //依赖注入
        methods: {
            // 后端接口调用函数
            getList(){
                this.queryParam.page = this.currentPage,
                this.queryParam.pagesize = this.pageSize
                let params = this.queryParam;
                this.$axios.post(this.baseUrl,{
                    action:params.action,
                    page:params.page,
                    pagesize:params.pagesize,
                    item: params.input,
                    vpnTypeName:params.vpnTypeName,
                }).then( response => {
                    this.success = response.data.success
                    this.tableData = response.data.vpnTypes
                    this.total = response.data.totalElements
                })
            },
            ListAll(){
                this.queryParam.action = 'listVpnType',
                this.getList()
            },
            findByVpnName(){
                this.queryParam.action = 'findVpnType',
                this.queryParam.input = this.input
                this.getList()
            },
            addVpnType(){
                this.$axios.post(this.baseUrl,{
                    action:'addVpnType',
                    vpnTypeName:this.editForm.vpnTypeName,
                }).then( response => {
                    if(response.data.success == 'true'){
                        this.$alert('添加成功!','提示', {
                            confirmButtonText: '确定',
                            callback:action=>{
                                location.reload();
                            }
                        });
                    }else {
                        this.$alert('添加失败!','提示', {
                            confirmButtonText: '确定',
                            callback:action=>{
                                location.reload();
                            }
                        });
                    }
                })
            },
            updateVpnType(){
                this.$axios.post(this.baseUrl,{
                    action:'updateVpnType',
                    id:this.editForm.id,
                    vpnTypeName:this.editForm.vpnTypeName,
                }).then( response => {
                    if(response.data.success == 'true'){
                        this.$alert('更新成功!','提示', {
                            confirmButtonText: '确定',
                            callback:action=>{
                                location.reload();
                            }
                        });
                    }else {
                        this.$alert('更新失败!','提示', {
                            confirmButtonText: '确定',
                            callback:action=>{
                                location.reload();
                            }
                        });
                    }
                })
            },
            deleteVpnType(row){
                this.$confirm('此操作将永久删除该数据, 是否继续?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post(this.baseUrl,{
                        action:'deleteVpnType',
                        id:row.id
                    }).then((response)=>{
                        if(response.data.success == "true"){
                            this.$alert('删除成功!','提示', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    this.reload();
                                }
                            });
                        }else {
                            this.$alert('删除失败!','提示', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    this.reload();
                                }
                            });
                        }
                    })
                }).catch((e) => {
                    console.log(e.message);
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            pageChange(currentPage){
                const that = this
                that.currentPage = currentPage;
                that.getList();
            },
            selectionChange(val){
                this.selectionList = val
            },
            handleEdit(index,row){
                this.typeFormVisible = true;
                this.editForm = Object.assign({},row);
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
        },
        created() {
            const this1 = this
            this1.ListAll(this1)
        },
        data() {
            return {
                select:'',
                baseUrl: 'http://127.0.0.1:8000/vpnproject/vpntype/',
                // baseUrl: 'http://14.18.205.249:9002/vpnlog/getvpnlog/',
                input:'',
                vpnTypeName:'',
                queryParam:{
                    action:'',
                    page:'',
                    pagesize:'',
                    input:'',
                    vpnTypeName:'',
                },
                editForm:{
                    id:'',
                    vpn_type_name:''
                },
                currentPage: 1,
                pageSize: 10,
                total: 0,
                tableData: [],
                center:true,
                typeFormVisible: false,
                formLabelWidth: '100px',
            }
        }
    }
</script>

<style>
  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
