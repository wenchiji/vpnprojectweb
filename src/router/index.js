import Vue from 'vue'
import VueRouter from 'vue-router'
import VpnLog from "../views/VpnLog";
import Index from "../views/Index";
import VpnLine from "@/views/VpnLine";
import VpnType from "@/views/VpnType";
import VpnUser from "@/views/VpnUser"
import Login from "@/views/Login";
import Manager from "@/views/Manager";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: "/login",
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/page',
    name: 'VPN系统管理',
    component: Index,
    show: true,
    children:[
      {
        path: '/vpnUser',
        name: 'Vpn人员权限清单',
        component: VpnUser
      },
        {
        path: '/vpnLine',
        name: 'Vpn线路管理',
        component: VpnLine
      },
        {
        path: '/vpnType',
        name: 'Vpn分类',
        component: VpnType
      },
    ]
  },
  {
    path: '/page1',
    name: 'VPN日志',
    component: Index,
    show:true,
    children:[
      {
        path: '/listVpnLog',
        name: 'VpnLog',
        component: VpnLog
      },
    ]
  },
  {
    path: '/page1',
    name: '设置',
    component: Index,
    show:true,
    children:[
      {
        path: '/manager',
        name: '管理员',
        component: Manager
      },
    ]
  },
]
// 创建路由对象
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

if (sessionStorage.getItem("token")){
  this.$store.commit("set_token", sessionStorage.getItem("token"))
}

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next();
  } else {
    let token = sessionStorage.getItem('Authorization');
    if (token === null || token === '') {
      next('/login');
    } else {
      next();
    }
  }
});


