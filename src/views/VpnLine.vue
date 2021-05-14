<template>
    <div>
        <div class="demo-input-suffix">
            线路分类：
            <el-select v-model="vpnType" filterable placeholder="请选择线路" @focus="vpnTypeFocus()"
                       size="small" style="width: 160px;" value-key="value">
                <el-option v-for="item in vpnTypes"
                           :key="item"
                           :value="item"
                           :label="item" size="small"></el-option>
            </el-select>
            线路名称：
            <el-select v-model="vpnName" filterable placeholder="请选择线路" @focus="vpnNameFocus()"
                       size="small" style="width: 160px;" value-key="value">
                <el-option v-for="item in vpnNames"
                           :key="item"
                           :value="item"
                           :label="item" size="small"></el-option>
            </el-select>
            IP：
            <el-input
                placeholder="请输入IP"
                style="width: 10%"
                v-model="vpnIp">
            </el-input>
            &nbsp;
            VPN账号：
            <el-input
                placeholder="请输入VPN账号"
                style="width: 10%"
                v-model="vpnAcount">
            </el-input>
            &nbsp;
            群组名称：
            <el-input
                placeholder="请输入群组名称"
                style="width: 10%"
                v-model="vpnGroupName">
            </el-input>
            &nbsp;
            密钥：
            <el-input
                placeholder="请输入密钥"
                style="width: 10%"
                v-model="secretKey">
            </el-input>
            <el-button icon="el-icon-search" @click="findVpnLine" type="success">查 询</el-button>
            <el-button @click="handleEdit()" type="primary" icon="el-icon-edit">添加线路</el-button>
        </div>
        <br><br>
        <el-table :data="tableData" border style="width: 100%" @selection-change="selectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column fixed type="index" label="序号" width="80">
            </el-table-column>
            <el-table-column prop="vpn_type" label="线路分类" width="200">
            </el-table-column>
            <el-table-column prop="vpn_name" label="线路名称" width="260">
            </el-table-column>
            <el-table-column prop="vpn_ip" label="IP" width="200">
            </el-table-column>
            <el-table-column prop="vpn_acount" label="VPN账号" width="150">
            </el-table-column>
            <el-table-column prop="vpn_pass" label="VPN密码" width="300">
            </el-table-column>
            <el-table-column prop="vpn_group_name" label="群组名称" width="110">
            </el-table-column>
            <el-table-column prop="secret_key" label="密钥" width="120">
            </el-table-column>
            <el-table-column prop="remark" label="备注" width="400">
            </el-table-column>
            <el-table-column prop="isAllowPing" label="线路情况" width="100">
            </el-table-column>
            <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                    <el-button @click="handleEdit(scope.$index,scope.row)" type="info" size="small" icon="el-icon-edit">编 辑</el-button>
                    <el-button @click="deleteVpnLine(scope.row)" type="danger" size="small" icon="el-icon-delete">删 除</el-button>
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
        <el-dialog :visible.sync="vpnTypeFormVisible" :close-on-click-modal="false" style="width: 100%" title="新增 or 编辑" >
            <el-form :model="editForm" ref="editForm">
                <el-form-item style="width: 80%" label="id" prop="id" hidden>
                    <el-input v-model="editForm.id"></el-input>
                </el-form-item>
                <el-form-item label="线路分类" prop="empRoleId">
                    <el-select v-model="editForm.vpn_type" filterable placeholder="请选择线路分类" @focus="vpnTypeFocus()"
                               size="small" style="width: 160px;" value-key="value">
                        <el-option v-for="item in vpnTypes"
                                    :key="item"
                                    :value="item"
                                    :label="item" size="small"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="线路名称" prop="empRoleId">
                    <el-select v-model="editForm.vpn_name" filterable placeholder="请选择线路名称" @focus="vpnNameFocus()"
                               size="small" style="width: 160px;" value-key="value">
                        <el-option v-for="item in vpnNames"
                                    :key="item"
                                    :value="item"
                                    :label="item" size="small"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="width: 80%" label="IP" prop="vpnIp" >
                    <el-input v-model="editForm.vpn_ip"></el-input>
                </el-form-item>
                <el-form-item style="width: 80%" label="VPN账号" prop="vpnAcount" >
                    <el-input v-model="editForm.vpn_acount"></el-input>
                </el-form-item>
                <el-form-item style="width: 80%" label="VPN密码" prop="vpnPass" >
                    <el-input v-model="editForm.vpn_pass" ></el-input>
                </el-form-item>
                <el-form-item style="width: 80%" label="群组名称" prop="vpnGroupName" >
                    <el-input v-model="editForm.vpn_group_name" ></el-input>
                </el-form-item>
                <el-form-item style="width: 80%" label="密钥" prop="secretKey" >
                    <el-input v-model="editForm.secret_key" ></el-input>
                </el-form-item>
                <el-form-item style="width: 80%" label="备注" prop="remark" >
                    <el-input v-model="editForm.remark" ></el-input>
                </el-form-item>
                <el-form-item style="width: 80%" label="线路情况" prop="isAllowPing" >
                    <el-input v-model="editForm.isAllowPing" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="vpnTypeFormVisible = false">取 消</el-button>
                <el-button @click="resetForm('editForm')">重置</el-button>
                <el-button type="primary" @click="addVpnLine">新 增</el-button>
                <el-button type="primary" @click="updateVpnLine">确 定</el-button>
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
                    vpnType:params.vpnType,
                    vpnName:params.vpnName,
                    vpnIp:params.vpnIp,
                    vpnAcount:params.vpnAcount,
                    vpnPass:params.vpnPass,
                    vpnGroupName:params.vpnGroupName,
                    secretKey:params.secretKey,
                    isAllowPing:params.isAllowPing
                }).then( response => {
                    this.success = response.data.success
                    this.tableData = response.data.vpnLines
                    this.total = response.data.totalElements
                })
            },
            ListAll(){
                this.queryParam.action = 'listVpnLine',
                this.getList()
            },
            findVpnLine(){
                this.queryParam.action = 'findVpnLine',
                this.queryParam.vpnType = this.vpnType
                this.queryParam.vpnName = this.vpnName
                this.queryParam.vpnIp = this.vpnIp
                this.queryParam.vpnAcount = this.vpnAcount
                this.queryParam.vpnPass = this.vpnPass
                this.queryParam.vpnGroupName = this.vpnGroupName
                this.queryParam.secretKey = this.secretKey
                this.getList()
            },
            vpnTypeFocus(){
                this.$axios.post(this.baseUrl,{
                    action: 'getVpnType'
                }).then(resp => {
                    this.vpnTypes = resp.data.vpnTypes
                })
            },
            vpnNameFocus(){
                this.$axios.post(this.baseUrl,{
                    action: 'getVpnName'
                }).then(resp => {
                    this.vpnNames = resp.data.vpnNames
                })
            },
            addVpnLine(){
                this.$axios.post(this.baseUrl,{
                    action:'addVpnLine',
                    vpnType:this.editForm.vpn_type,
                    vpnName:this.editForm.vpn_name,
                    vpnIp:this.editForm.vpn_ip,
                    vpnAcount:this.editForm.vpn_acount,
                    vpnPass:this.editForm.vpn_pass,
                    vpnGroupName:this.editForm.vpn_group_name,
                    secretKey:this.editForm.secret_key,
                    remark:this.editForm.remark
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
            updateVpnLine(){
                this.$axios.post(this.baseUrl,{
                    action:'updateVpnLine',
                    id:this.editForm.id,
                    vpnType:this.editForm.vpn_type,
                    vpnName:this.editForm.vpn_name,
                    vpnIp:this.editForm.vpn_ip,
                    vpnAcount:this.editForm.vpn_acount,
                    vpnPass:this.editForm.vpn_pass,
                    vpnGroupName:this.editForm.vpn_group_name,
                    secretKey:this.editForm.secret_key,
                    remark:this.editForm.remark,
                    isAllowPing:this.editForm.isAllowPing
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
            deleteVpnLine(row){
                this.$confirm('此操作将永久删除该数据, 是否继续?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post(this.baseUrl,{
                        action:'deleteVpnLine',
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
                this.vpnTypeFormVisible = true;
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
                baseUrl: 'http://127.0.0.1:8000/vpnproject/vpnline/',
                // baseUrl: 'http://14.18.205.249:9002/vpnlog/getvpnlog/',
                input:'',
                queryParam:{
                    action:'',
                    page:'',
                    pagesize:'',
                    input:'',
                    vpnType:'',
                    vpnName:'',
                    vpnIp:'',
                    vpnAcount:'',
                    vpnPass:'',
                    vpnGroupName:'',
                    secretKey:'',
                    remark:'',
                    isAllowPing:''
                },
                vpnType:'',
                vpnTypes:'',
                vpnName:'',
                vpnNames:'',
                vpnIp:'',
                vpnAcount:'',
                vpnGroupName:'',
                secretKey:'',
                editForm:{
                    id:'',
                    vpn_type:'',
                    vpn_name:'',
                    vpn_ip:'',
                    vpn_acount:'',
                    vpn_pass:'',
                    vpn_group_name:'',
                    secret_key:'',
                    remark:'',
                    isAllowPing:''
                },
                currentPage: 1,
                pageSize: 12,
                total: 0,
                tableData: [],
                center:true,
                vpnTypeFormVisible: false,
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
