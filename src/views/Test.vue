<template>
    <div>
        <span >选择查询条件：</span>
        <el-input
            placeholder="请输入内容"
            v-model="input"
            class="input-with-select"
            style="width: 30%"
        >
        <template #prepend>
            <el-select v-model="select" placeholder="请选择">
                <el-option label="工号" value="1"></el-option>
                <el-option label="vpn类型" value="2"></el-option>
                <el-option label="vpn线路" value="3"></el-option>
                <el-option label="vpn连接状态" value="4"></el-option>
                <el-option label="设备类型" value="5"></el-option>
                <el-option label="设备品牌" value="6"></el-option>
                <el-option label="设备系统" value="7"></el-option>
                <el-option label="设备系统版本" value="8"></el-option>
                <el-option label="出口ip" value="9"></el-option>
                <el-option label="日志等级" value="12"></el-option>
            </el-select>
        </template>
        <template #append>
            <el-button icon="el-icon-search" @click="findVpn"></el-button>
        </template>
        </el-input>
        &nbsp;
        <span >上传时间：</span>
            <el-date-picker
                v-model="startTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="开始日期"
                style="width: 30%">
            </el-date-picker>
            至
            <el-date-picker
                v-model="endTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="结束日期"
                style="width: 30%">
            </el-date-picker>
            <el-button icon="el-icon-search" @click="findByPushTime"></el-button>
            &nbsp;
            <span >更新时间：</span>
            <el-date-picker
                v-model="updateTime"
                type="date"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="更新日期"
                style="width: 30%">
            </el-date-picker>
            <el-button icon="el-icon-search" @click="findByUpdateTime"></el-button>
        <br><br>
        <el-table :data="tableData" border style="width: 100%" @selection-change="selectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column fixed type="index" label="序号" width="100">
            </el-table-column>
            <el-table-column prop="user_id" label="工号" width="120">
            </el-table-column>
            <el-table-column prop="vpn_type" label="VPN类型" width="150">
            </el-table-column>
            <el-table-column prop="vpn_line" label="VPN线路" width="220">
            </el-table-column>
            <el-table-column prop="vpn_status" label="VPN连接状态" width="300">
            </el-table-column>
            <el-table-column prop="device_type" label="设备类型" width="150">
            </el-table-column>
            <el-table-column prop="device_brand" label="设备品牌" width="180">
            </el-table-column>
            <el-table-column prop="device_system" label="设备系统" width="120">
            </el-table-column>
            <el-table-column prop="device_version" label="设备系统版本" width="120">
            </el-table-column>
            <el-table-column prop="export_ip" label="出口IP" width="150">
            </el-table-column>
            <el-table-column prop="push_time" label="上传时间" width="180">
            </el-table-column>
            <el-table-column prop="others" label="其他信息" width="150">
            </el-table-column>
            <el-table-column prop="update_time" label="更新时间" width="180">
            </el-table-column>
            <el-table-column prop="log_level" label="日志等级" width="150">
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
    </div>
</template>

<script>
    export default {
        inject: ['reload'], //依赖注入
        methods: {
            getList(that){
                this.$axios.get(this.baseUrl+'/listVpnLog/',{
                    params:{
                        page:that.currentPage,
                        pagesize:that.pageSize
                    }
                }).then(function (response) {
                    that.tableData = response.data.vpnLogs
                    that.total = response.data.totalElements
                })
            },
            findVpn(){
                let i = this.input
                this.$axios.get(this.baseUrl+'/findVpn/',{
                    params:{
                        param:i,
                        page:this.currentPage,
                        pagesize:this.pageSize,
                    }
                }).then(response => {
                    this.tableData = response.data.vpnLogs
                    this.total = response.data.totalElements
                })
            },
            findByPushTime(){
                let i = this.startTime
                let j = this.endTime
                this.$axios.get(this.baseUrl+'/findByPushTime/',{
                    params:{
                        startTime:i,
                        endTime:j,
                        page:this.currentPage,
                        pagesize:this.pageSize
                    }
                }).then(response => {
                    this.tableData = response.data.vpnLogs
                    this.total = response.data.totalElements
                })
            },
            findByUpdateTime(){
                let i = this.updateTime
                this.$axios.get(this.baseUrl+'/findByUpdateTime/',{
                    params:{
                        updateTime:i,
                        page:this.currentPage,
                        pagesize:this.pageSize
                    }
                }).then(response => {
                    this.tableData = response.data.vpnLogs
                    this.total = response.data.totalElements
                })
            },
            selectionChange(val){
                this.selectionList = val
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
                select:'',
                baseUrl: 'http://127.0.0.1:8000/vpnlog',
                input:'',
                pushTime:'',
                startTime:'',
                endTime:'',
                updateTime:'',
                selectionList:[],
                pageSize: 15,
                total: 0,
                tableData: [],
                currentPage: 1,
                center:true,
                dialogFormVisible: false,
                form: {
                    name: '',
                    phone:'',
                    password:''
                },
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

