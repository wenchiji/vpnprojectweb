<template>
    <div>
        <div class="demo-input-suffix">
            vpn线路：
             <el-select v-model="vpnLine" placeholder="请选择线路">
                <el-option
                  v-for="item in lineoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            vpnIp：
             <el-input
                placeholder="vpn_ip"
                style="width: 10%"
                v-model="vpnIp">
            </el-input>
            线路状态值：
             <el-input
                placeholder="线路状态值"
                style="width: 10%"
                v-model="vpnStatus">
            </el-input>
           上传时间：
            <el-date-picker
                v-model="startTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="开始时间">
            </el-date-picker>
            至
            <el-date-picker
                v-model="endTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="结束时间">
            </el-date-picker>
            &nbsp;
            <el-button icon="el-icon-search" @click="findVpn" type="success">查 询</el-button>
        </div>
        <br><br>
        <el-table :data="tableData" border style="width: 100%" >
            <el-table-column fixed type="index" label="序号" width="80">
            </el-table-column>
            <el-table-column prop="vpn_line" label="VPN线路" width="220">
            </el-table-column>
            <el-table-column prop="vpn_ip" label="vpn_ip" width="220">
            </el-table-column>
            <el-table-column prop="status" label="线路状态" width="220">
            </el-table-column>
            <el-table-column prop="packet_loss" label="线路丢包率" width="300">
            </el-table-column>
            <el-table-column prop="packet_list" label="ping返回值" width="300">
            </el-table-column>
            <el-table-column prop="log_time" label="上传时间" width="180">
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
                    vpnLine: params.vpnLine,
                    vpnIp:params.vpnIp,
                    vpnStatus: params.vpnStatus,
                    packetLoss: params.packetLoss,
                    packetList:params.packetList,
                    logTime:params.logTime,
                    startTime:params.startTime,
                    endTime:params.endTime,
                }).then( response => {
                    this.tableData = response.data.lineStatusLogs
                    this.total = response.data.totalElements
                })
            },
            ListAll(){
                this.queryParam.action = 'listLineStatusLog',
                this.getList()
            },
            findVpn(){
                this.queryParam.action = 'findStatusLog',
                this.queryParam.userId = this.userId
                this.queryParam.vpnLine = this.vpnLine
                this.queryParam.vpnIp = this.vpnIp
                this.queryParam.vpnStatus = this.vpnStatus
                this.queryParam.startTime = this.startTime
                this.queryParam.endTime = this.endTime
                this.queryParam.logTime = this.logTime
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
                lineoptions:[{
                    value:'BOSS-海外专线1',
                    label:'BOSS-海外专线1'
                },{
                    value:'BOSS-海外专线2',
                    label:'BOSS-海外专线2'
                },{
                    value:'BOSS-海外专线3',
                    label:'BOSS-海外专线3'
                }],
                select:'',
                baseUrl: this.$root.URL+'vpnlog/getlinestatuslog/',
                input:'',
                vpnLine:'',
                vpnIp:'',
                vpnStatus:'',
                pushTime:'',
                startTime:'',
                endTime:'',
                queryParam:{
                    action:'',
                    page:'',
                    pagesize:'',
                    input:'',
                    vpnLine:'',
                    vpnIp:'',
                    vpnStatus:'',
                    packetLoss:'',
                    packList:'',
                    pushTime:'',
                    startTime:'',
                    endTime:'',
                },
                pageSize: 10,
                total: 0,
                tableData: [],
                currentPage: 1,
                center:true,
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
