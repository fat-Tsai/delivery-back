<template>
    <div>
        <div class="static-container">
            <div class="menu-container">
                <span v-for="item in menuList" :key="item" v-bind:class="item.color ? 'isRed' : ''" style="menu-item">{{item.name}} </span>
            </div>
            <div class="top-container">
              <div class="left">
                <img src="../assets/logo.png" alt="">
                <div class="logo">
                  <img src="../assets/app.png" alt="" style="height: 120px;width:120px;">
                  <div class="name">温州水利防汛</div>
                </div>

              </div>
              <div class="right">
                <div class="image-container">
                  <div class="image-item">
                    <img src="../assets/android.png" alt="">
                    <span>安卓二维码</span>
                  </div>
                  <div class="image-item">
                    <img src="../assets/ios.png" alt="">
                    <span>IOS二维码</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="main-container">
              <div class="main-body">
                <div class="left-title">
                  <h2>温州水利防护APP</h2>
                  <div>app作为作为系统延伸延伸，通过的延伸物联网物联网，数据现代信息信息技术技术技术技术超警江河山洪预警四大预报预报；信息通知水情雨情雨情内涝内涝监测监测监测监测监测，，基础基础，，短时短时预报预报等等五五数据数据功能功能模块模块模块， ，防汛功能功能模块，及时模块模块区域区域区域内水库水库，，河道，，，，山洪山洪山洪山洪山洪出现出现出现出现出现出现出现出现的的的的的的超警超警超警情况预警预警预警预警预警预警提示提示提示提示提示提示提示提示提示提示提示提示提示提示提示提示提示提示提示提示提示提示，提示人员随地水利情况情况情况情况，实现实现准备到到的的全全流程工作工作工作工作掌握掌握掌握。温州市温州市水利局水利局水利局承担温州温州水利水利防汛防汛防汛的的保护责任，该系统本单位的定级对象；系统系统系统模式模式为为模式模式模式模式模式模式的的的的混合混合开发模式模式模式模式的的的的的的的的的的的的的的的的的系统系统系统系统系统系统系统系统在这互联网区域区域区域区域区域区域采取云防护防护系统，，，，应用应用应用应用应用防火墙，网页防篡改防篡改，，，动态动态口令口令口令口令口令和数据库数据库审计审计审计审计等等等措施措施等等等SQLSERVER 2018，数据量约为500G，用户数量约为200个。</div>
                </div>
                <div class="right-img">
                  <el-carousel height="150px">
                    <!-- <el-carousel-item v-for="item in 4" :key="item">
                      <h3 class="small">{{ item }}</h3>
                    </el-carousel-item> -->
                    <el-carousel-item>
                      <img src="../assets/image_1.jpg" alt="">
                    </el-carousel-item>
                    <el-carousel-item>
                      <img src="../assets/image_2.jpg" alt="">
                    </el-carousel-item>
                    <el-carousel-item>
                      <img src="../assets/image_3.jpg" alt="">
                    </el-carousel-item>
                    <el-carousel-item>
                      <img src="../assets/image_4.jpg" alt="">
                    </el-carousel-item>
                  </el-carousel>
                </div>
              </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'static',
  data () {
    return {
      menuList: [
        { name: '首页', color: 'red' },
        { name: '关于我们' }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.static-container {
  background-color: #fff;
}
.isRed {
  color: red;
}
.menu-container {
  position: absolute;
  top: 10px;
  right: 50px;
}
.clearfix::after{
  display: block;
  clear:both;
  content: '';
  height: 0
}
.top-container{
  display: flex;
  height: 256px;
  padding: 10px 50px 0;
  width: calc(100% - 100px);
  .left {
    display: inline-block;
    .logo {
      .name {
        font-weight: bold;
      }
    }
  }

  .right {

    .image-container {
      .image-item {
        float: right;
        margin: 60px 25px 0;
        text-align: center;
        img {
          display: block;
          width: 160px;
        }
        span {
        }
      }
    }

  }
}

.main-container {
  background-color: antiquewhite;
  order: 1px solid #ccc;
  margin: 0 50px;
  min-height: calc(100% - 530px);
  .main-body{
    display: flex;
    padding: 0 25px;
    .left-title{
      width: 40%;
      h2 {}
      span {
        text-indent: 10px;
      }
    }
    .right-img{
    }
  }
}
</style>
