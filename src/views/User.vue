<template>
    <div class="dashboard-container">
        <div class="container">
          <!-- 头部搜索框+按钮 -->
          <div class="tablebar">
              <el-input
                  placeholder="请输入想要查询的用户昵称"
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
              <div class="tableLab">
                  <el-button type="primary" @click="query">查询</el-button>
                  <el-button type="primary" @click="reset">重置</el-button>
              </div>
          </div>
          <!-- 中间表格数据填充 -->
          <el-table
            stripe
            :data="list"
            class="tableBox">
            <el-table-column label="手机号" prop="phone"></el-table-column>
            <el-table-column label="用户性别" prop="sex">
              <template slot-scope="scope">{{ scope.row.sex !== null ? scope.row.type === 1 ? '先生' : '女士' : '未知'}}</template>
            </el-table-column>
            <el-table-column label="创建时间"  prop="createTime"></el-table-column>
            <el-table-column label="下单用户"  prop="phone"></el-table-column>
            <!-- 表头数据-- 操作 -->
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                    size="mini"
                    type="text"
                    class="editBtn"
                    @click="handleEdit(scope.$index, scope.row)">查看详情
                </el-button>
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
import { getDetail } from '@/api/order'
import { getUserList } from '@/api/user'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'user',
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
      const res = await getUserList(this.page, this.pageSize, this.searchMsg, this.searchUser)
      console.log('用户管理的list:', res)
      if (res.code === 200) {
        this.list = res.data.records
        this.counts = res.data.total
      } else {
        this.$message.error(res.msg || '操作失败')
      }
    },

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
