<template>
    <div class="dashboard-container">
      <div class="container">
        <!-- 头部搜索框+按钮 -->
        <div class="tablebar">
            <el-button type="primary" @click="a" class="continue">新增菜品分类</el-button>
            <el-button type="primary" @click="b">新增套餐分类</el-button>
        </div>
        <!-- 中间表格数据填充 -->
        <el-table
          stripe
          :data="list"
          class="tableBox">
          <!-- 表头数据-- 员工姓名 -->
          <el-table-column label="分类名称" prop="name">
          </el-table-column>
          <!-- 表头数据-- 账号 -->
          <el-table-column label="分类类型" prop="username">
          </el-table-column>
          <!-- 表头数据-- 手机号 -->
          <el-table-column label="操作时间"  prop="phone">
          </el-table-column>
          <!-- 表头数据-- 账号状态 -->
          <el-table-column label="排序">
            <template slot-scope="scope">{{ scope.row.status === 1 ? "正常" : "已禁用"}}</template>
          </el-table-column>
          <!-- 表头数据-- 操作 -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                  size="mini"
                  type="text"
                  class="editBtn"
                  @click="handleEdit(scope.$index, scope.row)">修改</el-button>
              <el-button
                  size="mini"
                  type="text"
                  class="delBtn"
                  @click="handleStatus(scope.$index, scope.row)"
                  v-if="scope.row.status === 1">删除</el-button>
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Category',
  data () {
    return {
      list: [],
      page: 1,
      counts: 10,
      pageSize: 10
    }
  },
  methods: {
    handleEdit () {},
    handleSizeChange () {},
    handleCurrentChange () {}
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
      .continue {
        border-color: #333333 !important;
        background: #333333 !important;
        color: #ffffff !important;
      }
      .continue:hover {
        background-color: #999999 !important;
        border-color: #999999 !important;
        color: #ffffff !important;
      }
      .continue:active {
        background-color: #2a2a2a !important;
        border-color: #2a2a2a !important;
        color: #ffffff !important;
      }
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
