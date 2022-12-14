<template>
  <div class="dashboard-container">
      <div class="container">
        <!-- 头部搜索框+按钮 -->
        <div class="tablebar">
            <el-input
                placeholder="请输入想要查询的订单编号"
                v-model="searchMsg"
                clearable
                @keyup.enter.native="handleQuery"
                style="width: 250px;margin-right: 20px;">
                <i
                    slot="prefix"
                    class="el-input__icon el-icon-search"
                    style="cursor: pointer"
                    @click="handleQuery"></i>
            </el-input>
            <el-input
                placeholder="请输入用户手机号查询"
                v-model="searchUser"
                oninput="value=value.replace(/[^\d]/g,'')"
                clearable
                @keyup.enter.native="handleQuery"
                style="width: 250px;margin-right: 20px;"
                maxlength="11">
                <i
                    slot="prefix"
                    class="el-input__icon el-icon-search"
                    style="cursor: pointer"
                    @click="handleQuery"></i>
            </el-input>
            <el-date-picker
              v-model="value"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              style="margin-right: 20px"
              clearable>
            </el-date-picker>
            <div class="tableLab">
                <!-- <span class="span-btn delBtn" @click="deleteHandle('批量',null)">批量删除</span>
                <span class="span-btn editBtn" @click="statusHandle(1)">批量起售</span>
                <span class="span-btn delBtn" @click="statusHandle(0)">批量停售</span> -->
                <el-button type="primary" @click="query">查询</el-button>
                <el-button type="primary" @click="reset">重置</el-button>
            </div>
        </div>
        <!-- 中间表格数据填充 -->
        <el-table
          stripe
          :data="list"
          class="tableBox">
          <el-table-column label="订单编号" prop="id"></el-table-column>
          <el-table-column label="订单类型" prop="type">
            <template slot-scope="scope">{{ scope.row.type === 1 ? '自取' : '外卖'}}</template>
            <!-- <template slot-scope="{ row }">
              <el-image style="width: 40px; height: 40px; border:none;cursor: pointer;"
                :src="getImage(row.image)"
                :preview-src-list="[ `http://rkt7dnyi5.hn-bkt.clouddn.com/${row.image}` ]" >
                <div slot="error" class="image-slot">
                  <img src="@/assets/noImg.png"  style="width: 40px; height: 40px; border:none;" >
                </div>
              </el-image>
            </template> -->
          </el-table-column>
          <el-table-column label="取餐时间"  prop="takeTime">
            <template slot-scope="scope">{{ scope.row.takeTime ? scope.row.takeTime : '立即'}}</template>
          </el-table-column>
          <el-table-column label="下单用户"  prop="phone"></el-table-column>
          <el-table-column label="取餐号"  prop="code"></el-table-column>
          <el-table-column label="配送地址"  prop="consignee"></el-table-column>
          <el-table-column label="订单金额" prop="amount">
            <template slot-scope="scope">￥{{ scope.row.amount/100.00}}</template>
          </el-table-column>
          <el-table-column label="支付方式"  prop="payMethod">
            <template slot-scope="scope">{{ scope.row.payMethod === 1 ? '微信支付' : '余额支付'}}</template>
          </el-table-column>
          <el-table-column label="下单时间"  prop="orderTime"></el-table-column>
          <!-- 表头数据-- 操作 -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                  size="mini"
                  type="text"
                  class="editBtn"
                  @click="handleEdit(scope.$index, scope.row)">查看详情</el-button>
              <!-- <el-button
                  size="mini"
                  type="text"
                  class="delBtn"
                  @click="statusHandle(scope.row)"
                  >
                  {{ scope.row.status == '0' ? '启售' : '停售' }}
                </el-button>
              <el-button
                  size="mini"
                  type="text"
                  class="useBtn"
                  @click="deleteHandle('单个',scope.row.id)"
                  >删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <!-- 底部分页 -->
        <el-pagination
          class="pageList"
          :page-sizes="[10,20,30,40,50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="counts"
          :current-page.sync="page"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
        <!-- 弹出订单详细页面 -->
        <el-dialog
          title="订单详情"
          :visible.sync="dialogVisible"
          width="30%"
          :before-close="handleClose"
          center>
          <div class="code">取餐号<span>{{code}}</span></div>
          <span>选购的菜品</span>
          <div class="order">
            <div class="order-container" v-for="item in infoList" :key="item.id">
              <div class="left">
                <img src="@/assets/noImg.png"  style="width: 40px; height: 40px; border:none;" >
              </div>
              <div class="middle">
                <span>{{item.name}}</span>
                <span>{{item.dishFlavor}}</span>
              </div>
              <div class="right">X{{item.number}}</div>
            </div>
            <div class="remark">
              备注：{{remark ? remark : '无'}}
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
</template>

