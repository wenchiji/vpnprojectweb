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
            <el-upload
                class="upload-demo"
                action=""
                :on-change="handleChange"
                :on-exceed="handleExceed"
                :on-remove="handleRemove"
                :file-list="fileListUpload"
                :limit="limitUpload"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                :auto-upload="false">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只 能 上 传 xlsx / xls 文 件</div>
            </el-upload>
            <el-button @click="outExe">导出</el-button>
        </div>
        <br><br>
        <el-table :data="tableData" border style="width: 100%" @selection-change="selectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column fixed type="index" label="序号" width="80">
            </el-table-column>
            <el-table-column prop=vpnInfo.vpn_name label="线路名称" width="260">
            </el-table-column>
            <el-table-column prop="user_id" label="工号" width="200">
            </el-table-column>
<!--            <el-table-column prop="user_id" label="姓名" width="150">-->
<!--            </el-table-column>-->
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
<!--                <el-form-item style="width: 80%" label="姓名" prop="userId" >-->
<!--                    <el-input v-model="editForm.user_id"></el-input>-->
<!--                </el-form-item>-->
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
                <el-button type="primary" @click="updateVpnUser">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        inject: ['reload'],
        methods: {
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
                    type:params.type,
                    endTime:params.endTime,
                    runId:params.runId,
                }).then( response => {
                    this.success = response.data.success
                    this.tableData = response.data.vpnUsers
                    this.total = response.data.totalElements
                })
            },
            ListAll(){
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
            handleChange(file, fileList){
                this.fileTemp = file.raw
                if(this.fileTemp){
                    if((this.fileTemp.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || (this.fileTemp.type == 'application/vnd.ms-excel')){
                        this.importfxx(this.fileTemp)
                    } else {
                        this.$message({
                            type:'warning',
                            message:'附件格式错误，请删除后重新上传！'
                        })
                    }
                } else {
                    this.$message({
                        type:'warning',
                        message:'请上传附件！'
                    })
                }
            },
            importfxx(obj) {
                let _this = this;
                // 通过DOM取文件数据
                this.file = obj
                const rABS = false; //是否将文件读取为二进制字符串
                const f = this.file;
                const reader = new FileReader();
                //if (!FileReader.prototype.readAsBinaryString) {
                FileReader.prototype.readAsBinaryString = function(f) {
                    let binary = "";
                    const rABS = false; //是否将文件读取为二进制字符串
                    const pt = this;
                    let wb; //读取完成的数据
                    let outdata;
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const bytes = new Uint8Array(reader.result);
                        const length = bytes.byteLength;
                        for(let i = 0; i < length; i++) {
                            binary += String.fromCharCode(bytes[i]);
                        }
                        const XLSX = require('xlsx');
                        if(rABS) {
                            wb = XLSX.read(btoa(fixdata(binary)), { //手动转化
                                type: 'base64'
                            });
                        } else {
                            wb = XLSX.read(binary, {
                                type: 'binary'
                            });
                        }
                        outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);//outdata就是你想要的东西
                        this.da = [...outdata]
                        let arr = []
                        this.da.map(v => {
                            let obj = {}
                            obj.vpnName = v['线路名称']
                            obj.userId = v['工号']
                            obj.type = v['类型']
                            obj.endTime = v['有效期截至']
                            obj.runId = v['流水号']
                            arr.push(obj)
                        })
                        return arr
                    }
                    reader.readAsArrayBuffer(f);
                }
                if(rABS) {
                    reader.readAsArrayBuffer(f);
                } else {
                    reader.readAsBinaryString(f);
                }
            },
            handleRemove(file,fileList){
                this.fileTemp = null
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择1个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`
                );
            },
            // 导出
            outExe() {
                this.$confirm("此操作将导出excel文件, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.excelData = this.tableData; //你要导出的数据list。
                    this.export2Excel();
                }).catch(() => {});
            },
            export2Excel() {
                const that = this;
                require.ensure([], () => {
                    const { export_json_to_excel } = require("../excal/Export2Excel"); //这里必须使用绝对路径，根据自己的命名和路径
                    const tHeader = [
                            "序号",
                            "线路名称",
                            "工号",
                            "类型",
                            "有效期截至",
                            "流水号"
                    ]; // 导出的表头名
                    const filterVal = [
                            "index",
                            "vpnInfo.vpn_name",
                            "user_id",
                            "type",
                            "end_time",
                            "run_id",
                    ]; // 导出的表头字段名
                    const list = that.excelData;
                    // that.excelData为传入的数据
                    const data = that.formatJson(filterVal, list);
                    export_json_to_excel(tHeader, data, `测试导出excel`); // 导出的表格名称，根据需要自己命名
                    // tHeader为导出Excel表头名称，`xxxxxx`即为导出Excel名称
                });
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]));
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
            this1.ListAll(this1)
        },
        data() {
            return {
                select:'',
                baseUrl: 'http://127.0.0.1:8000/vpnproject/vpnuser/',
                // baseUrl: 'http://14.18.205.249:9002/vpnlog/getvpnlog/',
                input:'',
                vpnName:'',
                userId:'',
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
                    endTime:'',
                    runId:''
                },
                vpnType:'',
                editForm:{
                    id:'',
                    vpn_name:'',
                    type:'',
                    user_id:'',
                    end_time:'',
                    run_id:'',
                },
                fileTemp:'',
                file:'',
                limitUpload:1,
                fileListUpload:[],
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
