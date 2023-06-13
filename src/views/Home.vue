<template>
    <div id="home" style="">
      <!-- style="width: 600px;height:400px;background-color:bisque;" -->
      <div id="main_xy" style="width: 1200px;height:900px;" ref="xyBox" ></div>
      <div id="main" style="width: 560px;height:400px;"></div>
    </div>
</template>

<script>
import { getTypeNum, getSevenNum } from '@/api/order'
import * as echarts from 'echarts/core'
import { GridComponent } from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
const date = new Date()
// 获取年份
const year = date.getFullYear()
// 获取月份
const month = date.getMonth() + 1
const time = year + '-' + month

echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition])

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Home',
  data () {
    return {
      typeData: [],
      ziqu: 0,
      waimai: 0,
      // date: Date.now(),
      list: [],
      timeList: [],
      numList: [],
      benefitList: []
    }
  },
  created () {
    this.init()
    getSevenNum().then(res => {
      this.list = res.data
      console.log(this.list)
      this.list.forEach(item => {
        this.timeList.push(item.time)
        this.numList.push(item.num)
        this.benefitList.push(item.benefit / 100)
      })
    })
  },
  mounted () {
    // 页面加载设置高度自适应
    window.onresize = () => {
      if (this.xyBox) this.xyBox.resize()
      this.resizeDom()
    }
    // 页面加载设置高度自适应
    this.resizeDom()
  },
  methods: {
    async init () {
      console.log(time)
      console.log(typeof time)
      const { data: type1 } = await getTypeNum(1, time)
      const { data: type2 } = await getTypeNum(2, time)
      this.typeData.push({ value: type1, name: '自取' })
      this.typeData.push({ value: type2, name: '外卖' })
      // this.drawPie()
      this.drawXY()
    },
    resizeDom () {
      const xy = document.getElementById('main_xy')
      const boxHeight = document.getElementById('home').clientHeight
      xy.style.height = (boxHeight / 2 - 65) + 'px'
    },
    drawPie () {
      const pie = this.$echarts.init(document.getElementById('main'))
      const option = {
        title: {
          text: '本月订单', // 主标题
          subtext: year + '年' + month + '月', // 副标题
          left: 'center' // title组件离容器左侧的距离
        },
        // 提示框组件
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: this.typeData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }

      option && pie.setOption(option)
    },
    // 渲染近七日数据的折线图
    drawXY () {
      const xy = this.$echarts.init(document.getElementById('main_xy'))
      const option = {
        title: {
          text: '近七日订单数', // 主标题
          subtext: year + '年' + month + '月', // 副标题
          left: 'center' // title组件离容器左侧的距离
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['每日订单数', '每日收益']
        },
        xAxis: {
          type: 'category',
          data: this.timeList
        },
        yAxis: [
          {
            type: 'value',
            name: '当日收益',
            positon: 'left',
            min: 0,
            axisLabel: {
              formatter: '{value} 元'
            }
          },
          {
            type: 'value',
            name: '当日订单数',
            min: 0,
            positon: 'right',
            axisLabel: {
              formatter: '{value} 单'
            }
          }
        ],
        series: [
          {
            name: '当日订单数',
            data: this.numList,
            type: 'line',
            stack: 'Total'
          },
          {
            name: '当日收益',
            data: this.benefitList,
            type: 'line',
            stack: 'Total'
          }
        ],
        grid: { // 让图表占满容器
          top: '0%',
          left: '0%',
          right: '0%',
          bottom: '0%',
          containLabel: true
        }

      }
      option && xy.setOption(option)
    }
  }
}
</script>

<style lang="less" scoped>
#home{
  height: 100%;
  width: 100%;
  max-width: calc(100%-190px);
  max-height: calc(100%-64px);
/** display: flex;
  justify-content: center;
  align-items: center; **/
}
</style>
