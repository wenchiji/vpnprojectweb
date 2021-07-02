<template>
	<div>
        <div class="demo-input-suffix">
            线路名称：
            <el-select v-model="vpnName" filterable placeholder="请选择线路" @focus="vpnNameFocus()"
                       size="small" style="width: 160px;" value-key="value">
                <el-option v-for="item in vpnNames"
                           :key="item"
                           :value="item"
                           :label="item" size="small"></el-option>
            </el-select>
            工号：
            <el-input
                placeholder="请输入工号"
                style="width: 10%"
                v-model="userId">
            </el-input>
            &nbsp;
            流水号：
            <el-input
                placeholder="请输入流水号"
                style="width: 10%"
                v-model="runId">
            </el-input>
            &nbsp;
            <el-button icon="el-icon-search" @click="findVpnUser" type="success">查 询</el-button>
            <el-button @click="handleEdit()" type="primary" icon="el-icon-edit">添加用户</el-button>
            <el-button @click="bathDeleteRole" type="danger"
               :disabled="this.selectionList.length == 0">删除</el-button>
            <el-button type="primary" @click="outExe">导出</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" type="primary"
                       @click="openCsvDialog()" icon="el-icon-plus">导入</el-button>
        </div>
        <br><br>
        <el-table :data="tableData" border style="width: 100%" @selection-change="selectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column fixed type="index" label="序号" width="80">
            </el-table-column>
            <el-table-column prop="vpn_name" label="线路名称" width="260">
            </el-table-column>
            <el-table-column prop="user_id" label="工号" width="150">
            </el-table-column>
            <el-table-column prop="user_name" label="姓名" width="150">
            </el-table-column>
            <el-table-column prop="type" label="类型" width="150">
            </el-table-column>user_name
            <el-table-column prop="end_time" label="有效期截至" width="200">
            </el-table-column>
            <el-table-column prop="run_id" label="流水号" width="120">
            </el-table-column>
            <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                    <el-button @click="handleEdit(scope.$index,scope.row)" type="info" size="small" icon="el-icon-edit">编 辑</el-button>
                    <el-button @click="deleteVpnUser(scope.row)" type="danger" size="small" icon="el-icon-delete">删 除</el-button>
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
        <el-dialog :title="csvTitle" :visible.sync="csvVisible" width="50%" enctype="multipart/form-data">
            <div>
                <el-form ref="file" label-width="120px" enctype="multipart/form-data">
                    <el-upload
                        class="upload-demo"
                        ref='upload'
                        drag
                        accept=".csv"
                        action="http://127.0.0.1:8000/vpnproject/uploadRole/"
                        :multiple="false"
                        :limit="1"
                        :auto-upload="false"
                        :on-change="handleChange">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text" id="roles">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">只能上传csv文件</div>
                    </el-upload>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="csvVisible = false">取消</el-button>
            <el-button type="primary" @click="uploadCsv">导入</el-button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="userFormVisible" :close-on-click-modal="false" style="width: 100%" title="新增 or 编辑" >
            <el-form :model="editForm" ref="editForm">
                <el-form-item style="width: 80%" label="id" prop="id" hidden>
                    <el-input v-model="editForm.id"></el-input>
                </el-form-item>
                <el-form-item label="线路名称" prop="empRoleId">
                    <el-select v-model="editForm.vpn_name" filterable placeholder="请选择线路" @focus="vpnNameFocus()"
                               size="small" style="width: 160px;" value-key="value">
                        <el-option v-for="item in vpnNames"
                                    :key="item"
                                    :value="item"
                                    :label="item" size="small"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="width: 80%" label="工号" prop="userId">
                    <el-input v-model="editForm.user_id" ></el-input>
                </el-form-item>
                <el-form-item style="width: 80%" label="姓名" prop="username" >
                    <el-input v-model="editForm.user_name"></el-input>
                </el-form-item>
                <el-form-item style="width: 80%" label="类型" prop="type" >
                    <el-input v-model="editForm.type"></el-input>
                </el-form-item>
                <el-form-item style="width: 80%" label="有效截止日期" prop="endTime" >
                    <el-input v-model="editForm.end_time" ></el-input>
                </el-form-item>
                <el-form-item style="width: 80%" label="流水号" prop="runId" >
                    <el-input v-model="editForm.run_id" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="userFormVisible = false">取 消</el-button>
                <el-button @click="resetForm('editForm')">重置</el-button>
                <el-button type="primary" @click="addVpnUser">新 增</el-button>
                <el-button type="primary" @click="updateVpnUser">更 新</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        inject: ['reload'],
        methods: {
            openCsvDialog(){
                this.file = {};
                this.csvVisible = true;
                this.csvTitle = '导入CSV文件';
            },
            handleChange(file){
                this.file = file.raw;
                console.log(this.file)
            },

            getList(){
                this.queryParam.page = this.currentPage,
                this.queryParam.pagesize = this.pageSize
                let params = this.queryParam;
                this.$axios.post(this.baseUrl,{
                    action:params.action,
                    page:params.page,
                    pagesize:params.pagesize,
                    item: params.input,
                    vpnName:params.vpnName,
                    userId:params.userId,
                    username:params.username,
                    type:params.type,
                    endTime:params.endTime,
                    runId:params.runId,
                }).then( response => {
                    this.success = response.data.success
                    this.tableData = response.data.vpnUsers
                    this.total = response.data.totalElements
                })
            },
            listAll(){
                this.queryParam.action = 'listVpnUser',
                this.getList()
            },
            findVpnUser(){
                this.queryParam.action = 'findVpnUser',
                this.queryParam.vpnName = this.vpnName
                this.queryParam.userId = this.userId
                this.queryParam.runId = this.runId
                this.getList()
            },
            vpnNameFocus(){
                this.$axios.post(this.baseUrl,{
                    action: 'getVpnName'
                }).then(resp => {
                    this.vpnNames = resp.data.vpnNames
                })
            },
            addVpnUser(){
                this.$axios.post(this.baseUrl,{
                    action:'addVpnUser',
                    vpnName:this.editForm.vpn_name,
                    userId:this.editForm.user_id,
                    username:this.editForm.user_name,
                    type:this.editForm.type,
                    endTime:this.editForm.end_time,
                    runId:this.editForm.run_id
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
            updateVpnUser(){
                this.$axios.post(this.baseUrl,{
                    action:'updateVpnUser',
                    id:this.editForm.id,
                    userId:this.editForm.user_id,
                    username:this.editForm.user_name,
                    vpnName:this.editForm.vpn_name,
                    type:this.editForm.type,
                    endTime:this.editForm.end_time,
                    runId:this.editForm.run_id
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
            deleteVpnUser(row){
                this.$confirm('此操作将永久删除该数据, 是否继续?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post(this.baseUrl,{
                        action:'deleteVpnUser',
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
            bathDeleteRole() {
                let ids = this.selectionList.map(item => item.id).join()
                this.$confirm('此操作将永久删除所选中信息, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.$axios.post(this.baseUrl, {
                    action: 'bathDelete',
                    ids: ids
                  }).then((response) => {
                    if (response.data.success == 'true') {
                      this.$alert('删除成功!', '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                          this.reload();
                        }
                      });
                    } else {
                      this.$alert('删除失败!', '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                          this.reload();
                        }
                      });
                    }
                  }).catch(() => {
                    this.$message({
                      type: 'info',
                      message: '已取消删除'
                    });
                  });
              })
            },
            outExe() {
                this.$axios.post('http://127.0.0.1:8000/vpnproject/exceldata/',{
                        action:'exportRole',
                    }).then((response)=>{
                        if(response.data.success == "true"){
                            this.$alert('导出成功!','提示', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    this.reload();
                                }
                            });
                        }else {
                            this.$alert('导出失败!','提示', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    this.reload();
                                }
                            });
                        }
                    })
            },
            uploadCsv(){
                if(Object.keys(this.file).length != 0){
                    let data = new FormData()
                    data.append('file', this.file)
                    this.$axios.post('http://127.0.0.1:8000/vpnproject/uploadRole/', data).then(response =>{
                        if(response.data.success == "true"){
                            this.csvVisible = false;
                            this.$alert('导入成功：'+response.data.success_num+'个，导入失败: ' + response.data.error_num+'个: '+response.data.msg, '提示', {
                                    confirmButtonText: '确定',
                                    reload:this.reload
                                })
                        }else {
                            this.$alert('导入失败：'+response.data.msg,'提示', {
                            confirmButtonText: '确定',
                            callback:action=>{
                                location.reload();
                            }
                        });
                        }
                    })
                }else{
                  this.$message.error('上传文件不能为空');
                }
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
                this.$axios.post(this.baseUrl,{
                    action:'getVpnName'
                }).then(response =>{
                    this.vpnName.push({value:response.name,label:response.label})
                })
                this.userFormVisible = true;
                this.editForm = Object.assign({},row);
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
        },
        created() {
            const this1 = this
            this1.listAll(this1)
        },
        data() {
            return {
                csvVisible:false,
                csvTitle:'',
                select:'',
                baseUrl: 'http://127.0.0.1:8000/vpnproject/vpnuser/',
                selectionList:'',
                input:'',
                vpnName:'',
                userId:'',
                username:'',
                runId:'',
                vpnInfo:'',
                vpnNames:{},
                value:'',
                queryParam:{
                    action:'',
                    page:'',
                    pagesize:'',
                    input:'',
                    type:'',
                    vpnName:'',
                    userId:'',
                    username:'',
                    endTime:'',
                    runId:''
                },
                vpnType:'',
                editForm:{
                    id:'',
                    vpn_name:'',
                    type:'',
                    user_id:'',
                    user_name:'',
                    end_time:'',
                    run_id:'',
                },
                excelData:[],
                currentPage: 1,
                pageSize: 12,
                total: 0,
                tableData: [],
                center:true,
                userFormVisible: false,
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
