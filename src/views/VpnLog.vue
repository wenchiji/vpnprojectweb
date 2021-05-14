<template>
    <div>
        <div class="demo-input-suffix">
            工号：
            <el-input
                placeholder="请输入工号"
                style="width: 10%"
                v-model="userId">
            </el-input>
            vpn类型：
            <el-input
                placeholder="请输入vpn类型"
                style="width: 10%"
                v-model="vpnType">
            </el-input>
            vpn线路：
            <el-input
                placeholder="请输入vpn线路"
                style="width: 10%"
                v-model="vpnLine">
            </el-input>
            vpn连接状态：
            <el-input
                placeholder="请输入vpn连接状态"
                style="width: 10%"
                v-model="vpnStatus">
            </el-input>
            设备类型：
            <el-input
                placeholder="请输入设备类型"
                style="width: 10%"
                v-model="deviceType">
            </el-input>
            设备品牌：
            <el-input
                placeholder="请输入设备品牌"
                style="width: 10%"
                v-model="deviceBrand">
            </el-input>
            设备系统
            <el-input
                placeholder="请输入设备系统"
                style="width: 10%"
                v-model="deviceSystem">
            </el-input>
            设备系统版本
            <el-input
                placeholder="请输入设备系统版本"
                style="width: 10%"
                v-model="deviceVersion">
            </el-input>
            出口ip
            <el-input
                placeholder="请输入出口ip"
                style="width: 10%"
                v-model="exportIp">
            </el-input>
            日志等级
            <el-input
                placeholder="请输入日志等级"
                style="width: 10%"
                v-model="logLevel">
            </el-input>
           上传时间：
            <el-date-picker
                v-model="startTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="开始日期">
            </el-date-picker>
            至
            <el-date-picker
                v-model="endTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="结束日期">
            </el-date-picker>
            &nbsp;
            更新时间：
            <el-date-picker
                v-model="updateTime"
                type="date"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="更新日期">
            </el-date-picker>
            &nbsp;
            <el-button icon="el-icon-search" @click="findVpn" type="success">查 询</el-button>
        </div>
        <br><br>
        <el-table :data="tableData" border style="width: 100%" >
            <el-table-column fixed type="index" label="序号" width="80">
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
            // 后端接口调用函数
            getList(){
                this.queryParam.page = this.currentPage,
                this.queryParam.pagesize = this.pageSize
                let params = this.queryParam;
                this.$axios.post(this.baseUrl,{
                    action:params.action,
                    page:params.page,
                    pagesize:params.pagesize,
                    userId:params.userId,
                    vpnType: params.vpnType,
                    vpnLine: params.vpnLine,
                    vpnStatus: params.vpnStatus,
                    deviceType: params.deviceType,
                    deviceBrand: params.deviceBrand,
                    deviceSystem: params.deviceSystem,
                    deviceVersion:params.deviceVersion,
                    exportIp:params.exportIp,
                    logLevel:params.logLevel,
                    startTime:params.startTime,
                    endTime:params.endTime,
                    updateTime:params.updateTime,
                }).then( response => {
                    this.tableData = response.data.vpnLogs
                    this.total = response.data.totalElements
                })
            },
            ListAll(){
                this.queryParam.action = 'listVpnLog',
                this.getList()
            },
            findVpn(){
                this.queryParam.action = 'findVpn',
                this.queryParam.userId = this.userId
                this.queryParam.vpnType = this.vpnType
                this.queryParam.vpnLine = this.vpnLine
                this.queryParam.vpnStatus = this.vpnStatus
                this.queryParam.deviceType = this.deviceType
                this.queryParam.deviceBrand = this.deviceBrand
                this.queryParam.deviceSystem = this.deviceSystem
                this.queryParam.deviceVersion = this.deviceVersion
                this.queryParam.exportIp = this.exportIp
                this.queryParam.logLevel = this.logLevel
                this.queryParam.startTime = this.startTime
                this.queryParam.endTime = this.endTime
                this.queryParam.updateTime = this.updateTime
                this.getList()
            },
            pageChange(currentPage){
                const that = this
                that.currentPage = currentPage;
                that.getList();
            },
        },
        created() {
            const this1 = this
            this1.ListAll(this1)
        },
        data() {
            return {
                select:'',
                baseUrl: 'http://127.0.0.1:8000/vpnlog/getvpnlog/',
                // baseUrl: 'http://14.18.205.249:9002/vpnlog/getvpnlog/',
                input:'',
                userId:'',
                vpnType:'',
                vpnLine:'',
                vpnStatus:'',
                deviceType:'',
                deviceBrand:'',
                deviceSystem:'',
                deviceVersion:'',
                exportIp:'',
                logLevel:'',
                pushTime:'',
                startTime:'',
                endTime:'',
                updateTime:'',
                queryParam:{
                    action:'',
                    page:'',
                    pagesize:'',
                    input:'',
                    userId:'',
                    vpnType:'',
                    vpnLine:'',
                    vpnStatus:'',
                    deviceType:'',
                    deviceBrand:'',
                    deviceSystem:'',
                    deviceVersion:'',
                    exportIp:'',
                    loglevel:'',
                    pushTime:'',
                    startTime:'',
                    endTime:'',
                    updateTime:'',
                },
                pageSize: 10,
                total: 0,
                tableData: [],
                currentPage: 1,
                center:true,
                dialogFormVisible: false,
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
