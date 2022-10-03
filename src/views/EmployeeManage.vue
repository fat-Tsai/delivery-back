<template>
    <div class="dashboard-container">
      <div class="container">
        <!-- 头部搜索框+按钮 -->
        <div class="tablebar">
            <el-input
                placeholder="请输入员工姓名"
                v-model="input"
                clearable
                @keyup.enter.native="handleQuery"
                style="width: 250px">
                <i
                    slot="prefix"
                    class="el-input__icon el-icon-search"
                    style="cursor: pointer"
                    @click="handleQuery"></i>
            </el-input>
            <el-button type="primary" @click="addEmployeeHandle">添加员工</el-button>
        </div>
        <!-- 中间表格数据填充 -->
        <el-table
          stripe
          :data="list"
          class="tableBox">
          <!-- 表头数据-- 员工姓名 -->
          <el-table-column label="员工姓名" prop="name">
          </el-table-column>
          <!-- 表头数据-- 账号 -->
          <el-table-column label="账号" prop="username">
          </el-table-column>
          <!-- 表头数据-- 手机号 -->
          <el-table-column label="手机号"  prop="phone">
          </el-table-column>
          <!-- 表头数据-- 账号状态 -->
          <el-table-column label="账号状态">
            <template slot-scope="scope">{{ scope.row.status === 1 ? "正常" : "已禁用"}}</template>
          </el-table-column>
          <!-- 表头数据-- 操作 -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                  size="mini"
                  type="text"
                  class="editBtn"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                  size="mini"
                  type="text"
                  class="delBtn"
                  @click="handleStatus(scope.$index, scope.row)"
                  v-if="scope.row.status === 1">禁用</el-button>
              <el-button
                  size="mini"
                  type="text"
                  class="useBtn"
                  @click="handleStatus(scope.$index, scope.row)"
                  v-if="scope.row.status === 0">启用</el-button>
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
          :pager-count="10"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
</template>

<script>
import { getEmployeeList, enableOrDisableEmployee } from '@/api/employee.js'
export default {
  name: 'EmployeeManage',
  data () {
    return {
      input: '',
      list: [],
      page: 1,
      counts: 10,
      pageSize: 10,
      id: '',
      status: ''
    }
  },
  created () {
    this.init()
  },
  methods: {
    async init () {
      const res = await getEmployeeList(this.page, this.pageSize, '')
      if (res.code === 200) {
        this.list = res.data.records
        this.counts = res.data.total
      }
      console.log(res)
    },
    // 搜索方法
    handleQuery () {
      this.page = 1
      this.init()
    },
    // 跳转到添加员工页面
    addEmployeeHandle () {
      this.$router.push('/addEmployee')
      this.$emit('change', '添加员工', true)
    },
    // 编辑
    handleEdit (index, row) {
      console.log('row:', row) // index是行数，从0开始；row对应的是list[index]
      this.$router.push({ path: '/addEmployee', query: { id: row.id } })
      this.$emit('change', '修改员工', true)
    },
    handleStatus (index, row) {
      this.id = row.id
      this.status = !row.status ? 1 : 0
      this.$confirm('确认调整该账号的状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        enableOrDisableEmployee({ id: this.id, status: this.status }).then(res => {
          if (res.code === 200) {
            this.$message.success('账号状态更改成功！')
            this.handleQuery()
          }
        }).catch(err => {
          this.$message.error('请求出错了：' + err)
        })
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.init()
    },
    handleCurrentChange (val) {
      this.page = val
      this.init()
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
      justify-content: space-between;
    }
    .tableBox {
      font-size: 13px;
    }
    .pageList {
      text-align: center;
      margin-top: 30px;
    }
  }
}
.el-table td, .el-table th {
  padding: 12px 0;
  min-width: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
  text-align: left;  // 左对齐
}
.el-table .cell, .el-table th div {
  padding-right: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
