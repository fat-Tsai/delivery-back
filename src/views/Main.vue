<template>
    <div class="wrapper">
        <!-- 主页左侧边栏 -->
        <div class="sidebar-container">
            <!-- logo -->
            <div class="logo">
                <img src="../assets/login/login-logo.png" alt="" style="width: 117px; height: 32px">
            </div>
            <!-- 垂直菜单 -->
            <el-scrollbar>
                <el-menu
                    :default-active="index"
                    class="el-menu-demo"
                    background-color="#333"
                    text-color="#BFCBD9"
                    active-text-color="#fff"
                >
                    <!-- 这里缺少一个多级路由菜单 -->
                    <router-link v-for="item in list" :key="item.id" :to="indexPath">
                      <div>
                        <el-menu-item :index="item.id" @click="menuSwitch(item,false)">
                        <i class="iconfont" :class="item.icon"></i>
                        <span slot="title">{{item.name}}</span>
                        </el-menu-item>
                      </div>
                    </router-link>
                </el-menu>
            </el-scrollbar>
        </div>
        <!-- 主页右侧内容区 -->
        <div class="main-container">
            <!-- 头部位置放置二级路由和用户信息 -->
            <div class="navbar">
                <div class="label">
                  <span v-show="goBackFlag" class="goBack" @click="goBack(false)">
                    <i class="iconfont icon-fanhui1" style="font-size: 18px; align-items: center;"></i> 返回
                  </span>
                    <span>{{ indexName }}</span>
                </div>
                <div class="right-menu">
                    <div class="avatar-wrapper"> {{ getName }} </div>
                    <img src="../assets/icons/close.png" class="outLogin" alt="退出" @click="logout" style="width: 25px; height: 25px"/>
                </div>
            </div>
            <div class="main-body">
              <!-- 路由占位符 -->
              <router-view @change="activeChange"></router-view>
            </div>
        </div>
    </div>
</template>

<script>
import { logout } from '@/api/login'
import { menuList } from '@/api/menuList'
import { mapGetters } from 'vuex'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Main',
  data () {
    return {
      index: '1',
      indexName: '首页',
      indexPath: '/home',
      goBackFlag: false,
      list: menuList
    }
  },
  // 用created方法解决路由跳转刷新失败的问题
  created () {
    if (this.$router.path !== '/home') {
      this.$router.replace('/home')
    }
  },
  methods: {
    // 退出登录
    async logout () {
      const res = await logout()
      if (res.code === 200) {
        this.$message.success('退出登录成功')
        localStorage.removeItem('userInfo')
        this.$router.replace('/login')
      }
      console.log('退出登录')
    },
    // 切换子菜单
    menuSwitch (current, flag) {
      this.index = current.id
      this.indexName = current.name
      this.indexPath = current.path
      this.goBackFlag = flag
    },
    activeChange (val1, val2) {
      this.indexName = val1
      this.goBackFlag = val2
    },
    goBack (flag) {
      this.$router.back()
      this.goBackFlag = flag
    }
    /**
     * 页面刷新可以使用Router.reload(),相当于window.location.reload()
     */
  },
  // 计算属性
  computed: {
    ...mapGetters(['getName'])
  }
}
</script>

<style lang="less" scoped>
// 整个页面
.wrapper {
  display: flex;
  background-color: #f3f4f7;
  height: 100%;
  overflow: hidden;
}

// 侧边栏
.sidebar-container {
    width: 190px;
    height: 100%;
    background-color: #333;
    min-height: 100vh;
    .logo {
        width: 190px;
        height: 149px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

// 子菜单样式
// 在菜单样式有一点凹陷
.el-menu {
  border: none;
  height: 100%;
  width: 100% !important; // 宽度的设置100% !important
}
.el-menu .el-menu-item {
  color: #aeb5c4;
  height: 42px;
  line-height: 42px;
}
.el-menu .el-menu-item {
  padding: 0 0 0 32px !important;
  margin: 0 34px 20px 0;
  border-radius: 0 21px 21px 0 !important;
}
.el-menu .el-menu-item:hover {
  color: #ffffff !important;
  background-color: transparent !important;
}
.el-menu .el-menu-item:hover span {
  color: #ffffff !important;
}
.el-menu .el-menu-item:active {
  color: #333333 !important;
  background-color: transparent !important;
}
.el-menu .el-menu-item:active span {
  color: #333333 !important;
}
.el-menu .el-menu-item.is-active {
  background-color: #ffc200 !important;
  color: #333333 !important;
  border-radius: 0 21px 21px 0 !important;
}
.el-menu .el-menu-item.is-active span {
  color: #333333 !important;
  font-weight: 500 !important;
}
.el-menu-item i {
  color: inherit;
  font-size: 20px;
  margin-right: 10px;
}

// router-link包裹子菜单会出现下划线,router-link本质就是a标签,从网页检查来看也是,采用全局样式修改
// a {
//   text-decoration: none;
// }

// 右侧主要内容
.main-container {
    position: relative;
    height: 100%;
    width: calc(100% - 190px);
    background-color: #f3f4f7;
    overflow: hidden;
    .main-body {
      max-height: calc(100% - 64px);
      overflow: auto;
    }
}
.navbar {
    height: 64px;
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
    background-color: #fff;
    overflow: hidden;
    .label {
        color: #333333;
        height: 64px;
        font-size: 16px;
        // width: 300px
        padding-left: 22px;
        line-height: 64px;
        font-weight: 700;
        float: left;
        // 这个是动画效果 从左侧进入
        // opacity: 0;
        // animation: opacity 500ms ease-out 800ms forwards;
        .goBack {
          border-right: solid 1px #d8dde3;
          padding-right: 14px;
          margin-right: 14px;
          font-size: 16px;
          color: #333333;
          cursor: pointer;
          font-weight: 400;
        }
    }
    .right-menu {
        float: right;
        display: flex;
        margin-right: 34px;
        height: 100%;
        line-height: 64px;
        color: #333333;
        font-size: 14px;
        // 用户名
        .avatar-wrapper {
            font-weight: 600;
        }
        // 退出图标
        img {
            margin-top: 20px;
            margin-left: 10px;
            width: 25px;
            height: 25px;
        }
        .outLogin {
            cursor: pointer;
        }
    }
}
</style>