<script>
import { getOrderList, getDetail } from '@/api/order'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'order',
  data () {
    return {
      list: [],
      page: 1,
      pageSize: 10,
      counts: 0,
      // 搜索框绑定的信息
      searchMsg: '',
      // 搜索框绑定的用户信息
      searchUser: '',
      checkList: [],
      status: '',
      dialogVisible: false,
      infoList: [],
      // idx: '',
      code: '',
      remark: '',
      // 日期选择器绑定的参数
      value: ''
    }
  },
  created () {
    this.init()
  },
  methods: {
    reset () {
      this.searchMsg = ''
      this.value = ''
      this.searchUser = ''
      this.page = 1
      this.init()
    },
    query () {
      this.init()
      // 日期选择器有问题，点击清除会变成null,导致后端数据查询不出来
    },
    handleClose () {
      this.dialogVisible = false
    },
    handleQuery () {
      this.page = 1
      this.init()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.init()
    },
    handleCurrentChange (val) {
      this.page = val
      this.init()
    },
    // 查询订单信息
    handleEdit (index, row) {
      getDetail(row.id).then(res => {
        if (res.code === 200) {
          this.infoList = res.data
          // this.idx = index
          this.code = this.list[index].code
          this.remark = this.list[index].remark
        } else {
          this.$message.error(res.msg || '操作失败')
        }
      })
      this.dialogVisible = true
      // this.$router.push({ path: '/addSetmeal', query: { id: row.id } })
      // this.$emit('change', '修改套餐', true)
    },
    async init () {
      const res = await getOrderList(this.page, this.pageSize, this.searchMsg, this.value, this.searchUser)
      console.log('订单管理的list:', res)
      if (res.code === 200) {
        this.list = res.data.records
        this.counts = res.data.total
      } else {
        this.$message.error(res.msg || '操作失败')
      }
    },

    // 修改菜品状态
    // statusHandle (row) {
    //   console.log(typeof row)
    //   const params = {}
    //   // 分单个操作/批量操作,批量操作row为number,单个操作row为object
    //   // eslint-disable-next-line valid-typeof
    //   if (typeof row === 'number') {
    //     if (this.checkList.length === 0) {
    //       this.$message.warning('批量操作，请先勾选所需套餐')
    //       return false
    //     }
    //     params.ids = this.checkList.join(',')
    //     params.status = row
    //     console.log(params)
    //   } else {
    //     params.ids = row.id
    //     params.status = !row.status ? 1 : 0
    //     console.log(params)
    //   }
    //   this.$confirm('确认更改该菜品状态?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     updateSetmealStatus(params).then(res => {
    //       if (res.code === 200) {
    //         this.$message.success('套餐状态已经更改成功！')
    //         this.handleQuery()
    //       } else {
    //         this.$message.error(res.msg || '操作失败')
    //       }
    //     }).catch(err => {
    //       this.$message.error('请求出错了：' + err)
    //     })
    //   })
    // },

    // 删除菜品-- 这里是彻底删除，而不是逻辑删除
    // deleteHandle (type, id) {
    //   console.log(`type:${type},id:${id}`)
    //   if (type === '批量' && this.checkList.length === 0) {
    //     this.$message.warning('批量操作，请先勾选所需菜品')
    //     return false
    //   }
    //   this.$confirm('确认删除该菜品?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     deleteSetmeal(type === '批量' ? this.checkList.join(',') : id).then(res => {
    //       if (res.code === 200) {
    //         this.$message.success('菜品删除成功！')
    //         this.handleQuery()
    //       } else {
    //         this.$message.error(res.msg || '操作失败')
    //       }
    //     }).catch(err => {
    //       this.$message.error('请求出错了：' + err)
    //     })
    //   })
    // },
    // 设置选中行，用于批量操作
    handleSelectionChange (val) {
      // val指代选中的row,而这些row组成一个数组
      const checkArr = []
      val.forEach(element => {
        checkArr.push(element.id)
      })
      this.checkList = checkArr
    },
    getImage (image) {
      return `http://rkt7dnyi5.hn-bkt.clouddn.com/${image}`
    }
  }
}
</script>

<style lang="less" scoped>
.dashboard-container {
  padding: 20px;
  .container {
    padding: 30px 28px;
    background-color: #fff;
    .tablebar {
      display: flex;
      margin-bottom: 20px;
      .tableLab {
        .span-btn {
            cursor: pointer;
            display: inline-block;
            font-size: 14px;
            padding: 0 20px;
            color: #818693;
            border-right: solid 1px #d8dde3;
        }
      }
    }
    .tableBox {
      font-size: 13px;
    }
    .pageList {
      text-align: center;
      margin-top: 30px;
    }
    // 订单详情弹窗
    .order {
      .order-container {
        display: flex;
        flex-direction: row;
        margin: 10px 0;
        .left {
          margin-right: 10px;
        }
        .middle {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .right {
        }
      }
    }
  }
}
.tableBox el-table__body-wrapper tbody tr .cell .el-checkbox {
  display: block;
}
.el-checkbox__input .el-checkbox__inner {
  display: block;
}
</style>
